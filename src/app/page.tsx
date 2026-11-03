import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Timeline } from "@/components/Timeline";
import { Footer } from "@/components/Footer";
import { getProjects } from "@/lib/projects";
import { site, skills } from "@/config/site";

// Re-check Supabase for new projects at most once a minute.
export const revalidate = 60;

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section id="work" className="section wrap" aria-labelledby="work-title">
          <div className="section-head">
            <h2 id="work-title">Work</h2>
            <p>Things I&apos;ve built on my own, most recent first. Each one links to the live app.</p>
          </div>
          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          ) : (
            <div className="empty">
              <p>New projects are on the way. In the meantime, my resume covers fourteen years of client and in-house work.</p>
              <a href={site.resume.pdf} download>Download resume (PDF)</a>
            </div>
          )}
        </section>

        <section id="experience" className="section wrap" aria-labelledby="exp-title">
          <div className="section-head">
            <h2 id="exp-title">Experience</h2>
            <p>From jQuery and Bootstrap in 2012 to enterprise Angular and React, and now agents.</p>
          </div>
          <Timeline />
        </section>

        <section className="section wrap" aria-labelledby="skills-title">
          <div className="section-head">
            <h2 id="skills-title">Tools I use</h2>
            <p>Currently learning: {site.learning}.</p>
          </div>
          <dl className="skills">
            {skills.map((s) => (
              <div key={s.group}>
                <dt>{s.group}</dt>
                <dd>{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
