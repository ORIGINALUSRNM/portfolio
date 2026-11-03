import Link from "next/link";
import { site } from "@/config/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link href="/" className="wordmark">{site.name}</Link>
        <nav aria-label="Main">
          <Link href="/#work">Work</Link>
          <Link href="/#experience">Experience</Link>
          <a href={site.resume.pdf} download>Resume</a>
        </nav>
      </div>
    </header>
  );
}
