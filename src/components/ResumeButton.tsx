import { site } from "../data/site";

/** "View résumé": opens the PDF in a new tab to read, with the browser's own download button. Renders nothing until `resumeUrl` is set. */
export default function ResumeButton({ solid = false }: { solid?: boolean }) {
  if (!site.resumeUrl) return null;
  return (
    <a
      className={solid ? "button button--solid" : "button"}
      href={site.resumeUrl}
      target="_blank"
      rel="noreferrer"
      data-cursor="Read"
    >
      View résumé
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 11 11 5M6 5h5v5" />
      </svg>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
