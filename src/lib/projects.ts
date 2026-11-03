import { getSupabase } from "./supabase";
import type { Project } from "./types";

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Could not load projects:", error.message);
    return [];
  }
  return data as Project[];
}

export async function getProject(slug: string): Promise<Project | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  return (data as Project) ?? null;
}
