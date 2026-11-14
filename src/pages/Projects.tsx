import { useEffect, useState } from "react";
import FolderCard from "../components/FolderCard";
import ProjectCover from "../components/ProjectCover";
import GlassBrain from "../components/GlassBrain";
import ProjectIndex from "../components/ProjectIndex";
import { categories, projectsIn, publicProjects, type ProjectCategory } from "../data/projects";
import { usePageMeta } from "../hooks/usePageMeta";
import "./projects.css";

const folderNames: Record<ProjectCategory, string> = {
  Website: "Websites",
  "Interactive 3D": "Interactive 3D",
  Hardware: "Hardware",
};

/** Folder width follows the screen so it never overflows a phone. */
function useFolderWidth() {
  const pick = () => {
    const w = window.innerWidth;
    // Phones: one folder per row, as wide as the screen allows.
    if (w < 700) return Math.max(248, Math.min(340, w - 56));
    // Wider: all three share one row, shrinking a little on tablets.
    return Math.max(200, Math.min(340, Math.floor((w - 150) / 3)));
  };
  const [width, setWidth] = useState(pick);
  useEffect(() => {
    const onResize = () => setWidth(pick());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export default function Projects() {
  usePageMeta("Projects", "A curated archive of websites, an interactive 3D model and a hardware build by Divyash Agrawal.");
  const width = useFolderWidth();

  return (
    <>
      <header className="shell page-head">
        <h1>Projects</h1>
        <p className="lede">
          A small, curated archive. Each entry is something I built or helped build, with what it does and what my part
          was.
        </p>
      </header>

      {/* The archive as folders: one per kind of work. */}
      <section className="shell folders" aria-labelledby="folders-heading">
        <h2 id="folders-heading" className="label">
          By kind. Open a folder to see what's inside.
        </h2>
        <div className="folders-row">
          {categories.map((category) => (
            <FolderCard
              key={category}
              label={folderNames[category]}
              width={width}
              files={projectsIn(category).map((p) => ({
                name: p.title,
                to: `/projects/${p.slug}`,
                visual: <ProjectCover project={p} sizes="17rem" decorative />,
              }))}
            />
          ))}
        </div>
      </section>

      {/* The same archive as a plain list, so the folders are never the only way in. */}
      <section className="shell all-projects" aria-labelledby="all-heading">
        <h2 id="all-heading" className="label">
          Everything, in one list
        </h2>
        <ProjectIndex projects={publicProjects} />
      </section>

      {/* What I'm building right now: no case study yet, so it links to the repository. */}
      <section className="shell projects-next" aria-labelledby="next-heading">
        <h2 id="next-heading" className="label">
          Currently building
        </h2>
        <GlassBrain />
      </section>
    </>
  );
}
