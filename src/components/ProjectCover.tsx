import type { Project } from "../data/projects";
import Picture from "./Picture";
import DiceLeds from "./DiceLeds";

type Props = { project: Project; sizes: string; eager?: boolean; decorative?: boolean };

/** A project's cover: its screenshot, or an honest diagram when no photograph exists yet. */
export default function ProjectCover({ project, sizes, eager, decorative }: Props) {
  if (project.cover) {
    return <Picture image={project.cover} sizes={sizes} eager={eager} decorative={decorative} />;
  }
  return (
    <span className="leds-cover" aria-hidden={decorative || undefined}>
      <DiceLeds value={5} />
    </span>
  );
}
