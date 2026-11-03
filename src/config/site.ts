// Edit this file to change your personal details, links and experience.
export const site = {
  name: "Jason Hornbuckle",
  role: "Senior front-end engineer",
  location: "Hutchinson, Kansas",
  email: "jason.s.hornbuckle@gmail.com",
  statement:
    "I've spent fourteen years building interfaces for banks, publishers and retailers: dashboards, data grids and component libraries that teams rely on every day. Now I'm learning to build software that works alongside AI agents.",
  learning:
    "Agentic workflows, LLM tooling, evaluation and AI engineering fundamentals",
  links: {
    linkedin: "https://www.linkedin.com/in/jhornbuckle/",
    // TODO: replace with your GitHub profile URL
    github: "https://github.com/ORIGINALUSRNM",
  },
  resume: {
    pdf: "/Jason_Hornbuckle_Resume.pdf",
    docx: "/Jason_Hornbuckle_Resume.docx",
  },
};

export type Era = {
  start: number;
  end: number;
  company: string;
  label?: string; // short name for the timeline bar
  title: string;
  summary: string;
  stack: string[];
  current?: boolean;
};

// Oldest first. The timeline bar is drawn proportionally from these years.
export const experience: Era[] = [
  {
    start: 2012,
    end: 2013,
    company: "InRhythm",
    title: "Associate front-end developer",
    summary:
      "Helped move Hertz's Backbone site into a hybrid mobile app and built responsive pages for SpaFinder and Integrative Nutrition.",
    stack: ["Backbone", "Cordova", "Kendo UI", "Bootstrap"],
  },
  {
    start: 2013,
    end: 2015,
    company: "Vega Technologies",
    title: "Owner and lead UI developer",
    summary:
      "Ran my own front-end consultancy. Rebuilt a legacy Visual Basic application as a modern JavaScript web app.",
    stack: ["JavaScript", "HTML5", "CSS3"],
  },
  {
    start: 2015,
    end: 2019,
    company: "Techolution",
    title: "Senior front-end developer",
    summary:
      "Led UI for client work, including risk-monitoring grids, an internal learning platform and a global search portal for HarperCollins.",
    stack: ["Angular", "TypeScript", "Data grids"],
  },
  {
    start: 2019,
    end: 2024,
    company: "BNY",
    title: "Senior front-end developer",
    summary:
      "Led UI architecture for treasury and risk dashboards. Built component libraries adopted across the department and mentored new UI developers.",
    stack: ["Angular", "RxJS", "NgRx", "AG Grid", "React"],
  },
  {
    start: 2025,
    end: 2026,
    company: "Eliassen Group, for BNY",
    label: "Eliassen",
    title: "Senior front-end developer",
    summary:
      "Modernized legacy Angular with TDD and AI-assisted tooling, and built an embeddable React chat widget shipped as a Web Component.",
    stack: ["React", "Tailwind", "Zustand", "Claude Code", "Cursor"],
  },
  {
    start: 2026,
    end: 2028, // open-ended: drawn wider so it reads as ongoing
    company: "Next",
    title: "Agentic AI development",
    summary:
      "Building my own projects with agents and LLM APIs while I grow into AI engineering. My Work section shows where I am so far.",
    stack: ["LLM APIs", "Agents", "Next.js", "Supabase"],
    current: true,
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Front end",
    items: [
      "Angular",
      "React",
      "Next.js",
      "TypeScript",
      "RxJS",
      "NgRx",
      "Tailwind CSS",
      "Web Components",
    ],
  },
  {
    group: "Data and UI",
    items: [
      "AG Grid",
      "Highcharts",
      "amCharts",
      "SVG",
      "Component libraries",
      "Accessibility (WCAG)",
    ],
  },
  {
    group: "Quality",
    items: ["Test-driven development", "Jest", "Jasmine", "Karma"],
  },
  {
    group: "AI-assisted work",
    items: ["Claude Code", "Cursor", "Windsurf", "GitHub Copilot", "ChatGPT"],
  },
];
