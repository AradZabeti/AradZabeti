"""Regression checks for locally authored Futuristic AI profile artwork."""
from pathlib import Path
import re
import unittest
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
SVG_NS = "{http://www.w3.org/2000/svg}"
ASSETS = {
    "github-cover.svg": (1600, 560),
    "github-universe.svg": (760, 340),
    "github-kooktools.svg": (760, 340),
}


class FuturisticBrandTests(unittest.TestCase):
    def test_accessible_self_contained_svg_assets(self):
        for name, (width, height) in ASSETS.items():
            with self.subTest(asset=name):
                path = ROOT / "assets" / name
                content = path.read_text(encoding="utf-8")
                root = ElementTree.fromstring(content)
                self.assertEqual(root.tag, SVG_NS + "svg")
                self.assertEqual(int(root.attrib["width"]), width)
                self.assertEqual(int(root.attrib["height"]), height)
                self.assertEqual(
                    root.attrib["viewBox"], f"0 0 {width} {height}"
                )
                self.assertIn("role", root.attrib)
                title = root.find(SVG_NS + "title")
                description = root.find(SVG_NS + "desc")
                self.assertIsNotNone(title)
                self.assertIsNotNone(description)
                self.assertTrue((title.text or "").strip())
                self.assertTrue((description.text or "").strip())
                self.assertEqual(root.attrib.get("aria-labelledby"),
                                 f"{title.attrib['id']} {description.attrib['id']}")
                self.assertLess(len(content.encode("utf-8")), 40_000)
                self.assertNotIn("<script", content.lower())
                self.assertNotIn("foreignObject", content)
                self.assertNotIn("<image", content)
                self.assertNotIn("@import", content)
                self.assertNotIn("http://", content)
                self.assertNotIn("javascript:", content.lower())
                ids = [element.get("id") for element in root.iter()
                       if element.get("id")]
                self.assertEqual(len(ids), len(set(ids)))

    def test_readme_references_assets_and_design_spec(self):
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        for name in ASSETS:
            with self.subTest(asset=name):
                self.assertIn(f"./assets/{name}", readme)
        self.assertIn("./docs/FUTURISTIC_AI_DESIGN.md", readme)
        self.assertIn("NEXT.JS", (ROOT / "assets/github-universe.svg")
                      .read_text(encoding="utf-8"))
        self.assertRegex(readme, r"\b(AI AUTOMATION|AI &amp; AUTOMATION|AI & AUTOMATION)\b")

    def test_svg_contains_no_external_link_targets(self):
        for name in ASSETS:
            with self.subTest(asset=name):
                root = ElementTree.parse(ROOT / "assets" / name).getroot()
                for element in root.iter():
                    for key, val in element.attrib.items():
                        if key.endswith("href"):
                            self.assertTrue(val.startswith("#"), (name, val))


if __name__ == "__main__":
    unittest.main()
