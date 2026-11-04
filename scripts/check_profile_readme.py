#!/usr/bin/env python3
"""Check the public GitHub profile README and local visual assets."""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
README = ROOT / "README.md"
MARKDOWN_LINK = re.compile(r"!?(?:\[[^\]]*\])\(([^)]+)\)")


class ProfileHTML(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_by_name = dict(attrs)
        if tag == "img":
            src = attrs_by_name.get("src")
            if not src:
                self.errors.append("HTML img is missing a src attribute")
            else:
                self.links.append(src)
            if "alt" not in attrs_by_name:
                self.errors.append(f"HTML img is missing alt text: {src}")
        if tag == "a" and attrs_by_name.get("href"):
            self.links.append(attrs_by_name["href"] or "")


def local_destination(raw: str) -> Path | None:
    reference = raw.strip()
    if not reference or reference.startswith("#"):
        return None
    url = urlsplit(reference)
    if url.scheme or url.netloc or reference.startswith("//"):
        return None
    relative = unquote(url.path)
    if not relative:
        return None
    # README asset paths should be root-relative to this repository,
    # never another public host or a parent directory.
    if relative.startswith("/"):
        return ROOT / "__BAD_ABSOLUTE_PATH__" / relative.lstrip("/")
    dest = (ROOT / relative).resolve()
    if not dest.is_relative_to(ROOT.resolve()):
        return ROOT / "__BAD_PARENT_TRAVERSAL__"
    return dest


def main() -> int:
    if not README.is_file():
        print("Missing README.md")
        return 1

    body = README.read_text(encoding="utf-8")
    parser = ProfileHTML()
    parser.feed(body)
    errors = list(parser.errors)
    links = parser.links + MARKDOWN_LINK.findall(body)

    for raw in links:
        target = local_destination(raw)
        if target is not None and not target.exists():
            errors.append(f"Broken local README reference: {raw}")

    for path in sorted((ROOT / "assets").glob("*.svg")):
        try:
            document = ElementTree.parse(path)
            if not document.getroot().tag.endswith("svg"):
                errors.append(f"Not an SVG document: {path.relative_to(ROOT)}")
        except ElementTree.ParseError as exc:
            errors.append(f"Malformed SVG {path.relative_to(ROOT)}: {exc}")

    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors))
        return 1
    print(f"Profile OK: {len(links)} local/external references reviewed; SVG assets parse cleanly.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
