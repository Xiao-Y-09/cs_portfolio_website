/**
 * The link-preview card, served at /og.png.
 *
 * This is deliberately NOT Next's `opengraph-image.tsx` convention. Under
 * `output: export` that convention emits `out/opengraph-image` with no file
 * extension, static hosts then serve it as application/octet-stream, and
 * unfurlers drop any og:image that is not an image/* type — the preview goes
 * blank with no error anywhere. Routing it through a path that ends in .png
 * makes the extension, and therefore the Content-Type, correct on any host.
 * layout.tsx points og:image here by hand, since the convention is no longer
 * injecting it.
 */
import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";
import { getProfile } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

// `output: export` refuses to build a route handler without this.
export const dynamic = "force-static";

const SIZE = { width: 1200, height: 630 };

// satori has no access to next/font and cannot read woff2, so the two faces
// used here are vendored as TTF and read off disk at build time. They are the
// same families the site uses: Outfit for the name, JetBrains Mono for meta.
const ASSETS = path.join(process.cwd(), "src/assets");
const readAsset = (file: string) => fs.readFileSync(path.join(ASSETS, file));

// Mirrors of the Tokyo Night tokens in src/styles/design-tokens.css, inlined
// because satori resolves no CSS variables. Change them together.
const GROUND = "#1a1b26"; // --bg
const INK = "#c0caf5"; // --text
const MUTED = "#a9b1d6"; // --text-muted
const HAIRLINE = "#414868"; // --border
const ACCENT = "#7aa2f7"; // --accent

export function GET() {
  const profile = getProfile();
  const sketch = readAsset("og-sketch.png").toString("base64");
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: GROUND,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
          }}
        >
          {/* The 16x2 rule that opens every section heading on the site. */}
          <div
            style={{ width: 28, height: 3, background: ACCENT, marginBottom: 32 }}
          />
          <div
            style={{
              fontFamily: "Outfit",
              fontSize: 92,
              lineHeight: 1.05,
              color: INK,
              letterSpacing: "-0.02em",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 25,
              color: MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginTop: 26,
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              color: MUTED,
              marginTop: 16,
            }}
          >
            Northeastern MS CS · Winter 2027
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 56,
              paddingTop: 24,
              borderTop: `1px solid ${HAIRLINE}`,
              fontFamily: "JetBrains Mono",
              fontSize: 24,
              color: INK,
              letterSpacing: "0.04em",
            }}
          >
            {host}
          </div>
        </div>

        <div
          style={{
            width: 500,
            height: "100%",
            display: "flex",
            position: "relative",
            borderLeft: `1px solid ${HAIRLINE}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${sketch}`}
            alt=""
            width={500}
            height={630}
            style={{ objectFit: "cover" }}
          />
          {/* The sketch is busiest at its left edge, right where it meets the
              type. A short fade to the ground colour keeps the seam quiet. */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 160,
              height: "100%",
              background: `linear-gradient(to right, ${GROUND}, rgba(26,27,38,0))`,
            }}
          />
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        {
          name: "Outfit",
          data: readAsset("fonts/Outfit-Bold.ttf"),
          weight: 700,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: readAsset("fonts/JetBrainsMono-Regular.ttf"),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
