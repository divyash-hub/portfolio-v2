import { site } from "../data/site";

/** Turns a Google Drive share link into a direct download link, when it is one. */
function downloadUrl(url: string) {
  const id = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/)?.[1] ?? url.match(/[?&]id=([^&#]+)/)?.[1];
  return id ? `https://drive.google.com/uc?export=download&id=${id}` : url;
}

/** "Download résumé". Renders nothing until `resumeUrl` is set in src/data/site.ts. */
export default function ResumeButton({ solid = false }: { solid?: boolean }) {
  if (!site.resumeUrl) return null;
  return (
    <a
      className={solid ? "button button--solid" : "button"}
      href={downloadUrl(site.resumeUrl)}
      target="_blank"
      rel="noreferrer"
      data-cursor="Get it"
    >
      Download résumé
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
