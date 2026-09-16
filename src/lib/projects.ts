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

// Covers with a baked-in white background, found by sampling their edge pixels.
// On the dark theme these read as glaring white blocks, so they get inverted at
// render time — they are all line drawings, so inverting is faithful.
//
// This list is a stopgap. Re-export these with a transparent background (they
// also want to be larger than 280x175) and delete the entry — nothing else
// depends on it.
const LIGHT_BG_COVERS = new Set([
  "avatar.webp", // 560x560, pure white ground — a line drawing, inverts cleanly
  "ffe-reader/thumbnail.png",
  "harvestly/thumbnail.png",
  "medium-daily-digest/thumbnail.png",
  "multiagent-scaffold/thumbnail.png",
  "xiaoliuyao/thumbnail.png",
  "xompress/thumbnail.png",
  "resume-reviewer/preview.png",
]);

function withCover(project: Project): Project {
  return {
    ...project,
    thumbnailUrl: resolvePublicImage(
      `images/projects/${project.slug}/${project.thumbnail}`
    ),
    thumbnailOnLight: LIGHT_BG_COVERS.has(`${project.slug}/${project.thumbnail}`),
    previewImageUrl: project.previewImage
      ? resolvePublicImage(`images/projects/${project.slug}/${project.previewImage}`)
      : null,
    previewOnLight: project.previewImage
      ? LIGHT_BG_COVERS.has(`${project.slug}/${project.previewImage}`)
      : false,
  };
}

// Pinned to the front of the home grid, in this order. Everything not listed
// keeps falling back to newest-first by sortKey. Reorder or empty this array
// to go back to a purely chronological grid.
const PINNED_SLUGS = ["xompress", "medium-daily-digest", "tarot-local-ai"];

export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  const projects: Project[] = fileNames.map((fileName) => {
    const filePath = path.join(PROJECTS_DIR, fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    return withCover(JSON.parse(raw) as Project);
  });
  return projects.sort((a, b) => {
    const ai = PINNED_SLUGS.indexOf(a.slug);
    const bi = PINNED_SLUGS.indexOf(b.slug);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return (a.sortKey ?? a.date) > (b.sortKey ?? b.date) ? -1 : 1;
  });
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
    avatarOnLight: LIGHT_BG_COVERS.has(profile.avatar),
  };
}

export function getProjectImagePath(slug: string, filename: string): string {
  return `/images/projects/${slug}/${filename}`;
}
