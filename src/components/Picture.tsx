import type { ProjectImage } from "../data/projects";

type Props = {
  image: ProjectImage;
  /** How wide the image is shown, so the browser can pick the right file. */
  sizes: string;
  /** Load straight away (above the fold) instead of lazily. */
  eager?: boolean;
  /** Hide from assistive tech when the same image is described elsewhere. */
  decorative?: boolean;
};

/** A project screenshot, served as WebP at two sizes. All screenshots are 1440 × 900. */
export default function Picture({ image, sizes, eager, decorative }: Props) {
  return (
    <img
      src={`${image.src}.webp`}
      srcSet={`${image.src}-800.webp 800w, ${image.src}.webp 1440w`}
      sizes={sizes}
      width={1440}
      height={900}
      alt={decorative ? "" : image.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
