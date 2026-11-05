"""Phase 3 regression coverage for the live static export and Next.js source.

Protects GitHub Pages route parity, dependency-free motion, bilingual support and
the shared CSS/JS assets. These checks run in the Portfolio integrity workflow.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PUBLISHED = ROOT / "assets"
SOURCE = ROOT / "universe-source" / "public" / "assets"
ASSETS = ("futuristic-phase3.css", "futuristic-phase3.js")
BASE = "/AradZabeti/assets"
ROUTES = (
    "index.html",
    "en/index.html",
    "fa/index.html",
    "404.html",
    "404/index.html",
    "_not-found/index.html",
    *(
        f"{language}/projects/{project}/index.html"
        for language in ("en", "fa")
        for project in ("automation-lab", "digital-universe", "kooktools", "money-flow")
    ),
)


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link":
            self.links.append(attrs.get("href", ""))
        if tag == "script":
            self.scripts.append(attrs.get("src", ""))


class FuturisticPhase3Tests(unittest.TestCase):
    def test_published_and_next_public_assets_are_identical(self):
        for name in ASSETS:
            with self.subTest(name=name):
                self.assertEqual(
                    (PUBLISHED / name).read_bytes(),
                    (SOURCE / name).read_bytes(),
                )
                self.assertLess((PUBLISHED / name).stat().st_size, 20_000)

    def test_all_static_next_routes_load_single_local_enhancement(self):
        for route in ROUTES:
            with self.subTest(route=route):
                html = (ROOT / route).read_text(encoding="utf-8")
                head = html.split("</head>", 1)[0]
                parsed = HeadParser()
                parsed.feed(head)
                self.assertEqual(parsed.links.count(BASE + "/" + ASSETS[0]), 1)
                self.assertEqual(parsed.scripts.count(BASE + "/" + ASSETS[1]), 1)
                self.assertIn("/AradZabeti/_next/", html)
                self.assertNotIn("https://cdn.", head)

    def test_next_layout_keeps_export_assets_in_sync(self):
        src = (ROOT / "universe-source/src/app/layout.tsx").read_text(encoding="utf-8")
        for name in ASSETS:
            with self.subTest(name=name):
                self.assertIn("/assets/" + name, src)
        self.assertIn("NEXT_PUBLIC_BASE_PATH", src)

    def test_motion_performance_and_accessibility_guardrails(self):
        css = (PUBLISHED / ASSETS[0]).read_text(encoding="utf-8")
        js = (PUBLISHED / ASSETS[1]).read_text(encoding="utf-8")
        for token in (
            "prefers-reduced-motion:reduce",
            'data-motion="low"',
            "max-width:650px",
            'dir="rtl"',
            "phase3-neural-canvas",
            ":focus-visible",
        ):
            with self.subTest(css=token):
                self.assertIn(token, css)
        for token in (
            "requestAnimationFrame",
            "cancelAnimationFrame",
            "IntersectionObserver",
            "ResizeObserver",
            "MutationObserver",
            "saveData",
            'aria-hidden',
            "getContext(\"2d\"",
            "document.hidden",
            "pagehide",
        ):
            with self.subTest(js=token):
                self.assertIn(token, js)
        for banned in ("fetch(", "XMLHttpRequest", "eval(", "localStorage",
                       "new Worker(", "getContext(\"webgl"):
            with self.subTest(banned=banned):
                self.assertNotIn(banned, js)


if __name__ == "__main__":
    unittest.main()
