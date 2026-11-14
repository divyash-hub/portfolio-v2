import { useEffect } from "react";
import { site } from "../data/site";

/** Sets the tab title and meta description for the current page. */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : `${site.name} — Portfolio`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    }
  }, [title, description]);
}
