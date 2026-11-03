"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, supabaseConfigured, SCREENSHOT_BUCKET } from "@/lib/supabase";
import type { Project } from "@/lib/types";

type Draft = Omit<Project, "id" | "created_at" | "tags"> & { id?: string; tags: string };

const blank: Draft = {
  slug: "", title: "", summary: "", description: "", live_url: "", repo_url: "",
  tags: "", screenshots: [], sort_order: 0, published: true,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function AdminPage() {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (!supabaseConfigured) {
    return (
      <main className="wrap admin">
        <h1>Admin</h1>
        <p className="notice">Supabase isn&apos;t connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local (see README), then restart the dev server.</p>
      </main>
    );
  }
  if (!ready) return <main className="wrap admin"><p>Loading…</p></main>;
  return session ? <Dashboard email={session.user.email ?? ""} /> : <SignIn />;
}

function SignIn() {
  const supabase = getSupabase()!;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(`Sign-in failed: ${error.message}. Check the email and password you created in Supabase.`);
    setBusy(false);
  }

  return (
    <main className="wrap admin admin-narrow">
      <h1>Sign in</h1>
      <p>This page is only for managing portfolio projects.</p>
      <form onSubmit={submit} className="form">
        <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" /></label>
        <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

function Dashboard({ email }: { email: string }) {
  const supabase = getSupabase()!;
  const [projects, setProjects] = useState<Project[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("projects").select("*")
      .order("sort_order").order("created_at", { ascending: false });
    if (error) setStatus(`Couldn't load projects: ${error.message}`);
    else setProjects(data as Project[]);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const edit = (p: Project) => setDraft({ ...p, tags: p.tags.join(", "), description: p.description ?? "", live_url: p.live_url ?? "", repo_url: p.repo_url ?? "" });

  async function remove(p: Project) {
    if (!window.confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    setStatus(error ? `Couldn't delete: ${error.message}` : `Deleted "${p.title}".`);
    load();
  }

  return (
    <main className="wrap admin">
      <div className="admin-top">
        <div>
          <h1>Projects</h1>
          <p>Signed in as {email}. Changes appear on the live site within a minute.</p>
        </div>
        <div className="admin-top-actions">
          <Link className="btn" href="/">View site</Link>
          <button className="btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>

      {status && <p className="notice" role="status">{status}</p>}

      {draft ? (
        <ProjectForm
          draft={draft}
          onCancel={() => setDraft(null)}
          onSaved={(msg) => { setDraft(null); setStatus(msg); load(); }}
        />
      ) : (
        <>
          <button className="btn btn-primary" onClick={() => setDraft({ ...blank, sort_order: projects.length })}>Add project</button>
          {projects.length === 0 ? (
            <p className="empty-admin">No projects yet. Add your first one to show it in the Work section.</p>
          ) : (
            <ul className="admin-list">
              {projects.map((p) => (
                <li key={p.id}>
                  {p.screenshots[0] ? <img src={p.screenshots[0]} alt="" /> : <span className="admin-thumb" />}
                  <div>
                    <strong>{p.title}</strong>{!p.published && <span className="pill">Hidden</span>}
                    <span>{p.summary}</span>
                  </div>
                  <div className="admin-row-actions">
                    <button className="btn btn-small" onClick={() => edit(p)}>Edit</button>
                    <button className="btn btn-small btn-danger" onClick={() => remove(p)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}

function ProjectForm({ draft, onCancel, onSaved }: { draft: Draft; onCancel: () => void; onSaved: (m: string) => void }) {
  const supabase = getSupabase()!;
  const [d, setD] = useState<Draft>(draft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true); setError("");
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${slugify(d.title) || "project"}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from(SCREENSHOT_BUCKET).upload(path, file, { cacheControl: "31536000" });
      if (error) { setError(`Upload failed for ${file.name}: ${error.message}`); continue; }
      urls.push(supabase.storage.from(SCREENSHOT_BUCKET).getPublicUrl(path).data.publicUrl);
    }
    setD((prev) => ({ ...prev, screenshots: [...prev.screenshots, ...urls] }));
    setUploading(false);
  }

  const move = (i: number, dir: -1 | 1) => {
    const s = [...d.screenshots]; const j = i + dir;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]]; set("screenshots", s);
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const row = {
      slug: d.slug || slugify(d.title),
      title: d.title.trim(),
      summary: d.summary.trim(),
      description: d.description?.trim() || null,
      live_url: d.live_url?.trim() || null,
      repo_url: d.repo_url?.trim() || null,
      tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean),
      screenshots: d.screenshots,
      sort_order: Number(d.sort_order) || 0,
      published: d.published,
    };
    const { error } = d.id
      ? await supabase.from("projects").update(row).eq("id", d.id)
      : await supabase.from("projects").insert(row);
    setBusy(false);
    if (error) setError(`Couldn't save: ${error.message}`);
    else onSaved(d.id ? `Saved "${row.title}".` : `Added "${row.title}".`);
  }

  return (
    <form className="form admin-form" onSubmit={save}>
      <h2>{d.id ? `Edit ${draft.title}` : "Add project"}</h2>
      <label>Title<input required value={d.title} onChange={(e) => { set("title", e.target.value); if (!d.id) set("slug", slugify(e.target.value)); }} /></label>
      <label>Page address<span className="hint">Used in the link: /projects/{d.slug || "your-project"}</span>
        <input required pattern="[a-z0-9-]+" value={d.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
      </label>
      <label>Short summary<span className="hint">One or two sentences, shown on the card</span>
        <textarea required rows={2} maxLength={240} value={d.summary} onChange={(e) => set("summary", e.target.value)} />
      </label>
      <label>Full description<span className="hint">Shown on the project page. Leave a blank line between paragraphs.</span>
        <textarea rows={7} value={d.description ?? ""} onChange={(e) => set("description", e.target.value)} />
      </label>
      <div className="form-row">
        <label>Live app link<input type="url" placeholder="https://" value={d.live_url ?? ""} onChange={(e) => set("live_url", e.target.value)} /></label>
        <label>Code link (optional)<input type="url" placeholder="https://github.com/…" value={d.repo_url ?? ""} onChange={(e) => set("repo_url", e.target.value)} /></label>
      </div>
      <div className="form-row">
        <label>Built with<span className="hint">Separate with commas</span><input value={d.tags} placeholder="Next.js, Supabase, Claude API" onChange={(e) => set("tags", e.target.value)} /></label>
        <label>Order<span className="hint">Lower numbers show first</span><input type="number" value={d.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} /></label>
      </div>

      <fieldset>
        <legend>Screenshots</legend>
        <p className="hint">The first screenshot is the card cover. Clicking a screenshot on the site opens the live app.</p>
        {d.screenshots.length > 0 && (
          <ul className="shot-list">
            {d.screenshots.map((src, i) => (
              <li key={src}>
                <img src={src} alt={`Screenshot ${i + 1}`} />
                <div>
                  <button type="button" className="btn btn-small" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">Earlier</button>
                  <button type="button" className="btn btn-small" onClick={() => move(i, 1)} disabled={i === d.screenshots.length - 1} aria-label="Move later">Later</button>
                  <button type="button" className="btn btn-small btn-danger" onClick={() => set("screenshots", d.screenshots.filter((_, j) => j !== i))}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <label className="upload">
          {uploading ? "Uploading…" : "Upload screenshots"}
          <input type="file" accept="image/*" multiple onChange={(e) => { upload(e.target.files); e.target.value = ""; }} disabled={uploading} />
        </label>
      </fieldset>

      <label className="check"><input type="checkbox" checked={d.published} onChange={(e) => set("published", e.target.checked)} /> Show on the site</label>

      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={busy || uploading}>{busy ? "Saving…" : d.id ? "Save changes" : "Add project"}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
