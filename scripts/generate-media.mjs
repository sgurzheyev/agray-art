import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "media");

const SILVER = "#c9d0db";
const SILVER2 = "#eef2f7";
const SILVER3 = "#7b8492";
const INK = "#050505";

function wrap(inner, caption) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="${caption}">
  <rect width="800" height="1000" fill="${INK}"/>
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="#16181e"/>
      <stop offset="70%" stop-color="${INK}"/>
    </radialGradient>
    <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${SILVER2}"/>
      <stop offset="45%" stop-color="${SILVER}"/>
      <stop offset="100%" stop-color="${SILVER3}"/>
    </linearGradient>
    <filter id="soft">
      <feGaussianBlur stdDeviation="0.6"/>
    </filter>
  </defs>
  <rect width="800" height="1000" fill="url(#g)"/>
  <rect x="28" y="28" width="744" height="944" fill="none" stroke="${SILVER}" stroke-opacity="0.22"/>
  <rect x="36" y="36" width="728" height="928" fill="none" stroke="${SILVER}" stroke-opacity="0.08"/>
  ${inner}
  <text x="400" y="930" text-anchor="middle" fill="${SILVER}" fill-opacity="0.55" font-family="Georgia, serif" font-size="18" letter-spacing="6">${caption}</text>
</svg>`;
}

function ring({ y = 430, r = 150, thick = 22, stone = true, oval = false }) {
  const rx = oval ? r * 1.15 : r;
  const ry = oval ? r * 0.92 : r;
  const inner = `<ellipse cx="400" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#silver)" stroke-width="${thick}"/>
    <ellipse cx="400" cy="${y}" rx="${rx - thick * 0.55}" ry="${ry - thick * 0.55}" fill="none" stroke="${SILVER2}" stroke-opacity="0.35" stroke-width="1.2"/>`;
  const gem = stone
    ? `<g transform="translate(400 ${y - r - 8})">
        <polygon points="0,-48 32,-12 18,28 -18,28 -32,-12" fill="url(#silver)" opacity="0.95"/>
        <polygon points="0,-48 16,-12 0,10 -16,-12" fill="${SILVER2}" opacity="0.55"/>
      </g>`
    : "";
  return inner + gem;
}

function bracelet() {
  const links = Array.from({ length: 14 }, (_, i) => {
    const t = (i / 14) * Math.PI * 2;
    const x = 400 + Math.cos(t) * 210;
    const y = 460 + Math.sin(t) * 92;
    const rot = (t * 180) / Math.PI;
    return `<rect x="${x - 18}" y="${y - 10}" width="36" height="20" rx="8" fill="none" stroke="url(#silver)" stroke-width="5" transform="rotate(${rot} ${x} ${y})"/>`;
  }).join("\n");
  return links;
}

function cross({ orthodox = true }) {
  const extra = orthodox
    ? `<line x1="310" y1="390" x2="490" y2="390" stroke="url(#silver)" stroke-width="10" stroke-linecap="round"/>
       <line x1="340" y1="620" x2="460" y2="560" stroke="url(#silver)" stroke-width="10" stroke-linecap="round"/>`
    : "";
  return `
    <line x1="400" y1="250" x2="400" y2="720" stroke="url(#silver)" stroke-width="22" stroke-linecap="round"/>
    <line x1="270" y1="430" x2="530" y2="430" stroke="url(#silver)" stroke-width="22" stroke-linecap="round"/>
    ${extra}
    <circle cx="400" cy="250" r="10" fill="${SILVER2}"/>
  `;
}

function earrings() {
  return `
    <g transform="translate(-90 0)">
      <circle cx="400" cy="280" r="10" fill="url(#silver)"/>
      <path d="M400 292 C360 360 350 470 400 560 C450 470 440 360 400 292Z" fill="none" stroke="url(#silver)" stroke-width="8"/>
      <circle cx="400" cy="575" r="16" fill="url(#silver)"/>
    </g>
    <g transform="translate(90 0)">
      <circle cx="400" cy="280" r="10" fill="url(#silver)"/>
      <path d="M400 292 C360 360 350 470 400 560 C450 470 440 360 400 292Z" fill="none" stroke="url(#silver)" stroke-width="8"/>
      <circle cx="400" cy="575" r="16" fill="url(#silver)"/>
    </g>
  `;
}

function pendant() {
  return `
    <line x1="400" y1="180" x2="400" y2="300" stroke="url(#silver)" stroke-width="4"/>
    <circle cx="400" cy="176" r="8" fill="none" stroke="url(#silver)" stroke-width="4"/>
    <path d="M400 300 C330 360 300 470 400 620 C500 470 470 360 400 300Z" fill="none" stroke="url(#silver)" stroke-width="10"/>
    <circle cx="400" cy="430" r="28" fill="url(#silver)" opacity="0.85"/>
  `;
}

function iconPlate() {
  return `
    <rect x="230" y="220" width="340" height="460" rx="18" fill="none" stroke="url(#silver)" stroke-width="10"/>
    <rect x="250" y="240" width="300" height="420" rx="8" fill="none" stroke="${SILVER}" stroke-opacity="0.35"/>
    <circle cx="400" cy="390" r="70" fill="none" stroke="url(#silver)" stroke-width="6"/>
    <circle cx="400" cy="400" r="36" fill="url(#silver)" opacity="0.8"/>
    <path d="M340 560 Q400 500 460 560" fill="none" stroke="url(#silver)" stroke-width="6"/>
  `;
}

function chain() {
  const links = Array.from({ length: 9 }, (_, i) => {
    const y = 220 + i * 70;
    const odd = i % 2;
    return `<ellipse cx="400" cy="${y}" rx="${odd ? 28 : 46}" ry="${odd ? 46 : 28}" fill="none" stroke="url(#silver)" stroke-width="10"/>`;
  }).join("\n");
  return links;
}

function wedding() {
  return `
    <g transform="translate(-54 10)">${ring({ y: 470, r: 128, thick: 18, stone: false })}</g>
    <g transform="translate(54 -10)">${ring({ y: 470, r: 128, thick: 18, stone: false })}</g>
  `;
}

function sport() {
  return `
    <rect x="210" y="390" width="380" height="90" rx="45" fill="none" stroke="url(#silver)" stroke-width="14"/>
    <rect x="230" y="408" width="340" height="54" rx="27" fill="#111"/>
    <rect x="250" y="420" width="120" height="30" rx="8" fill="url(#silver)"/>
    <circle cx="560" cy="435" r="8" fill="${SILVER2}"/>
    <text x="400" y="620" text-anchor="middle" fill="${SILVER}" font-family="Georgia, serif" font-size="28" letter-spacing="10">SPORT</text>
  `;
}

function others() {
  return `
    <circle cx="310" cy="435" r="28" fill="none" stroke="url(#silver)" stroke-width="12"/>
    <circle cx="400" cy="435" r="28" fill="none" stroke="url(#silver)" stroke-width="12"/>
    <circle cx="490" cy="435" r="28" fill="none" stroke="url(#silver)" stroke-width="12"/>
    <circle cx="310" cy="435" r="8" fill="${SILVER2}"/>
    <circle cx="400" cy="435" r="8" fill="${SILVER}"/>
    <circle cx="490" cy="435" r="8" fill="${SILVER2}"/>
    <text x="400" y="620" text-anchor="middle" fill="${SILVER}" font-family="Georgia, serif" font-size="28" letter-spacing="10">OTHERS</text>
  `;
}

function hoops() {
  return `
    <ellipse cx="310" cy="460" rx="70" ry="160" fill="none" stroke="url(#silver)" stroke-width="14"/>
    <ellipse cx="490" cy="460" rx="70" ry="160" fill="none" stroke="url(#silver)" stroke-width="14"/>
    <circle cx="310" cy="300" r="8" fill="${SILVER2}"/>
    <circle cx="490" cy="300" r="8" fill="${SILVER2}"/>
  `;
}

function signet() {
  return `
    ${ring({ y: 500, r: 145, thick: 26, stone: false })}
    <rect x="352" y="300" width="96" height="70" rx="8" fill="url(#silver)"/>
    <text x="400" y="346" text-anchor="middle" fill="${INK}" font-family="Georgia, serif" font-size="28">AG</text>
  `;
}

const kinds = {
  ring: () => ring({}),
  ringOval: () => ring({ oval: true, r: 145 }),
  ringPlain: () => ring({ stone: false, thick: 26, r: 155 }),
  bracelet: () => bracelet(),
  cross: () => cross({}),
  crossLatin: () => cross({ orthodox: false }),
  earrings: () => earrings(),
  hoops: () => hoops(),
  pendant: () => pendant(),
  icon: () => iconPlate(),
  chain: () => chain(),
  wedding: () => wedding(),
  sport: () => sport(),
  others: () => others(),
  signet: () => signet(),
};

const catalog = [
  ["AG-R-0142", "ring", "AURORA"],
  ["AG-R-0142", "ringOval", "AURORA"],
  ["AG-R-0208", "ring", "SOLSTICE"],
  ["AG-R-0208", "ringOval", "SOLSTICE"],
  ["AG-R-0311", "signet", "NOIR"],
  ["AG-R-0311", "ringPlain", "NOIR"],
  ["AG-B-1104", "bracelet", "LINEA"],
  ["AG-B-1104", "bracelet", "LINEA"],
  ["AG-B-1188", "bracelet", "VENICE"],
  ["AG-B-1188", "bracelet", "VENICE"],
  ["AG-B-1210", "bracelet", "COBRA"],
  ["AG-B-1210", "bracelet", "COBRA"],
  ["AG-C-2041", "cross", "ORTHODOX"],
  ["AG-C-2041", "crossLatin", "ORTHODOX"],
  ["AG-C-2099", "crossLatin", "MINIMAL"],
  ["AG-C-2099", "cross", "MINIMAL"],
  ["AG-C-2217", "cross", "ON CHAIN"],
  ["AG-C-2217", "chain", "ON CHAIN"],
  ["AG-E-3302", "earrings", "DROPS"],
  ["AG-E-3302", "hoops", "DROPS"],
  ["AG-E-3375", "hoops", "HOOPS"],
  ["AG-E-3375", "earrings", "HOOPS"],
  ["AG-E-3419", "earrings", "STELLA"],
  ["AG-E-3419", "hoops", "STELLA"],
  ["AG-P-4501", "pendant", "LUNE"],
  ["AG-P-4501", "pendant", "LUNE"],
  ["AG-P-4566", "pendant", "COEUR"],
  ["AG-P-4566", "pendant", "COEUR"],
  ["AG-P-4612", "pendant", "LETTER"],
  ["AG-P-4612", "signet", "LETTER"],
  ["AG-I-5703", "icon", "VLADIMIR"],
  ["AG-I-5703", "icon", "VLADIMIR"],
  ["AG-I-5788", "icon", "ANGEL"],
  ["AG-I-5788", "icon", "ANGEL"],
  ["AG-N-6804", "chain", "BISMARCK"],
  ["AG-N-6804", "chain", "BISMARCK"],
  ["AG-N-6861", "chain", "ANCHOR"],
  ["AG-N-6861", "chain", "ANCHOR"],
  ["AG-N-6910", "chain", "BOX"],
  ["AG-N-6910", "chain", "BOX"],
  ["AG-W-8001", "wedding", "CLASSIC"],
  ["AG-W-8001", "ringPlain", "CLASSIC"],
  ["AG-W-8044", "wedding", "SATIN"],
  ["AG-W-8044", "ringPlain", "SATIN"],
  ["AG-W-8112", "wedding", "COMFORT"],
  ["AG-W-8112", "ringOval", "COMFORT"],
  ["AG-S-9007", "sport", "PULSE"],
  ["AG-S-9007", "bracelet", "PULSE"],
  ["AG-S-9042", "sport", "TRACK"],
  ["AG-S-9042", "signet", "TRACK"],
  ["AG-S-9090", "sport", "GRIP"],
  ["AG-S-9090", "bracelet", "GRIP"],
];

const counts = {};

for (const [sku, kind, caption] of catalog) {
  counts[sku] = (counts[sku] || 0) + 1;
  const n = String(counts[sku]).padStart(2, "0");
  const dir = join(root, "products", sku);
  mkdirSync(dir, { recursive: true });
  const draw = kinds[kind];
  writeFileSync(join(dir, `${n}.svg`), wrap(draw(), `${caption}  ·  ${sku}`));
}

const hero = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
  <rect width="1920" height="1080" fill="#050505"/>
</svg>`;

