// Security and caching headers for the live site. The build writes them to dist/_headers,
// which Netlify reads on deploy, and `npm run preview` sends the same ones so they can be tested locally.

const csp = [
  "default-src 'self'",
  "script-src 'self' 'report-sample'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://formspree.io",
  "form-action 'self' https://formspree.io",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "require-trusted-types-for 'script'",
  "trusted-types 'none'",
].join("; ");

export const siteHeaders: Record<string, string> = {
  "Content-Security-Policy": csp,
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
  "Strict-Transport-Security": "max-age=31536000",
};

const block = (path: string, headers: Record<string, string>) =>
  [path, ...Object.entries(headers).map(([k, v]) => `  ${k}: ${v}`)].join("\n");

export const netlifyHeadersFile = [
  block("/*", siteHeaders),
  block("/assets/*", { "Cache-Control": "public, max-age=31536000, immutable" }),
].join("\n\n") + "\n";
