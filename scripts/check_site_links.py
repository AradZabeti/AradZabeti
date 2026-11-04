#!/usr/bin/env python3
"""Check that GitHub Pages HTML links and local assets exist in the export.

Only URLs targeting this site's own Pages origin are checked. External URLs,
mailto links, and fragment-only navigation are intentionally left alone.
"""
from __future__ import annotations

import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
from xml.etree import ElementTree

PAGES_ORIGIN = "https://aradzabeti.github.io"
BASE_PATH = "/AradZabeti"
IGNORED_DIRS = {"_next", "universe-source", ".git", ".github", "node_modules"}


class ReferenceParser(HTMLParser):
    """Extract navigation and resource URLs with their source line numbers."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.references: list[tuple[int, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for attr in ("href", "src", "poster"):
            if values.get(attr) and (
                (attr == "href" and tag in {"a", "link", "area"})
                or (attr == "src" and tag in {"img", "script", "iframe", "source", "video", "audio", "embed"})
                or (attr == "poster" and tag == "video")
            ):
                self.references.append((self.getpos()[0], values[attr] or ""))
        if tag in {"img", "source"} and values.get("srcset"):
            for entry in values["srcset"].split(","):
                url = entry.strip().split(None, 1)[0] if entry.strip() else ""
                if url:
                    self.references.append((self.getpos()[0], url))


def site_target(root: Path, source: str, ref: str) -> Path | None:
    """Return the local target of an internal URL, or None for external URLs."""
    if not ref.strip() or ref.lstrip().startswith("#"):
        return None
    source_url = f"{PAGES_ORIGIN}{BASE_PATH}/{source}"
    target = urlsplit(urljoin(source_url, ref.strip()))
    if target.scheme not in {"http", "https"} or target.netloc.lower() != "aradzabeti.github.io":
        return None
    path = unquote(target.path)
    if path == BASE_PATH:
        relative = ""
    elif path.startswith(BASE_PATH + "/"):
        relative = path[len(BASE_PATH) + 1:]
    else:
        # A root-relative URL without the GitHub Pages project prefix is broken.
        return root / "__OUTSIDE_PAGES_BASE__" / path.lstrip("/")
    resolved = (root / relative).resolve()
    try:
        resolved.relative_to(root.resolve())
    except ValueError:
        return root / "__OUTSIDE_PAGES_BASE__" / "path-traversal"
    if path.endswith("/") or resolved.is_dir():
        return resolved / "index.html"
    if not resolved.exists() and not resolved.suffix and resolved.with_suffix(".html").is_file():
        return resolved.with_suffix(".html")
    return resolved


def check_site(root: Path) -> list[str]:
    errors: list[str] = []
    html_files = sorted(
        path for path in root.rglob("*.html")
        if not any(part in IGNORED_DIRS for part in path.relative_to(root).parts[:-1])
    )
    if not html_files:
        return ["No exported HTML pages found."]

    for page in html_files:
        source = page.relative_to(root).as_posix()
        parser = ReferenceParser()
        parser.feed(page.read_text(encoding="utf-8"))
        for line, ref in parser.references:
            target = site_target(root, source, ref)
            if target is not None and not target.is_file():
                errors.append(f"{source}:{line}: missing local target {ref!r}")

    sitemap = root / "sitemap.xml"
    if sitemap.is_file():
        try:
            document = ElementTree.parse(sitemap)
            for element in document.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
                ref = (element.text or "").strip()
                target = site_target(root, "index.html", ref)
                if target is not None and not target.is_file():
                    errors.append(f"sitemap.xml: missing page {ref!r}")
        except ElementTree.ParseError as exc:
            errors.append(f"sitemap.xml: invalid XML: {exc}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    root = args.root.resolve()
    errors = check_site(root)
    if errors:
        print(f"Found {len(errors)} broken reference(s):")
        for error in errors:
            print(" -", error)
        return 1
    print("All exported HTML references and sitemap URLs resolve to local files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
