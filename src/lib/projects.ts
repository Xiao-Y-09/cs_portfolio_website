import fs from "fs";
import path from "path";
import type { Project, Profile } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "src/data/projects");
const PROFILE_PATH = path.join(process.cwd(), "src/data/profile.json");

export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  const projects: Project[] = fileNames.map((fileName) => {
    const filePath = path.join(PROJECTS_DIR, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Project;
  });
  return projects.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Project;
}

export function getAllProjectSlugs(): string[] {
  return fs.readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function getProfile(): Profile {
  const raw = fs.readFileSync(PROFILE_PATH, "utf-8");
  return JSON.parse(raw) as Profile;
}

export function getProjectImagePath(slug: string, filename: string): string {
  return `/images/projects/${slug}/${filename}`;
}
