import fs from "fs";
import path from "path";
import type { Project, Profile } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "src/data/projects");
const PROFILE_PATH = path.join(process.cwd(), "src/data/profile.json");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Returns the public URL ("/...") if the file exists under public/, else null.
// Runs at build time (static export), so cover images fall back to a
// placeholder until a real file is dropped in the matching folder.
function resolvePublicImage(relPath: string): string | null {
  return fs.existsSync(path.join(PUBLIC_DIR, relPath)) ? `/${relPath}` : null;
}

// Images with a baked-in white background, found by sampling their edge
// pixels. On the dark theme these read as glaring white blocks, so they get
// inverted at render time.
//
// Empty on the light theme: the covers are drawn on the light ground by
// scripts/make-project-icons.mjs, and the resume-reviewer screenshot has a
// light background of its own, so nothing needs flipping any more. Kept as a
// hook for whichever image turns up with the wrong ground next.
const LIGHT_BG_COVERS = new Set<string>([]);

// The three projects that get a full card at the top of the home page, in this
// order. Everything else drops to the compact list below, newest first by
// sortKey. Swapping a slug here is the only edit needed to re-pick the three.
const FEATURED_SLUGS = ["xompress", "resume-reviewer", "deep-research-station"];

function withCover(project: Project): Project {
  return {
    ...project,
    featured: FEATURED_SLUGS.includes(project.slug),
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

export function getAllProjects(): Project[] {
  const fileNames = fs.readdirSync(PROJECTS_DIR).filter((f) => f.endsWith(".json"));
  const projects: Project[] = fileNames
    .map((fileName) => {
      const filePath = path.join(PROJECTS_DIR, fileName);
      const raw = fs.readFileSync(filePath, "utf-8");
      return withCover(JSON.parse(raw) as Project);
    })
    .filter((p) => !p.draft);
  return projects.sort((a, b) => {
    const ai = FEATURED_SLUGS.indexOf(a.slug);
    const bi = FEATURED_SLUGS.indexOf(b.slug);
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
  const project = withCover(JSON.parse(raw) as Project);
  return project.draft ? null : project;
}

export function getAllProjectSlugs(): string[] {
  return getAllProjects().map((p) => p.slug);
}

export function getProfile(): Profile {
  const raw = fs.readFileSync(PROFILE_PATH, "utf-8");
  return JSON.parse(raw) as Profile;
}

export function getProjectImagePath(slug: string, filename: string): string {
  return `/images/projects/${slug}/${filename}`;
}
