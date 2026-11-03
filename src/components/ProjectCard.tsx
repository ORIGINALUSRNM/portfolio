import Link from "next/link";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const cover = project.screenshots[0];
  return (
    <article className="project-card">
      <Link href={`/projects/${project.slug}`} className="project-cover" aria-label={`View ${project.title}`}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={`Screenshot of ${project.title}`} loading="lazy" />
        ) : (
          <span className="project-cover-empty">{project.title.slice(0, 1)}</span>
        )}
      </Link>
      <div className="project-body">
        <h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.summary}</p>
        {project.tags.length > 0 && (
          <ul className="tags" aria-label="Built with">
            {project.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        <div className="project-links">
          {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Open the app</a>}
          {project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer">View code</a>}
        </div>
      </div>
    </article>
  );
}
