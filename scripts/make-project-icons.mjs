/**
 * Project cover icons: public/images/projects/<slug>/thumbnail.svg
 *
 * Every cover is drawn here so the set stays one family: the same ground,
 * the same line weights, and the Tokyo Night palette from
 * src/styles/design-tokens.css. SVGs loaded through <img> cannot read CSS
 * variables, so the colours below are literal copies of the tokens.
 *
 * Rules the set follows:
 *   - one subject per cover, centred, roughly within x 100-540 / y 50-360
 *   - --accent marks the focal element; no other hue
 *   - main outlines --text, detail --text-muted, guides and grids --border
 *
 *   node scripts/make-project-icons.mjs                 # write every cover
 *   node scripts/make-project-icons.mjs xompress        # write one
 *   node scripts/make-project-icons.mjs all <out-dir>   # write elsewhere
 */
import fs from "fs";
import path from "path";

// Mirrors of the palette tokens. Change them together with design-tokens.css.
const C = {
  bg: "#16161e", // --bg
  elev: "#0c0e14", // --bg-elevated
  card: "#292e42", // --bg-card
  text: "#d3daf8", // --text
  muted: "#c3c8e2", // --text-muted
  border: "#414868", // --border
  accent: "#7aa2f7", // --accent
};

const W = 640;
const H = 400;

// Line weights, in viewBox units. A card renders the cover about 370px wide,
// so 1 unit is roughly 0.58 CSS px there.
// Each takes an optional width so no element ever repeats an attribute —
// a duplicate attribute makes the file invalid XML, and browsers refuse to
// render an <img> SVG that fails to parse.
const stroke = (color, width, opacity) =>
  `stroke="${color}" stroke-width="${width}"` +
  (opacity == null ? "" : ` stroke-opacity="${opacity}"`);
const main = (w = 2.5) => stroke(C.text, w);
const detail = (w = 2) => stroke(C.muted, w, 0.72);
const fine = (w = 1.5) => stroke(C.muted, w, 0.55);
const guide = (w = 1.5) => stroke(C.border, w);
const accent = (w = 2.5) => stroke(C.accent, w);
const soft = (o = 0.14) => `fill="${C.accent}" fill-opacity="${o}"`;
const solid = `fill="${C.bg}"`;

const r = (n) => Math.round(n * 100) / 100;
const rad = (deg) => (deg * Math.PI) / 180;
const polar = (cx, cy, rx, deg, ry = rx) => [
  r(cx + rx * Math.cos(rad(deg))),
  r(cy + ry * Math.sin(rad(deg))),
];

/**
 * Shared ground: flat --bg, a dot grid fading out from the subject, and a
 * faint accent glow behind it. (gx, gy) is where the subject's weight sits.
 */
