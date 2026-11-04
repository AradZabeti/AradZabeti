"""Regression tests for the GitHub Pages export checker."""
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from check_site_links import check_site


class SiteLinkTests(unittest.TestCase):
    def test_internal_links_assets_and_external_urls(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "index.html").write_text(
                '<a href="/AradZabeti/about.html">About</a>'
                '<img src="/AradZabeti/images/hero.svg" alt="Hero">'
                '<a href="https://github.com/AradZabeti">GitHub</a>'
                '<a href="#main">Skip</a>',
                encoding="utf-8",
            )
            (root / "about.html").write_text("<h1>About</h1>", encoding="utf-8")
            (root / "images").mkdir()
            (root / "images/hero.svg").write_text("<svg/>", encoding="utf-8")
            self.assertEqual(check_site(root), [])

    def test_nested_clean_urls_and_sitemap(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "index.html").write_text(
                '<a href="/AradZabeti/fa/">Persian</a>', encoding="utf-8"
            )
            (root / "fa").mkdir()
            (root / "fa/index.html").write_text(
                '<a href="../">Home</a>', encoding="utf-8"
            )
            (root / "sitemap.xml").write_text(
                '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
                '<url><loc>https://aradzabeti.github.io/AradZabeti/fa/</loc></url>'
                '</urlset>',
                encoding="utf-8",
            )
            self.assertEqual(check_site(root), [])

    def test_missing_and_wrongly_prefixed_links_are_reported(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "index.html").write_text(
                '<img src="/AradZabeti/images/absent.svg">'
                '<a href="/not-under-project/">Bad URL</a>', encoding="utf-8"
            )
            issues = check_site(root)
            self.assertEqual(len(issues), 2)
            self.assertTrue(any("absent.svg" in issue for issue in issues))
            self.assertTrue(any("/not-under-project/" in issue for issue in issues))

    def test_srcset_asset_check(self):
        with TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "index.html").write_text(
                '<img srcset="/AradZabeti/a.webp 1x, /AradZabeti/b.webp 2x">',
                encoding="utf-8",
            )
            (root / "a.webp").write_bytes(b"test")
            self.assertEqual(len(check_site(root)), 1)


if __name__ == "__main__":
    unittest.main()
