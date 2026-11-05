/* Futuristic AI / Phase 03 — progressive neural-field enhancement.
   A tiny, projected 3D point cloud on a 2D canvas. No WebGL or dependencies. */
(() => {
  "use strict";
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smallQuery = window.matchMedia("(max-width: 700px)");
  const slowConnection = !!(navigator.connection && navigator.connection.saveData);
  const page = document.documentElement;
  let started = false;

  function initialize() {
    if (started) return;
    const stage = document.querySelector(".scene-stage");
    if (!stage) return;
    started = true;
    const canvas = document.createElement("canvas");
    canvas.className = "phase3-neural-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    stage.appendChild(canvas);

    const mobile = smallQuery.matches;
    const count = mobile ? 24 : 44;
    const points = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / Math.max(1, count - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
    });
    const edges = [];
    const maxEdges = mobile ? 43 : 110;
    for (let i = 0; i < count; i++) {
      const links = [];
      for (let j = i + 1; j < count; j++) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dz = points[i][2] - points[j][2];
        const dist = dx * dx + dy * dy + dz * dz;
        if (dist < 0.88) links.push([j, dist]);
      }
      links.sort((a, b) => a[1] - b[1]);
      for (let k = 0; k < Math.min(3, links.length); k++) {
        if (edges.length >= maxEdges) break;
        edges.push([i, links[k][0]]);
      }
      if (edges.length >= maxEdges) break;
    }

    let width = 1;
    let height = 1;
    let visible = false;
    let disposed = false;
    let frameId = 0;
    let previous = 0;
    let clock = 0;
    let pointerX = 0;
    let pointerY = 0;
    let dirty = true;
    const frameGap = mobile ? 52 : 34;

    function reduced() {
      return motionQuery.matches || page.dataset.motion === "low" || slowConnection;
    }

    function resize() {
      if (disposed) return;
      const rect = stage.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const ratio = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.4);
      const targetW = Math.round(width * ratio);
      const targetH = Math.round(height * ratio);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      dirty = true;
      requestFrame();
    }

    function render() {
      ctx.clearRect(0, 0, width, height);
      const light = page.dataset.theme === "light";
      const theta = -0.28 + clock * 0.10 + pointerX * 0.18;
      const phi = 0.16 + Math.sin(clock * 0.18) * 0.09 + pointerY * 0.13;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      const extent = Math.min(width * 0.30, height * 0.41);
      const centerX = width * 0.56;
      const centerY = height * 0.48;
      const projected = points.map((point) => {
        const x = point[0] * cos - point[2] * sin;
        const z = point[0] * sin + point[2] * cos;
        const y = point[1] * cosPhi - z * sinPhi;
        const depth = point[1] * sinPhi + z * cosPhi;
        const perspective = 2.3 / (2.8 - depth);
        return [
          centerX + x * extent * perspective,
          centerY + y * extent * perspective,
          depth
        ];
      });

      ctx.lineWidth = light ? 0.7 : 0.95;
      for (const [a, b] of edges) {
        const start = projected[a];
        const end = projected[b];
        const visibility = Math.max(0.07, 0.24 + (start[2] + end[2]) * 0.16);
        ctx.strokeStyle = light
          ? "rgba(20,100,164," + visibility.toFixed(3) + ")"
          : "rgba(107,206,250," + visibility.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      }

      for (let i = 0; i < projected.length; i++) {
        const point = projected[i];
        const radius = Math.max(0.8, 1.6 + point[2] * 0.75);
        const alpha = Math.max(0.22, Math.min(0.9, 0.6 + point[2] * 0.22));
        ctx.fillStyle = (i % 4 === 0)
          ? (light ? "rgba(112,66,194," : "rgba(189,158,255,") + alpha + ")"
          : (light ? "rgba(17,123,159," : "rgba(113,231,250,") + alpha + ")";
        ctx.beginPath();
        ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function requestFrame() {
      if (disposed || !visible || document.hidden || frameId) return;
      frameId = requestAnimationFrame(tick);
    }

    function tick(now) {
      frameId = 0;
      if (disposed || !visible || document.hidden) return;
      const staticOnly = reduced();
      if (!dirty && staticOnly) return;
      if (previous && now - previous < frameGap && !staticOnly) {
        requestFrame();
        return;
      }
      if (!staticOnly && previous) clock += Math.min((now - previous) / 1000, 0.09);
      previous = now;
      dirty = false;
      render();
      if (!staticOnly) requestFrame();
    }

    function onPointer(event) {
      if (mobile || reduced()) return;
      const bounds = stage.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      dirty = true;
      requestFrame();
    }

    function refresh() {
      dirty = true;
      if (reduced()) {
        clock = 0;
        previous = 0;
      }
      cancelAnimationFrame(frameId);
      frameId = 0;
      requestFrame();
    }

    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) refresh();
      else {
        cancelAnimationFrame(frameId);
        frameId = 0;
        previous = 0;
      }
    }, { threshold: 0.04 });
    observer.observe(stage);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(stage);
    const stateObserver = new MutationObserver(refresh);
    stateObserver.observe(page, { attributes: true, attributeFilter: ["data-motion", "data-theme"] });
    stage.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", refresh);
    motionQuery.addEventListener("change", refresh);

    window.addEventListener("pagehide", () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      sizeObserver.disconnect();
      stateObserver.disconnect();
      motionQuery.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      stage.removeEventListener("pointermove", onPointer);
      canvas.remove();
    }, { once: true });
    resize();
  }

  if (document.readyState === "complete") initialize();
  else window.addEventListener("load", initialize, { once: true });
})();
