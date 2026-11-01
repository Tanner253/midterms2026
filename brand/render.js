// Renders the $MIDTERMS brand images (PFP, banner, share card, favicons) from SVG with the site's fonts.
const { Resvg } = require("@resvg/resvg-js");
const fs = require("node:fs");
const path = require("node:path");

const OUT = path.join(__dirname, "out");
const FONTS = ["AlfaSlabOne-Regular.ttf", "BarlowCondensed-Bold.ttf", "BarlowCondensed-SemiBold.ttf"].map((f) => path.join(__dirname, "fonts", f));

const C = { ink: "#060f27", navy: "#0b1b42", navy2: "#0f2352", red: "#d62839", redDeep: "#b51f30", cream: "#f7f0e1", gold: "#e9b949" };

// 5-point star polygon centred on (cx, cy).
function star(cx, cy, R, r = R * 0.4) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = (-90 + i * 36) * (Math.PI / 180);
    const rad = i % 2 ? r : R;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}

// Sunburst wedges radiating from (cx, cy).
function sunburst(cx, cy, n, R, a = C.navy, b = C.navy2) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a0 = ((i * 360) / n) * (Math.PI / 180);
    const a1 = (((i + 1) * 360) / n) * (Math.PI / 180);
    const p = (ang) => `${(cx + R * Math.cos(ang)).toFixed(1)},${(cy + R * Math.sin(ang)).toFixed(1)}`;
    s += `<path d="M${cx},${cy} L${p(a0)} L${p(a1)} Z" fill="${i % 2 ? a : b}"/>`;
  }
  return s;
}

// The campaign button, drawn in a 1024 box centred at 512,512 (outer radius 440).
// `id` keeps arc/clip ids unique when the button appears in several files.
function button(id) {
  return `
  <defs>
    <path id="${id}-top" d="M 187 512 A 325 325 0 0 1 837 512"/>
    <path id="${id}-bot" d="M 132 512 A 380 380 0 0 0 892 512"/>
    <clipPath id="${id}-disc"><circle cx="512" cy="512" r="290"/></clipPath>
    <radialGradient id="${id}-shine" cx="0.34" cy="0.26" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="528" cy="534" r="440" fill="${C.ink}" opacity="0.75"/>
  <circle cx="512" cy="512" r="440" fill="${C.gold}" stroke="${C.ink}" stroke-width="10"/>
  <circle cx="512" cy="512" r="410" fill="${C.navy}" stroke="${C.ink}" stroke-width="6"/>
  <text font-family="Barlow Condensed" font-weight="700" font-size="78" letter-spacing="9" fill="${C.gold}">
    <textPath href="#${id}-top" startOffset="50%" text-anchor="middle">US MIDTERMS</textPath>
  </text>
  <text font-family="Alfa Slab One" font-size="74" letter-spacing="10" fill="${C.cream}">
    <textPath href="#${id}-bot" startOffset="50%" text-anchor="middle">2026</textPath>
  </text>
  <polygon points="${star(158, 512, 26)}" fill="${C.gold}"/>
  <polygon points="${star(866, 512, 26)}" fill="${C.gold}"/>
  <polygon points="${star(310, 690, 16)}" fill="${C.gold}" opacity="0.9"/>
  <polygon points="${star(714, 690, 16)}" fill="${C.gold}" opacity="0.9"/>
  <circle cx="512" cy="512" r="302" fill="${C.cream}" stroke="${C.ink}" stroke-width="6"/>
  <circle cx="512" cy="512" r="290" fill="${C.red}"/>
  <g clip-path="url(#${id}-disc)" opacity="0.35">
    ${Array.from({ length: 16 }, (_, i) => `<rect x="${-200 + i * 90}" y="0" width="44" height="1400" fill="${C.redDeep}" transform="rotate(35 512 512)"/>`).join("")}
  </g>
  <polygon points="${star(526, 530, 210)}" fill="${C.ink}" opacity="0.85"/>
  <polygon points="${star(512, 512, 210)}" fill="${C.cream}" stroke="${C.ink}" stroke-width="10" stroke-linejoin="round"/>
  <circle cx="512" cy="512" r="290" fill="url(#${id}-shine)"/>`;
}

function pfp() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="${C.navy}"/>
  ${sunburst(512, 512, 32, 900)}
  ${button("p")}
</svg>`;
}

const stripes = (id, y, h, w) => `
  <defs><pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
    <rect width="20" height="40" fill="${C.red}"/><rect x="20" width="20" height="40" fill="${C.cream}"/>
  </pattern></defs>
  <rect x="0" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;

