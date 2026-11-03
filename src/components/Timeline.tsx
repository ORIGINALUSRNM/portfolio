import { experience } from "@/config/site";

// A proportional bar: each role's width matches the years it covered.
export function Timeline() {
  const first = experience[0].start;
  const last = experience[experience.length - 1].end;
  const span = last - first;
  const years = Array.from({ length: last - first }, (_, i) => first + i);

  return (
    <div className="timeline">
      <div className="timeline-bar" role="img" aria-label={`Career from ${first} to today, front end moving into agentic AI`}>
        {experience.map((e) => (
          <div
            key={e.company + e.start}
            title={e.current ? "Agentic AI, in progress" : `${e.company}, ${e.start}–${e.end}`}
            className={`timeline-seg${e.current ? " is-current" : ""}`}
            style={{ flexGrow: (e.end - e.start) / span }}
          >
            <span>{e.current ? "Agentic AI" : e.label ?? e.company}</span>
          </div>
        ))}
      </div>
      <div className="timeline-years" aria-hidden="true">
        {years.filter((y) => y % 2 === 0).map((y) => (
          <span key={y} className={y % 4 !== 0 ? "minor" : undefined} style={{ left: `${((y - first) / span) * 100}%` }}>{y}</span>
        ))}
      </div>

      <ol className="roles">
        {[...experience].reverse().map((e) => (
          <li key={e.company + e.start} className={e.current ? "is-current" : undefined}>
            <div className="role-years">
              {e.current ? "Now" : e.start === e.end ? e.start : `${e.start}–${e.end}`}
            </div>
            <div>
              <h3>{e.title}<span className="role-company">{e.current ? "In progress" : e.company}</span></h3>
              <p>{e.summary}</p>
              <p className="role-stack">{e.stack.join(", ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
