"""Regression checks for Futuristic AI source-level rendering and accessibility."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1] / "universe-source"
SCENE = ROOT / "src/components/3d/SceneStage.tsx"
SCULPTURE = ROOT / "src/components/3d/Sculpture.tsx"
NEURAL = ROOT / "src/components/3d/NeuralField.tsx"
CSS = ROOT / "src/styles/futuristic.css"
PAGE = ROOT / "src/components/Portfolio.tsx"
LAYOUT = ROOT / "src/app/layout.tsx"


class FuturisticWebTests(unittest.TestCase):
    def test_lazy_webgl_and_reduced_motion_support(self):
        stage = SCENE.read_text(encoding="utf-8")
        self.assertIn("dynamic(()=>import('./Sculpture'),{ssr:false})", stage)
        self.assertIn("render3D&&<Sculpture", stage)
        self.assertIn("lowMotion||window.matchMedia", stage)
        self.assertIn("connection?.saveData", stage)
        self.assertIn("IntersectionObserver", stage)
        self.assertIn('onLoad={onReady} onError={onReady}', stage)
        self.assertIn('aria-label={fa?', stage)
        self.assertIn("onKeyDown={e=>", stage)

    def test_bounded_webgl_rendering_and_context_fallback(self):
        source = SCULPTURE.read_text(encoding="utf-8")
        self.assertIn("compact?108:192", source)
        self.assertIn("compact?14:26", source)
        self.assertIn("compact?1:1.4", source)
        self.assertIn("compact?24:30", source)
        self.assertIn("webglcontextlost", source)
        self.assertIn("cancelAnimationFrame(frame)", source)
        self.assertIn("geo.dispose()", source)
        self.assertIn("renderer.dispose()", source)

    def test_visual_layer_is_deterministic_decorative(self):
        neural = NEURAL.read_text(encoding="utf-8")
        self.assertIn('aria-hidden="true"', neural)
        self.assertIn('viewBox="0 0 640 640"', neural)
        self.assertIn("Math.cos(theta)", neural)
        self.assertNotIn("Math.random", neural)
        self.assertNotIn("fetch(", neural)
        self.assertNotIn("requestAnimationFrame", neural)

    def test_responsive_motion_safe_layout(self):
        css = CSS.read_text(encoding="utf-8")
        self.assertIn("@media(max-width:650px)", css)
        self.assertIn("@media(max-width:390px)", css)
        self.assertIn("@media(prefers-reduced-motion:reduce)", css)
        self.assertIn('[data-motion="low"]', css)
        self.assertIn('[dir="rtl"]', css)
        self.assertIn('[data-theme="light"]', css)
        self.assertIn("min-width:44px", css)
        layout = LAYOUT.read_text(encoding="utf-8")
        self.assertIn("import '../styles/futuristic.css';", layout)

    def test_bilingual_landing_copy(self):
        page = PAGE.read_text(encoding="utf-8")
        self.assertIn("hero-futuristic", page)
        self.assertIn("ENGINEERING", page)
        self.assertIn("سیستم‌های هوشمند", page)
        self.assertIn("کد و ایده.", page)
        self.assertIn("Explore my work", page)


if __name__ == "__main__":
    unittest.main()