mkdirSync(join(root, "hero"), { recursive: true });
writeFileSync(join(root, "hero", "poster.svg"), hero);

const atelier = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#07080a"/>
  <rect x="80" y="90" width="1040" height="720" fill="none" stroke="#c9d0db" stroke-opacity="0.25"/>
  <g fill="none" stroke="#c9d0db" stroke-width="3">
    <rect x="180" y="220" width="360" height="240"/>
    <rect x="620" y="250" width="280" height="180"/>
    <circle cx="360" cy="620" r="70"/>
    <path d="M700 620 h220"/>
  </g>
  <text x="600" y="820" text-anchor="middle" fill="#c9d0db" fill-opacity="0.6" font-family="Georgia, serif" font-size="22" letter-spacing="8">АТЕЛЬЕ</text>
</svg>`;
mkdirSync(join(root, "atelier"), { recursive: true });
writeFileSync(join(root, "atelier", "workbench.svg"), atelier);

mkdirSync(join(root, "import", "telegram"), { recursive: true });
writeFileSync(
  join(root, "import", "telegram", "README.md"),
  `# Telegram catalog import (future)

Drop exported catalog photos here, then map them to SKUs.

Suggested layout after sync:

\`\`\`
media/import/telegram/{message_id}.jpg
media/products/{SKU}/01.jpg
media/products/{SKU}/02.jpg
media/products/{SKU}/proof.mp4
\`\`\`

Keep original Telegram filenames in a sidecar JSON during import so ~7k photos can be reconciled with артикул.
`,
);

mkdirSync(join(root, "hero"), { recursive: true });
writeFileSync(
  join(root, "hero", "README.md"),
  `The home background is the chrome AG monogram (CSS 3D, scroll-driven rotateY). Optional \`atelier.mp4\` is unused as a hero plate.\n`,
);

console.log("media generated");