function frame(body, { gx = 320, gy = 200, defs = "" } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.1" fill="${C.border}"/>
    </pattern>
    <radialGradient id="dotFade" cx="${r(gx / W)}" cy="${r(gy / H)}" r="0.62">
      <stop offset="0" stop-color="#fff" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="dotMask"><rect width="${W}" height="${H}" fill="url(#dotFade)"/></mask>
    <radialGradient id="glow" cx="${r(gx / W)}" cy="${r(gy / H)}" r="0.42">
      <stop offset="0" stop-color="${C.accent}" stop-opacity="0.14"/>
      <stop offset="1" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>${defs}
  </defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#dotMask)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
${body}
  </g>
</svg>
`;
}

/** A small document glyph with a folded corner, centred on (cx, cy). */
function docGlyph(cx, cy, w, h, attrs, lines = 2) {
  const x = r(cx - w / 2);
  const y = r(cy - h / 2);
  const f = r(Math.min(w, h) * 0.3);
  const rows = Array.from({ length: lines }, (_, i) => {
    const ly = r(y + h * 0.45 + i * (h * 0.22));
    return `<path d="M${r(x + w * 0.22)} ${ly} H${r(x + w * (i === lines - 1 ? 0.6 : 0.78))}" ${fine(1.2)}/>`;
  }).join("");
  return `<path d="M${x} ${y} H${r(x + w - f)} L${r(x + w)} ${r(y + f)} V${r(y + h)} H${x} Z" ${solid} ${attrs}/><path d="M${r(x + w - f)} ${y} V${r(y + f)} H${r(x + w)}" ${attrs}/>${rows}`;
}

/** A four-point sparkle centred on (cx, cy). */
function sparkle(cx, cy, s, fill, opacity = 1) {
  const k = r(s * 0.18);
  return `<path d="M${cx} ${r(cy - s)} Q${r(cx + k)} ${r(cy - k)} ${r(cx + s)} ${cy} Q${r(cx + k)} ${r(cy + k)} ${cx} ${r(cy + s)} Q${r(cx - k)} ${r(cy + k)} ${r(cx - s)} ${cy} Q${r(cx - k)} ${r(cy - k)} ${cx} ${r(cy - s)} Z" fill="${fill}" fill-opacity="${opacity}"/>`;
}

// ---------------------------------------------------------------------------
// Xompress — a full PDF page squeezed into a smaller one that fits the target.

function pdfPage(x, y, s, outline) {
  // Drawn in a 150 x 260 local box. The outline weight is held roughly
  // constant across scales so the small page doesn't look faint.
  const ow = r(2.5 / Math.sqrt(s));
  return `    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 0 H122 L150 28 V260 H0 Z" ${solid} stroke="${outline}" stroke-width="${ow}"/>
      <path d="M122 0 V28 H150" stroke="${outline}" stroke-width="${ow}"/>
      <path d="M16 40 H92" ${main(4)}/>
      <path d="M16 53 H64" ${guide(2.5)}/>
      <rect x="16" y="68" width="118" height="72" rx="3" ${detail()}/>
      <path d="M17 132 L50 100 L70 118 L95 91 L133 128" ${detail()}/>
      <circle cx="112" cy="86" r="8" ${detail()}/>
      ${[118, 104, 118, 86, 112, 96, 58]
        .map((len, i) => `<path d="M16 ${162 + i * 14} H${16 + len}" ${fine(2)}/>`)
        .join("\n      ")}
    </g>`;
}

function xompress() {
  const small = 0.62;
  const sx = 400;
  const sy = r(200 - 130 * small);
  const sRight = r(sx + 150 * small);
  return frame(
    `  <g transform="translate(14 -12)">
${pdfPage(112, 70, 1, C.text)}
    <path d="M334 146 V174 M327 167 L334 174 L341 167" ${detail()}/>
    <path d="M334 254 V226 M327 233 L334 226 L341 233" ${detail()}/>
    <path d="M290 200 H374 M364 190 L374 200 L364 210" ${accent()}/>
${pdfPage(sx, sy, small, C.accent)}
    <circle cx="${sRight}" cy="${sy}" r="12" ${solid} ${accent(2)}/>
    <path d="M${r(sRight - 5)} ${sy} l3.5 3.5 l6.5 -7" ${accent(2)}/>
    <path d="M112 356 H262" ${guide(6)}/>
    <path d="M${sx} 356 H${sx + 38}" ${accent(6)}/>
    <path d="M${sx + 56} 344 V368" ${detail()} stroke-dasharray="3 4"/>
  </g>`,
    { gx: 340, gy: 190 },
  );
}

// ---------------------------------------------------------------------------
// Medium Daily Digest — the day's ranked picks rising out of an envelope,
// with the unread feed drifting in from the left.

function mediumDailyDigest() {
  const rows = [162, 196, 230, 264];
  const lens = [110, 92, 104, 84];
  const row = (c, i) => {
    const top = i === 0;
    return `${top ? `<rect x="226" y="${c - 16}" width="190" height="32" rx="5" ${soft(0.13)}/>` : ""}
    <circle cx="239" cy="${c}" r="5.5" ${top ? `fill="${C.accent}"` : solid} ${top ? accent(1.5) : detail(1.5)}/>
    <rect x="252" y="${c - 11}" width="30" height="22" rx="3" ${top ? accent(1.8) : detail(1.8)}/>
    <path d="M258 ${c + 6} l7 -7 l5 5 l4 -3 l3 3" ${top ? accent(1.4) : fine(1.4)}/>
    <path d="M292 ${c - 5} H${292 + lens[i]}" ${top ? main(2.2) : detail(2)}/>
    <path d="M292 ${c + 6} H${292 + lens[i] - 34}" ${fine(2)}/>`;
  };
  // Three unread items drifting toward the envelope, fading as they go.
  const feed = [
    [118, 120, 0.9],
    [100, 184, 0.6],
    [120, 248, 0.35],
  ]
    .map(
      ([x, y, o]) => `<g opacity="${o}">
      <rect x="${x}" y="${y}" width="46" height="34" rx="4" ${solid} ${detail(1.6)}/>
      <path d="M${x + 8} ${y + 11} H${x + 38} M${x + 8} ${y + 19} H${x + 30} M${x + 8} ${y + 26} H${x + 22}" ${fine(1.4)}/>
    </g>`,
    )
    .join("\n    ");
  return frame(
    `    ${feed}
    <path d="M170 150 H176 M162 214 H174 M170 280 H176" ${guide(1.5)} stroke-dasharray="1 5"/>
    <!-- envelope body and open flap, behind the letter -->
    <rect x="190" y="206" width="260" height="130" rx="6" ${main()}/>
    <path d="M190 212 L320 132 L450 212" ${detail()}/>
    <!-- the digest -->
    <rect x="212" y="84" width="216" height="236" rx="5" ${solid} ${main()}/>
    <path d="M232 128 V104 L246 118 L260 104 V128" ${accent(3)}/>
    <path d="M276 110 H396" ${detail(2.5)}/>
    <path d="M276 122 H346" ${fine(2)}/>
    <path d="M232 142 H408" ${guide(1.5)}/>
    ${rows.map(row).join("\n    ")}
    <!-- front pocket, over the letter -->
    <path d="M190 244 L320 304 L450 244 V330 Q450 336 444 336 H196 Q190 336 190 330 Z" ${solid} ${main()}/>
    <path d="M196 334 L292 282 M444 334 L348 282" ${fine(1.4)}/>
    ${sparkle(488, 112, 9, C.muted, 0.55)}
    ${sparkle(508, 146, 5, C.muted, 0.35)}`,
    { gx: 320, gy: 200 },
  );
}

// ---------------------------------------------------------------------------
// Tarot — five cards fanned from a ring of 78, the front card face-up.

function tarotLocalAi() {
  const px = 320;
  const py = 300;
  const cw = 84;
  const ch = 144;
  const cx = px - cw / 2;
  const cy = py - 28 - ch;
  const back = (deg, strong) => `<g transform="rotate(${deg} ${px} ${py})">
      <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="7" ${solid} ${strong ? main(2.2) : detail(2)}/>
      <rect x="${cx + 7}" y="${cy + 7}" width="${cw - 14}" height="${ch - 14}" rx="4" ${fine(1.2)}/>
      <path d="M${px} ${cy + 36} L${px + 14} ${cy + ch / 2} L${px} ${cy + ch - 36} L${px - 14} ${cy + ch / 2} Z" ${fine(1.3)}/>
      <circle cx="${px}" cy="${cy + ch / 2}" r="3.5" ${fine(1.3)}/>
    </g>`;
  // The sun on the face-up card.
  const sx = px;
  const sy = cy + ch / 2 - 4;
  const rays = Array.from({ length: 12 }, (_, i) => {
    const long = i % 2 === 0;
    const [x1, y1] = polar(sx, sy, 16, i * 30);
    const [x2, y2] = polar(sx, sy, long ? 26 : 21, i * 30);
    return `M${x1} ${y1} L${x2} ${y2}`;
  }).join(" ");
  // The ring of 78: one tick per card, across the visible upper arc.
  const ticks = [];
  for (let i = 0; i < 78; i++) {
    const deg = (i * 360) / 78;
    if (deg < 192 || deg > 348) continue;
    const major = i % 13 === 0;
    const [x1, y1] = polar(px, py, 204, deg);
    const [x2, y2] = polar(px, py, major ? 218 : 212, deg);
    ticks.push(`M${x1} ${y1} L${x2} ${y2}`);
  }
  return frame(
    `    <path d="${ticks.join(" ")}" ${guide(1.6)}/>
    ${back(-48, false)}
    ${back(48, false)}
    ${back(-24, true)}
    ${back(24, true)}
    <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="7" ${solid} ${main(2.5)}/>
    <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="7" ${soft(0.07)}/>
    <rect x="${cx + 7}" y="${cy + 7}" width="${cw - 14}" height="${ch - 14}" rx="4" ${accent(1.2)} stroke-opacity="0.6"/>
    <circle cx="${sx}" cy="${sy}" r="11" ${soft(0.22)} ${accent(2.2)}/>
    <path d="${rays}" ${accent(1.8)}/>
    <path d="M${px - 16} ${cy + ch - 22} H${px + 16}" ${accent(1.6)} stroke-opacity="0.7"/>
    <!-- the reading, streaming in -->
    <path d="M258 ${py + 32} H382" ${detail(2)}/>
    <path d="M276 ${py + 48} H346" ${detail(2)}/>
    <rect x="352" y="${py + 41}" width="7" height="14" rx="1" fill="${C.accent}"/>
    ${sparkle(140, 118, 8, C.muted, 0.5)}
    ${sparkle(502, 100, 6, C.muted, 0.4)}
    ${sparkle(522, 152, 4, C.accent, 0.7)}`,
    { gx: 320, gy: 200 },
  );
}

// ---------------------------------------------------------------------------
// ResumeReviewer — one resume, ranked against several job descriptions.

function resumeReviewer() {
  const base = 300;
  const bars = [
    [318, 110],
    [374, 152],
    [430, 196],
    [486, 232],
  ];
  const bw = 38;
  const bar = ([x, top], i) => {
    const d = `M${x} ${base} V${top + 6} Q${x} ${top} ${x + 6} ${top} H${x + bw - 6} Q${x + bw} ${top} ${x + bw} ${top + 6} V${base}`;
    return i === 0
      ? `<path d="${d}" ${soft(0.16)} ${accent(2.5)}/>`
      : `<path d="${d}" ${solid} ${i === 1 ? main(2) : detail(2)}/>`;
  };
  const jd = bars.map(([x], i) => docGlyph(x + bw / 2, 326, 20, 26, i === 0 ? accent(1.5) : guide(1.5))).join("\n    ");
  return frame(
    `    <!-- resume -->
    <rect x="104" y="74" width="140" height="244" rx="6" ${solid} ${main()}/>
    <circle cx="132" cy="110" r="16" ${detail()}/>
    <circle cx="132" cy="105" r="5" ${fine(1.6)}/>
    <path d="M122.5 120 Q132 111 141.5 120" ${fine(1.6)}/>
    <path d="M158 104 H226" ${main(3.5)}/>
    <path d="M158 117 H204" ${guide(2.5)}/>
    <path d="M120 142 H228" ${guide(1.5)}/>
    <path d="M120 158 H158" ${detail(2.5)}/>
    <path d="M120 172 H228 M120 184 H214 M120 196 H222" ${fine(2)}/>
    <path d="M120 216 H150" ${detail(2.5)}/>
    <path d="M120 230 H226 M120 242 H206 M120 254 H218" ${fine(2)}/>
    <rect x="120" y="272" width="30" height="13" rx="6.5" ${fine(1.5)}/>
    <rect x="156" y="272" width="24" height="13" rx="6.5" ${fine(1.5)}/>
    <rect x="186" y="272" width="36" height="13" rx="6.5" ${fine(1.5)}/>
    <path d="M268 184 L282 198 L268 212" ${detail(2.5)}/>
    <!-- fit scores -->
    <path d="M306 150 H534 M306 200 H534 M306 250 H534" ${guide(1)} stroke-dasharray="2 6"/>
    ${bars.map(bar).join("\n    ")}
    <path d="M306 ${base} H534" ${guide(1.8)}/>
    ${jd}
    ${sparkle(337, 88, 8, C.accent, 0.9)}`,
    { gx: 330, gy: 200 },
  );
}

// ---------------------------------------------------------------------------
// Deep Research Station — a supervisor fanning work out to parallel
// researchers, each pulling its own sources, all inside one lens.

function deepResearchStation() {
  const lx = 286;
  const ly = 176;
  const lr = 104;
  const sup = [lx, 126];
  const workers = [232, 268, 304, 340].map((x) => [x, 196]);
  const edges = workers
    .map(([x, y]) => {
      const mx = r(sup[0] + (x - sup[0]) * 0.55);
      const my = r(sup[1] + 12 + (y - 9 - sup[1] - 12) * 0.55);
      return `<path d="M${sup[0]} ${sup[1] + 12} L${x} ${y - 9}" ${detail(1.8)}/>
      <circle cx="${mx}" cy="${my}" r="2.6" fill="${C.accent}"/>`;
    })
    .join("\n      ");
  const nodes = workers
    .map(
      ([x, y]) => `<circle cx="${x}" cy="${y}" r="9" ${solid} ${main(2)}/>
      <path d="M${x} ${y + 9} V${y + 22}" ${guide(1.5)} stroke-dasharray="2 4"/>
      ${docGlyph(x, y + 35, 16, 21, detail(1.4), 2)}`,
    )
    .join("\n      ");
  const [hx, hy] = polar(lx, ly, lr, 45);
  const ripples = [124, 140, 156]
    .map((rr, i) => {
      const [x1, y1] = polar(lx, ly, rr, -62);
      const [x2, y2] = polar(lx, ly, rr, -22);
      return `<path d="M${x1} ${y1} A${rr} ${rr} 0 0 1 ${x2} ${y2}" ${guide(1.6)} stroke-opacity="${[0.9, 0.6, 0.35][i]}"/>`;
    })
    .join("\n    ");
  const [g1x, g1y] = polar(lx, ly, 86, 200);
  const [g2x, g2y] = polar(lx, ly, 86, 246);
  return frame(
    `  <g transform="translate(20 4)">
    ${ripples}
    <!-- handle -->
    <g transform="translate(${hx} ${hy}) rotate(45)">
      <rect x="-2" y="-11" width="20" height="22" rx="3" ${solid} ${main()}/>
      <rect x="18" y="-14" width="92" height="28" rx="13" ${solid} ${main()}/>
      <path d="M42 -7 V7 M54 -7 V7 M66 -7 V7" ${fine(2)}/>
    </g>
    <!-- lens -->
    <circle cx="${lx}" cy="${ly}" r="${lr}" ${solid}/>
    <circle cx="${lx}" cy="${ly}" r="${lr}" ${soft(0.05)} ${main(3)}/>
    <circle cx="${lx}" cy="${ly}" r="${lr - 8}" ${fine(1.2)}/>
    <path d="M${g1x} ${g1y} A86 86 0 0 1 ${g2x} ${g2y}" ${stroke(C.muted, 2.5, 0.45)}/>
    <g>
      ${edges}
      <circle cx="${sup[0]}" cy="${sup[1]}" r="13" ${soft(0.2)} ${accent(2.5)}/>
      <circle cx="${sup[0]}" cy="${sup[1]}" r="4.5" fill="${C.accent}"/>
      ${nodes}
    </g>
  </g>`,
    { gx: 320, gy: 194 },
  );
}

// ---------------------------------------------------------------------------
// FF&E Reader — a tagged armchair and the schedule row it belongs to.

function ffeReader() {
  const sx = 340;
  const sy = 86;
  const sw = 208;
  const colX = [sx, 372, 468, 506, sx + sw];
  const rowH = 32;
  const head = 30;
  const rows = 6;
  const sh = head + rows * rowH;
  const textLens = [70, 54, 76, 48, 64, 58];
  const checked = new Set([0, 1, 3]);
  const sel = 1;
  const cells = Array.from({ length: rows }, (_, i) => {
    const t = sy + head + i * rowH;
    const c = t + rowH / 2;
    const on = i === sel;
    return `<path d="M348 ${c} H364" ${on ? accent(2) : fine(2)}/>
      <path d="M380 ${c} H${380 + textLens[i]}" ${on ? main(2.2) : detail(2)}/>
      <path d="M479 ${c} H495" ${fine(2)}/>
      <rect x="521" y="${c - 6}" width="12" height="12" rx="2" ${checked.has(i) ? accent(1.6) : guide(1.6)}/>
      ${checked.has(i) ? `<path d="M523.5 ${c} l2.8 2.8 l5 -5.6" ${accent(1.8)}/>` : ""}`;
  }).join("\n      ");
  const hLines = Array.from({ length: rows }, (_, i) => `M${sx} ${sy + head + i * rowH} H${sx + sw}`).join(" ");
  const vLines = colX.slice(1, -1).map((x) => `M${x} ${sy} V${sy + sh}`).join(" ");
  const selY = sy + head + sel * rowH;
  return frame(
    `    <!-- armchair -->
    <rect x="150" y="104" width="80" height="94" rx="16" ${solid} ${main()}/>
    <rect x="160" y="114" width="60" height="74" rx="10" ${fine(1.4)}/>
    <circle cx="178" cy="142" r="2" fill="${C.muted}" fill-opacity="0.7"/>
    <circle cx="202" cy="142" r="2" fill="${C.muted}" fill-opacity="0.7"/>
    <circle cx="178" cy="166" r="2" fill="${C.muted}" fill-opacity="0.7"/>
    <circle cx="202" cy="166" r="2" fill="${C.muted}" fill-opacity="0.7"/>
    <rect x="132" y="156" width="24" height="84" rx="10" ${solid} ${main()}/>
    <rect x="224" y="156" width="24" height="84" rx="10" ${solid} ${main()}/>
    <rect x="152" y="198" width="76" height="32" rx="8" ${solid} ${main()}/>
    <path d="M160 214 H220" ${fine(1.4)}/>
    <rect x="132" y="236" width="116" height="14" rx="4" ${solid} ${main()}/>
    <path d="M148 250 L143 298 M232 250 L237 298" ${main(3)}/>
    <path d="M162 250 L164 288 M218 250 L216 288" ${detail(2)}/>
    <path d="M112 300 H272" ${guide(1.6)}/>
    <!-- spec tag on the arm -->
    <path d="M248 172 Q262 172 270 188" ${fine(1.4)}/>
    <g transform="rotate(14 290 198)">
      <path d="M266 198 L276 187 H316 Q320 187 320 191 V205 Q320 209 316 209 H276 Z" ${solid} ${accent(2)}/>
      <circle cx="277" cy="198" r="2.5" ${accent(1.5)}/>
      <path d="M287 194 H309 M287 202 H301" ${accent(1.6)}/>
    </g>
    <path d="M322 212 C332 212 330 ${selY + rowH / 2} ${sx - 2} ${selY + rowH / 2}" ${accent(1.5)} stroke-dasharray="3 5"/>
    <!-- schedule grid -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="6" ${solid}/>
    <path d="M${sx + 6} ${sy} H${sx + sw - 6} Q${sx + sw} ${sy} ${sx + sw} ${sy + 6} V${sy + head} H${sx} V${sy + 6} Q${sx} ${sy} ${sx + 6} ${sy} Z" fill="${C.border}" fill-opacity="0.38"/>
    <path d="${hLines} ${vLines}" ${guide(1.2)}/>
    <path d="M348 101 H364 M380 101 H430 M476 101 H498 M514 101 H540" ${detail(2.5)}/>
    <rect x="${sx}" y="${selY}" width="${sw}" height="${rowH}" ${soft(0.12)}/>
      ${cells}
    <rect x="${sx}" y="${selY}" width="${sw}" height="${rowH}" ${accent(2)}/>
    <rect x="${sx + sw - 4}" y="${selY + rowH - 4}" width="7" height="7" fill="${C.accent}"/>
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="6" ${main(2)}/>`,
    { gx: 330, gy: 200 },
  );
}

// ---------------------------------------------------------------------------
// Harvestly — three wheat stalks growing out of a matching graph: supply on
// top, food banks below, the optimal assignment in accent.

function bezier(p0, p1, p2, t) {
  const u = 1 - t;
  return [
    u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  ];
}
function bezierAngle(p0, p1, p2, t) {
  const dx = 2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function wheat(bx, by, height, lean, leaves) {
  const p0 = [bx, by];
  const p2 = [bx + lean, by - height];
  const p1 = [bx + lean * 0.15, by - height * 0.55];
  const out = [`<path d="M${bx} ${by} Q${r(p1[0])} ${r(p1[1])} ${r(p2[0])} ${r(p2[1])}" ${main(2.2)}/>`];
  // A grain is an almond pointing along +y-up in its own frame.
  const grain = (x, y, deg, s) =>
    `<g transform="translate(${r(x)} ${r(y)}) rotate(${r(deg)}) scale(${r(s)})"><path d="M0 0 Q6.5 -10 0 -21 Q-6.5 -10 0 0 Z" ${solid} ${main(1.7)}/><path d="M0 -21 L0 -44" ${fine(0.9)}/></g>`;
  const levels = 7;
  for (let i = 0; i < levels; i++) {
    const t = 0.56 + (i / levels) * 0.4;
    const [x, y] = bezier(p0, p1, p2, t);
    const a = bezierAngle(p0, p1, p2, t) + 90; // stem direction, rotated to "up"
    const s = 1 - i * 0.055;
    out.push(grain(x, y, a - 30, s), grain(x, y, a + 30, s));
  }
  const tipA = bezierAngle(p0, p1, p2, 1) + 90;
  out.push(grain(p2[0], p2[1] + 4, tipA, 0.8));
  // One long blade per entry: leaves the stem nearly parallel to it, then
  // arcs outward and tips over, like a real wheat leaf.
  for (const [t, side] of leaves) {
    const [x, y] = bezier(p0, p1, p2, t);
    const a = bezierAngle(p0, p1, p2, t) + 90 + side * 10;
    const k = side;
    out.push(
      `<g transform="translate(${r(x)} ${r(y)}) rotate(${r(a)})"><path d="M0 0 C${k * 5} -22 ${k * 20} -44 ${k * 46} -50 C${k * 24} -38 ${k * 9} -20 ${k * -1.5} -2 Z" ${solid} ${detail(1.6)}/><path d="M${k * 0.5} -3 C${k * 6} -22 ${k * 19} -40 ${k * 42} -48" ${fine(1)}/></g>`,
    );
  }
  return out.join("\n    ");
}

function harvestly() {
  const gy = 246;
  const xs = [224, 320, 416];
  const houseTop = 318;
  const matched = { 0: 0, 1: 2, 2: 1 };
  const edges = [];
  xs.forEach((sx, i) =>
    xs.forEach((hx, j) => {
      if (matched[i] === j) return;
      edges.push(`M${sx} ${gy + 6} L${hx} ${houseTop - 2}`);
    }),
  );
  const matches = xs.map((sx, i) => `M${sx} ${gy + 6} L${xs[matched[i]]} ${houseTop - 2}`).join(" ");
  const house = (x) =>
    `<path d="M${x - 15} ${houseTop + 14} L${x} ${houseTop} L${x + 15} ${houseTop + 14} V${houseTop + 36} H${x - 15} Z" ${solid} ${main(2)}/><path d="M${x - 4} ${houseTop + 36} V${houseTop + 26} H${x + 4} V${houseTop + 36}" ${fine(1.6)}/>`;
  return frame(
    `    <path d="${edges.join(" ")}" ${guide(1.3)} stroke-dasharray="2 4"/>
    <path d="${matches}" ${accent(2.2)}/>
    ${wheat(224, gy, 140, -14, [[0.3, -1]])}
    ${wheat(320, gy, 174, 4, [[0.24, 1], [0.42, -1]])}
    ${wheat(416, gy, 146, 16, [[0.34, 1]])}
    <path d="M160 ${gy} H480" ${guide(1.6)}/>
    ${xs.map((x) => `<circle cx="${x}" cy="${gy}" r="6" ${solid} ${main(2)}/>`).join("\n    ")}
    ${xs.map(house).join("\n    ")}`,
    { gx: 320, gy: 190 },
  );
}

// ---------------------------------------------------------------------------
// Multi-Agent Scaffold — agents on a ring around the YAML config that wires
// them: store -> researcher -> writer -> reviewer -> output, with the
// reviewer able to send work back to the writer.

function multiagentScaffold() {
  const hx = 320;
  const hy = 200;
  const rx = 192;
  const ry = 128;
  const at = (deg) => polar(hx, hy, rx, deg, ry);
  const roles = [
    [270, "research"],
    [342, "write"],
    [54, "review"],
    [126, "output"],
    [198, "store"],
  ];
  const glyph = (kind, x, y) => {
    switch (kind) {
      case "research":
        return `<circle cx="${x - 3}" cy="${y - 3}" r="7" ${main(2)}/><path d="M${x + 2} ${y + 2} L${x + 9} ${y + 9}" ${main(2.4)}/>`;
      case "write":
        return `<g transform="translate(${x} ${y}) rotate(45)"><path d="M-3.8 -11 H3.8 V5.5 L0 11.5 L-3.8 5.5 Z" ${main(2)}/><path d="M-3.8 -6 H3.8 M-3.8 5.5 H3.8" ${main(1.4)}/></g>`;
      case "review":
        return `<path d="M${x - 9} ${y} L${x - 3} ${y + 6} L${x + 9} ${y - 7}" ${main(2.6)}/>`;
      case "output":
        return docGlyph(x, y, 17, 22, main(1.8), 2);
      case "store":
        return `<ellipse cx="${x}" cy="${y - 7}" rx="9" ry="3.5" ${main(1.8)}/><path d="M${x - 9} ${y - 7} V${y + 7} A9 3.5 0 0 0 ${x + 9} ${y + 7} V${y - 7}" ${main(1.8)}/><path d="M${x - 9} ${y} A9 3.5 0 0 0 ${x + 9} ${y}" ${fine(1.4)}/>`;
    }
  };
  const spokes = roles
    .map(([deg]) => {
      const [x, y] = at(deg);
      const len = Math.hypot(x - hx, y - hy);
      const ux = (x - hx) / len;
      const uy = (y - hy) / len;
      return `M${r(hx + ux * 38)} ${r(hy + uy * 38)} L${r(x - ux * 29)} ${r(y - uy * 29)}`;
    })
    .join(" ");
  // Flow chevrons on the orbit, midway between consecutive agents.
  const chevron = (deg) => {
    const [x, y] = at(deg);
    const [ax, ay] = at(deg + 3);
    const a = (Math.atan2(ay - y, ax - x) * 180) / Math.PI;
    return `<path d="M-5 -6 L3 0 L-5 6" transform="translate(${x} ${y}) rotate(${r(a)})" ${accent(2.2)}/>`;
  };
  const flows = [234, 306, 18, 90].map(chevron).join("\n    ");
  // Revision loop: reviewer back to writer, inside the orbit.
  const [rvx, rvy] = at(54);
  const [wrx, wry] = at(342);
  const loop = `M${r(rvx - 18)} ${r(rvy - 26)} Q${r(hx + 150)} ${r(hy + 10)} ${r(wrx - 26)} ${r(wry + 20)}`;
  const nodes = roles
    .map(([deg, kind]) => {
      const [x, y] = at(deg);
      return `<circle cx="${x}" cy="${y}" r="27" ${solid} ${main(2.2)}/>
    ${glyph(kind, x, y)}`;
    })
    .join("\n    ");
  return frame(
    `    <ellipse cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}" ${guide(1.5)} stroke-dasharray="3 7"/>
    <path d="${spokes}" ${detail(1.8)}/>
    <path d="${loop}" ${accent(1.8)} stroke-dasharray="4 5"/>
    <path d="M-5 -6 L3 0 L-5 6" transform="translate(${r(wrx - 25)} ${r(wry + 19)}) rotate(-128)" ${accent(1.8)}/>
    ${flows}
    ${nodes}
    <circle cx="${hx}" cy="${hy}" r="37" ${solid} ${main(2.5)}/>
    <circle cx="${hx}" cy="${hy}" r="28" ${soft(0.16)} ${accent(2)}/>
    <path d="M308 190 H324 M314 200 H334 M314 210 H328" ${accent(2.6)}/>
    <circle cx="305" cy="190" r="1.6" fill="${C.accent}"/>`,
    { gx: 320, gy: 200 },
  );
}

// ---------------------------------------------------------------------------
// 小六爻 — the hexagram, inside the ring of six palaces the count walks
// round; the moving line and the palace it lands on are in accent.

function xiaoliuyao() {
  const cx = 320;
  const cy = 200;
  const ring = 148;
  const palaces = [-90, -30, 30, 90, 150, 210];
  const landed = 30;
  const ticks = [];
  for (let d = -90; d < 270; d += 15) {
    if (palaces.includes(d)) continue;
    const [x1, y1] = polar(cx, cy, ring - 5, d);
    const [x2, y2] = polar(cx, cy, ring + 5, d);
    ticks.push(`M${x1} ${y1} L${x2} ${y2}`);
  }
  const nodes = palaces
    .map((d) => {
      const [x, y] = polar(cx, cy, ring, d);
      return d === landed
        ? `<circle cx="${x}" cy="${y}" r="11" ${solid}/><circle cx="${x}" cy="${y}" r="11" ${soft(0.22)} ${accent(2.4)}/><circle cx="${x}" cy="${y}" r="4" fill="${C.accent}"/>`
        : `<circle cx="${x}" cy="${y}" r="8.5" ${solid} ${main(2)}/>`;
    })
    .join("\n    ");
  // The count's path: from the first palace round to where it lands.
  const [a1x, a1y] = polar(cx, cy, ring + 18, -78);
  const [a2x, a2y] = polar(cx, cy, ring + 18, 18);
  const [tx, ty] = polar(cx, cy, ring + 18, 21);
  const tipA = 21 + 90;
  // Six yao, top to bottom: broken, solid, broken, solid, broken, solid.
  const pattern = [0, 1, 0, 1, 0, 1];
  const moving = 3;
  const lw = 170;
  const x0 = cx - lw / 2;
  const gap = 22;
  const yao = pattern
    .map((isSolid, i) => {
      const y = 134 + i * 26;
      const fill = i === moving ? C.accent : C.text;
      const op = i === moving ? 1 : 0.9;
      const seg = (x, w) => `<rect x="${x}" y="${y}" width="${w}" height="11" rx="2" fill="${fill}" fill-opacity="${op}"/>`;
      return isSolid ? seg(x0, lw) : seg(x0, (lw - gap) / 2) + seg(x0 + (lw + gap) / 2, (lw - gap) / 2);
    })
    .join("\n    ");
  const movingY = 134 + moving * 26 + 5.5;
  return frame(
    `    <circle cx="${cx}" cy="${cy}" r="${ring}" ${guide(1.5)}/>
    <path d="${ticks.join(" ")}" ${guide(1.5)}/>
    <path d="M${a1x} ${a1y} A${ring + 18} ${ring + 18} 0 0 1 ${a2x} ${a2y}" ${accent(1.8)} stroke-dasharray="3 6"/>
    <path d="M-5 -6 L3 0 L-5 6" transform="translate(${tx} ${ty}) rotate(${tipA})" ${accent(2)}/>
    ${nodes}
    ${yao}
    <circle cx="${x0 + lw + 22}" cy="${movingY}" r="6.5" ${accent(2)}/>
    <!-- lunar calendar -->
    <circle cx="112" cy="92" r="21" fill="${C.muted}" fill-opacity="0.55" mask="url(#moonCut)"/>
    <circle cx="150" cy="64" r="1.8" fill="${C.muted}" fill-opacity="0.6"/>
    <circle cx="84" cy="136" r="1.5" fill="${C.muted}" fill-opacity="0.45"/>
    ${sparkle(522, 318, 7, C.muted, 0.45)}
    <circle cx="548" cy="282" r="1.6" fill="${C.muted}" fill-opacity="0.5"/>`,
    {
      gx: 320,
      gy: 200,
      defs: `
    <mask id="moonCut"><rect width="${W}" height="${H}" fill="#fff"/><circle cx="121" cy="85" r="18" fill="#000"/></mask>`,
    },
  );
}

// ---------------------------------------------------------------------------
// Shadowdeck — a squared deck under a low light, throwing a long shadow.

function shadowdeck() {
  const cw = 124;
  const ch = 176;
  const x0 = 224;
  const y0 = 74;
  const step = 5;
  const layers = 3;
  const dx = 150;
  const dy = 102;
  // Shadow of the whole stack's footprint, cast down-right.
  const fx1 = x0 + cw + layers * step;
  const fy1 = y0 + ch + layers * step;
  const shadow = `M${fx1} ${y0} L${fx1 + dx} ${y0 + dy} L${fx1 + dx} ${fy1 + dy} L${x0 + dx} ${fy1 + dy} L${x0} ${fy1} Z`;
  const lower = Array.from({ length: layers }, (_, k) => {
    const i = layers - k;
    const o = i * step;
    return `<rect x="${x0 + o}" y="${y0 + o}" width="${cw}" height="${ch}" rx="10" ${solid} ${i === layers ? fine(1.5) : detail(1.6)}/>`;
  }).join("\n    ");
  const mx = x0 + cw / 2;
  const my = y0 + ch / 2;
  const diamond = (x, y, s) => `<path d="M${x} ${y - s} L${x + s * 0.7} ${y} L${x} ${y + s} L${x - s * 0.7} ${y} Z" fill="${C.muted}" fill-opacity="0.7"/>`;
  return frame(
    `    <g clip-path="url(#shadowClip)">
      <rect x="${x0}" y="${y0}" width="${fx1 + dx - x0}" height="${fy1 + dy - y0}" fill="url(#shadowFade)"/>
      <rect x="${x0}" y="${y0}" width="${fx1 + dx - x0}" height="${fy1 + dy - y0}" fill="url(#hatch)" mask="url(#hatchFade)"/>
    </g>
    ${lower}
    <rect x="${x0}" y="${y0}" width="${cw}" height="${ch}" rx="10" ${solid} ${main(2.5)}/>
    <rect x="${x0 + 9}" y="${y0 + 9}" width="${cw - 18}" height="${ch - 18}" rx="6" ${fine(1.3)}/>
    ${diamond(x0 + 20, y0 + 24, 6)}
    ${diamond(x0 + cw - 20, y0 + ch - 24, 6)}
    <circle cx="${mx}" cy="${my}" r="36" ${accent(1.2)} stroke-opacity="0.45" stroke-dasharray="1.5 5"/>
    <circle cx="${mx}" cy="${my}" r="27" ${soft(0.2)} ${accent(2.2)}/>
    <circle cx="${mx + 11}" cy="${my - 7}" r="24" ${solid} ${fine(1.3)}/>`,
    {
      gx: 320,
      gy: 200,
      defs: `
    <clipPath id="shadowClip"><path d="${shadow}"/></clipPath>
    <linearGradient id="shadowFade" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0.15" stop-color="${C.elev}" stop-opacity="1"/>
      <stop offset="1" stop-color="${C.elev}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <path d="M0 0 V9" stroke="${C.border}" stroke-width="1.7"/>
    </pattern>
    <linearGradient id="hatchGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0.2" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="hatchFade"><rect x="${x0}" y="${y0}" width="${fx1 + dx - x0}" height="${fy1 + dy - y0}" fill="url(#hatchGrad)"/></mask>`,
    },
  );
}

// ---------------------------------------------------------------------------
// Tennis Match — a court in perspective, two players, one rally in flight.

function tennisMatch() {
  // Perspective: z runs 1 (near baseline) to zf (far baseline); screen
  // position scales with 1/z. Court fractions are ITF proportions.
  const nearHalf = 216;
  const farHalf = 84;
  const zf = nearHalf / farHalf;
  const yNear = 352;
  const yFar = 150;
  const K = (yNear - yFar) / (1 - 1 / zf);
  const yh = yNear - K;
  const P = (u, v) => {
    const z = zf - (zf - 1) * v;
    return [r(320 + (u * nearHalf) / z), r(yh + K / z)];
  };
  const L = (a, b) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
  const singles = 0.75;
  const svcFar = 0.231;
  const svcNear = 0.769;
  const net = 0.5;
  const court = [P(-1, 0), P(1, 0), P(1, 1), P(-1, 1)];
  const lines = [
    L(P(-singles, 0), P(-singles, 1)),
    L(P(singles, 0), P(singles, 1)),
    L(P(-singles, svcFar), P(singles, svcFar)),
    L(P(-singles, svcNear), P(singles, svcNear)),
    L(P(0, svcFar), P(0, svcNear)),
    L(P(0, 0), P(0, 0.018)),
    L(P(0, 1), P(0, 0.985)),
  ].join(" ");
  const [nl, ny] = P(-1.07, net);
  const [nr] = P(1.07, net);
  const netTop = r(ny - 20);
  const mesh = [];
  for (let x = nl + 10; x < nr - 4; x += 11) mesh.push(`M${r(x)} ${netTop + 2} V${ny}`);
  const ball = [400, 116];
  const near = P(-0.42, 0.9);
  const far = P(0.38, 0.12);
  return frame(
    `    <path d="M${court.map((p) => p.join(" ")).join(" L")} Z" fill="${C.card}" fill-opacity="0.28" ${main(2.2)}/>
    <path d="${lines}" ${detail(1.8)}/>
    <!-- net -->
    <rect x="${nl}" y="${netTop}" width="${r(nr - nl)}" height="${r(ny - netTop)}" fill="${C.bg}" fill-opacity="0.72"/>
    <path d="${mesh.join(" ")}" ${fine(1)}/>
    <path d="M${nl} ${r(netTop + 10)} H${nr}" ${fine(1)}/>
    <path d="M${nl} ${netTop} H${nr}" ${main(2.6)}/>
    <path d="M${nl} ${netTop} V${ny} M${nr} ${netTop} V${ny}" ${main(2.2)}/>
    <!-- the rally -->
    <path d="M${near[0] + 8} ${near[1] - 26} Q318 -4 ${ball[0] - 17} ${ball[1] + 3}" ${accent(2)} stroke-dasharray="2 7"/>
    <ellipse cx="${ball[0]}" cy="${P(0.5, 0.2)[1]}" rx="9" ry="2.6" fill="${C.elev}" fill-opacity="0.95"/>
    <circle cx="${near[0]}" cy="${near[1] - 22}" r="8" ${solid} ${main(2.2)}/>
    <path d="M${near[0]} ${near[1] - 14} V${near[1] + 4}" ${main(2.2)}/>
    <circle cx="${far[0]}" cy="${far[1] - 13}" r="5" ${solid} ${main(1.8)}/>
    <path d="M${far[0]} ${far[1] - 8} V${far[1] + 3}" ${main(1.8)}/>
    <circle cx="${ball[0]}" cy="${ball[1]}" r="16" ${solid}/>
    <circle cx="${ball[0]}" cy="${ball[1]}" r="16" ${soft(0.24)} ${accent(2.5)}/>
    <path d="M${ball[0] - 12} ${ball[1] - 10} Q${ball[0] - 3} ${ball[1]} ${ball[0] - 12} ${ball[1] + 10} M${ball[0] + 12} ${ball[1] - 10} Q${ball[0] + 3} ${ball[1]} ${ball[0] + 12} ${ball[1] + 10}" ${accent(1.6)}/>`,
    { gx: 320, gy: 220 },
  );
}

// ---------------------------------------------------------------------------

const ICONS = {
  xompress,
  "medium-daily-digest": mediumDailyDigest,
  "tarot-local-ai": tarotLocalAi,
  "resume-reviewer": resumeReviewer,
  "deep-research-station": deepResearchStation,
  "ffe-reader": ffeReader,
  harvestly,
  "multiagent-scaffold": multiagentScaffold,
  xiaoliuyao,
  shadowdeck,
  "tennis-match": tennisMatch,
};

const only = process.argv[2];
const outRoot = process.argv[3] ?? "public/images/projects";
for (const [slug, draw] of Object.entries(ICONS)) {
  if (only && only !== "all" && slug !== only) continue;
  const dir = path.join(outRoot, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "thumbnail.svg"), draw());
  console.log(`wrote ${slug}/thumbnail.svg`);
}
