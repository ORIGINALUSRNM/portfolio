import { site } from "@/config/site";
import { DownloadIcon, GitHubIcon, LinkedInIcon } from "./Icons";

export function Hero() {
  return (
    <section className="hero wrap" aria-labelledby="hero-name">
      <img
        className="hero-photo"
        src="/jason-hornbuckle.jpg"
        alt="Portrait of Jason Hornbuckle"
        width={481}
        height={640}
      />
      <div className="hero-text">
        <p className="hero-role">{site.role}, moving into agentic AI</p>
        <h1 id="hero-name" className="hero-name">
          Jason<br />Hornbuckle
        </h1>
        <p className="hero-statement">{site.statement}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href={site.resume.pdf} download>
            <DownloadIcon /> Download resume
          </a>
          <a className="btn" href={site.links.linkedin} target="_blank" rel="noreferrer">
            <LinkedInIcon /> LinkedIn
          </a>
          <a className="btn" href={site.links.github} target="_blank" rel="noreferrer">
            <GitHubIcon /> GitHub
          </a>
        </div>
        <p className="hero-meta">
          Based in {site.location}. Open to remote front-end and AI-adjacent roles.
        </p>
      </div>
    </section>
  );
}
