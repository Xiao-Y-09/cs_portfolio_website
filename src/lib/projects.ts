import fs from "fs";
import path from "path";
import type { Project, Profile } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "src/data/projects");
const PROFILE_PATH = path.join(process.cwd(), "src/data/profile.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Returns the public URL ("/...") if the file exists under public/, else null.
// Runs at build time (static export), so the cover/hero images fall back to a
// placeholder until a real file is dropped in the matching folder.
function resolvePublicImage(relPath: string): string | null {
  return fs.existsSync(path.join(PUBLIC_DIR, relPath)) ? `/${relPath}` : null;
}

function withCover(project: Project): Project {
  return {
    ...project,
    thumbnailUrl: resolvePublicImage(
      `images/projects/${project.slug}/${project.thumbnail}`
    ),
  };
}

export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  const projects: Project[] = fileNames.map((fileName) => {
    const filePath = path.join(PROJECTS_DIR, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    return withCover(JSON.parse(raw) as Project);
  });
  return projects.sort((a, b) =>
    (a.sortKey ?? a.date) > (b.sortKey ?? b.date) ? -1 : 1
  );
}

export function getProjectBySlug(slug: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return withCover(JSON.parse(raw) as Project);
}

export function getAllProjectSlugs(): string[] {
  return fs.readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function getProfile(): Profile {
  const raw = fs.readFileSync(PROFILE_PATH, "utf-8");
  const profile = JSON.parse(raw) as Profile;
  return {
    ...profile,
    avatarUrl: resolvePublicImage(`images/${profile.avatar}`),
  };
}

export function getProjectImagePath(slug: string, filename: string): string {
  return `/images/projects/${slug}/${filename}`;
}
