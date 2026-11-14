/*
 * Liquid glass: the refraction behind the nav bar.
 *
 * We draw a "displacement map" for the pill shape: a small image whose red and
 * green channels say, for every pixel, how far to bend the page behind it. In the
 * middle of the pill nothing moves; towards the rounded rim the page is pulled in
 * from outside the edge, the way a thick piece of curved glass bends what's behind it.
 * An SVG filter applies that map to the backdrop, once per colour channel at
 * slightly different strengths, which gives the faint rainbow fringe at the rim.
 *
 * This needs `backdrop-filter: url(#…)`, which only Chromium browsers support today.
 * Everywhere else the nav keeps a plain frosted blur.
 */

export const supportsLiquidGlass = () => {
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  const uaData = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData;
  const chromium = !!uaData?.brands?.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
  return chromium && CSS.supports("backdrop-filter", "url(#a)");
};

/** Signed distance from point (x, y) to a rounded rectangle centred on the origin (negative inside). */
function roundedRectDistance(x: number, y: number, hw: number, hh: number, r: number) {
  const qx = Math.abs(x) - (hw - r);
  const qy = Math.abs(y) - (hh - r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return outside + Math.min(Math.max(qx, qy), 0) - r;
}

/**
 * Builds the displacement map for a pill of the given size, as a PNG data URL.
 * `bezel` is how far in from the edge the bending reaches, in CSS pixels.
 */
export function displacementMap(width: number, height: number, bezel = Math.min(height * 0.5, 26)) {
  const w = Math.max(2, Math.round(width));
  const h = Math.max(2, Math.round(height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(w, h);
  const hw = w / 2;
  const hh = h / 2;
  const r = Math.min(hh, hw);
  const e = 0.5;

  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const x = px + 0.5 - hw;
      const y = py + 0.5 - hh;
      const d = roundedRectDistance(x, y, hw, hh, r);
      let dx = 0;
      let dy = 0;
      if (d < 0 && -d < bezel) {
        // how deep into the rim we are: 1 at the very edge, 0 where the flat middle begins
        const t = 1 - -d / bezel;
        // a curved-glass profile: gentle near the middle, steep at the edge
        const strength = 1 - Math.sqrt(1 - t * t);
        // the outward direction at this point (gradient of the distance field)
        const gx = roundedRectDistance(x + e, y, hw, hh, r) - roundedRectDistance(x - e, y, hw, hh, r);
        const gy = roundedRectDistance(x, y + e, hw, hh, r) - roundedRectDistance(x, y - e, hw, hh, r);
        const len = Math.hypot(gx, gy) || 1;
        dx = (gx / len) * strength;
        dy = (gy / len) * strength;
      }
      const i = (py * w + px) * 4;
      img.data[i] = 128 + dx * 127;
      img.data[i + 1] = 128 + dy * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

/** Relative luminance of a CSS colour string like "rgb(239, 230, 214)", 0 (black) to 1 (white). */
export function luminance(color: string) {
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  if (a < 0.5) return null;
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
