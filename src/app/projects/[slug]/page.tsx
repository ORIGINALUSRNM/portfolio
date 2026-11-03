import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getProject } from "@/lib/projects";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProject(slug);
  return { title: p ? `${p.title} | Jason Hornbuckle` : "Project not found" };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Header />
      <main className="wrap project-page">
        <Link href="/#work" className="back">Back to all work</Link>
        <h1>{project.title}</h1>
        <p className="project-lede">{project.summary}</p>
        <div className="hero-actions">
          {project.live_url && <a className="btn btn-primary" href={project.live_url} target="_blank" rel="noreferrer">Open the app</a>}
          {project.repo_url && <a className="btn" href={project.repo_url} target="_blank" rel="noreferrer">View code</a>}
        </div>
        {project.tags.length > 0 && (
          <ul className="tags" aria-label="Built with">{project.tags.map((t) => <li key={t}>{t}</li>)}</ul>
        )}
        {project.description && (
          <div className="project-description">
            {project.description.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)}
          </div>
        )}
        {project.screenshots.length > 0 && (
          <div className="shots">
            {project.screenshots.map((src, i) => (
              <a key={src} href={project.live_url ?? src} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
              </a>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