// Title with a hard poster shadow.
const title = (x, y, size, text, fill, shadow = C.ink, off = 6) => `
  <text x="${x + off}" y="${y + off}" font-family="Alfa Slab One" font-size="${size}" fill="${shadow}">${text}</text>
  <text x="${x}" y="${y}" font-family="Alfa Slab One" font-size="${size}" fill="${fill}">${text}</text>`;

const pill = (x, y, h, w, size, text) => `
  <rect x="${x + 5}" y="${y + 5}" width="${w}" height="${h}" fill="${C.ink}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.gold}" stroke="${C.ink}" stroke-width="4"/>
  <text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="${size}" letter-spacing="3" fill="${C.ink}">${text}</text>`;

// Banner, designed at 1200x400 (3:1) and exported at 600x200 and 1200x400.
function banner() {
  const s = 172 / 440; // button outer radius 172px
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" width="1200" height="400">
  <g>
    <rect width="1200" height="400" fill="${C.navy}"/>
    ${sunburst(215, 200, 36, 1400)}
    <polygon points="930,0 1200,0 1200,400 820,400" fill="${C.red}"/>
    <polygon points="900,0 930,0 820,400 790,400" fill="${C.cream}"/>
    ${stripes("b-stripes", 372, 28, 1200)}
    <g transform="translate(${215 - 512 * s} ${200 - 512 * s}) scale(${s})">${button("b")}</g>
    ${title(430, 168, 88, "US MIDTERMS", C.cream)}
    ${title(430, 262, 88, "2026", C.gold)}
    ${pill(696, 205, 58, 430, 30, "$MIDTERMS · ON PUMP.FUN")}
  </g>
</svg>`;
}

// Share card for X / Telegram, 1200x630.
function og() {
  const s = 220 / 440;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <g>
    <rect width="1200" height="630" fill="${C.navy}"/>
    ${sunburst(270, 300, 40, 1600)}
    <polygon points="1080,0 1200,0 1200,630 960,630" fill="${C.red}"/>
    <polygon points="1048,0 1080,0 960,630 928,630" fill="${C.cream}"/>
    ${stripes("o-stripes", 596, 34, 1200)}
    <g transform="translate(${270 - 512 * s} ${300 - 512 * s}) scale(${s})">${button("o")}</g>
    ${title(540, 250, 76, "US MIDTERMS", C.cream)}
    ${title(540, 345, 76, "2026", C.gold)}
    ${pill(540, 385, 62, 460, 31, "$MIDTERMS · ON PUMP.FUN")}
    <text x="542" y="522" font-family="Barlow Condensed" font-weight="600" font-size="28" letter-spacing="3" fill="${C.cream}" opacity="0.85">24 CANDIDATES · 12 RACES</text>
  </g>
</svg>`;
}

// Simplified mark for tiny favicons (16-48px), where the ring lettering would be noise.
function mark() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <circle cx="512" cy="512" r="500" fill="${C.gold}" stroke="${C.ink}" stroke-width="24"/>
  <circle cx="512" cy="512" r="400" fill="${C.red}" stroke="${C.ink}" stroke-width="24"/>
  <polygon points="${star(512, 530, 330)}" fill="${C.cream}" stroke="${C.ink}" stroke-width="28" stroke-linejoin="round"/>
</svg>`;
}

function render(svg, file, width) {
  const r = new Resvg(svg, {
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Barlow Condensed" },
    fitTo: { mode: "width", value: width },
  });
  const png = r.render().asPng();
  fs.writeFileSync(path.join(OUT, file), png);
  return png;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "midterms-pfp.svg"), pfp());
  fs.writeFileSync(path.join(OUT, "midterms-banner.svg"), banner());
  for (const w of [1024, 512, 400]) render(pfp(), `midterms-pfp-${w}.png`, w);
  render(banner(), "midterms-banner-600x200.png", 600);
  render(banner(), "midterms-banner-1200x400.png", 1200);
  render(og(), "og.png", 1200);
  // Site icons: browser tab, phone home screen, and a multi-size favicon.ico.
  render(pfp(), "icon.png", 512);
  render(pfp(), "apple-icon.png", 180);
  const small = [16, 32, 48].map((w) => render(mark(), `favicon-${w}.png`, w));
  const toIco = require("png-to-ico");
  fs.writeFileSync(path.join(OUT, "favicon.ico"), await toIco(small));
  console.log(fs.readdirSync(OUT).map((f) => `${f} ${fs.statSync(path.join(OUT, f)).size}B`).join("\n"));
}
if (require.main === module)
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });

module.exports = { C, star, sunburst, button, stripes, title, pill, render };
