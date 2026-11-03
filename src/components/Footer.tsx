import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div>
          <h2 className="footer-title">Let&apos;s talk</h2>
          <p>I&apos;m looking for my next role. The quickest way to reach me is email.</p>
          <a className="footer-email" href={`mailto:${site.email}`}>{site.email}</a>
        </div>
        <ul className="footer-links">
          <li><a href={site.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href={site.links.github} target="_blank" rel="noreferrer">GitHub</a></li>
          <li><a href={site.resume.pdf} download>Resume (PDF)</a></li>
          <li><a href={site.resume.docx} download>Resume (Word)</a></li>
        </ul>
      </div>
      <div className="wrap footer-base">© {new Date().getFullYear()} {site.name}</div>
    </footer>
  );
}
