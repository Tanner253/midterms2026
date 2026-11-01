// Midterms PFP (a seal: flag shield with the Capitol, laurels, "120TH CONGRESS" ribbon) and X banner (the Capitol).
const fs = require("node:fs");
const path = require("node:path");
const { C, star, sunburst, stripes, render } = require("./render.js");

const OUT = path.join(__dirname, "out");
const rad = (d) => (d * Math.PI) / 180;
const pt = (cx, cy, r, d) => [cx + r * Math.cos(rad(d)), cy + r * Math.sin(rad(d))];

// One laurel branch along an arc around (cx, cy); `dir` 1 runs clockwise (left side), -1 mirrors it.
function laurel(cx, cy, r, from, to, dir) {
  let s = "";
  const steps = 10;
  const [x0, y0] = pt(cx, cy, r, from);
  const [x1, y1] = pt(cx, cy, r, to);
  s += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 ${dir > 0 ? 1 : 0} ${x1.toFixed(1)},${y1.toFixed(1)}" fill="none" stroke="${C.gold}" stroke-width="7" stroke-linecap="round"/>`;
  for (let i = 0; i <= steps; i++) {
    const d = from + ((to - from) * i) / steps;
    const tangent = d + 90 * dir;
    const size = 1 - (i / steps) * 0.35;
    for (const side of [-1, 1]) {
      const [lx, ly] = pt(cx, cy, r + side * 17 * size, d);
      const ang = tangent + side * 32 * dir;
      s += `<ellipse cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="${(30 * size).toFixed(1)}" ry="${(11 * size).toFixed(1)}" transform="rotate(${ang.toFixed(1)} ${lx.toFixed(1)} ${ly.toFixed(1)})" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>`;
    }
  }
  const [tx, ty] = pt(cx, cy, r, to);
  const tang = to + 90 * dir;
  s += `<ellipse cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" rx="22" ry="9" transform="rotate(${tang.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)})" fill="${C.gold}" stroke="${C.ink}" stroke-width="3"/>`;
  return s;
}

// The seal, drawn in a 1024 box centred at 512,512 (outer radius 470).
function seal(id) {
  const shield = "M352,300 H672 V500 C672,590 604,640 512,690 C420,640 352,590 352,500 Z";
  const pales = Array.from({ length: 13 }, (_, i) => `<rect x="${(352 + (i * 320) / 13).toFixed(2)}" y="408" width="${(320 / 13 + 0.6).toFixed(2)}" height="300" fill="${i % 2 ? C.red : C.cream}"/>`).join("");
  const beads = Array.from({ length: 100 }, (_, i) => {
    const [x, y] = pt(512, 512, 451, (i * 360) / 100);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${C.ink}" opacity="0.55"/>`;
  }).join("");
  const arcStars = [254, 270, 286].map((d) => {
    const [x, y] = pt(512, 512, 262, d);
    return `<polygon points="${star(x, y, d === 270 ? 26 : 19)}" fill="${C.gold}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
  }).join("");
  const chiefStars = [384, 424, 600, 640].map((x) => `<polygon points="${star(x, 366, 16)}" fill="${C.cream}"/>`).join("");
  const chiefDome = `<g transform="translate(452 336) scale(0.3)">${capitol(false)}</g>`;
  return `
  <defs>
    <path id="${id}-top" d="M 164 512 A 348 348 0 0 1 860 512"/>
    <path id="${id}-bot" d="M 117 512 A 395 395 0 0 0 907 512"/>
    <clipPath id="${id}-shield"><path d="${shield}"/></clipPath>
    <radialGradient id="${id}-glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#1d3a7d"/>
      <stop offset="1" stop-color="${C.navy}"/>
    </radialGradient>
  </defs>
  <circle cx="526" cy="532" r="470" fill="${C.ink}" opacity="0.75"/>
  <circle cx="512" cy="512" r="470" fill="${C.gold}" stroke="${C.ink}" stroke-width="10"/>
  ${beads}
  <circle cx="512" cy="512" r="432" fill="${C.navy}" stroke="${C.ink}" stroke-width="6"/>
  <text font-family="Barlow Condensed" font-weight="700" font-size="84" letter-spacing="14" fill="${C.gold}">
    <textPath href="#${id}-top" startOffset="50%" text-anchor="middle">UNITED STATES</textPath>
  </text>
  <text font-family="Alfa Slab One" font-size="70" letter-spacing="10" fill="${C.cream}">
    <textPath href="#${id}-bot" startOffset="50%" text-anchor="middle">2026</textPath>
  </text>
  <polygon points="${star(...pt(512, 512, 377, 180), 24)}" fill="${C.gold}"/>
  <polygon points="${star(...pt(512, 512, 377, 0), 24)}" fill="${C.gold}"/>
  <polygon points="${star(...pt(512, 512, 372, 116), 15)}" fill="${C.gold}"/>
  <polygon points="${star(...pt(512, 512, 372, 64), 15)}" fill="${C.gold}"/>
  <circle cx="512" cy="512" r="322" fill="${C.gold}" stroke="${C.ink}" stroke-width="6"/>
  <circle cx="512" cy="512" r="308" fill="url(#${id}-glow)" stroke="${C.ink}" stroke-width="5"/>
  ${laurel(512, 500, 232, 112, 222, 1)}
  ${laurel(512, 500, 232, 68, -42, -1)}
  ${arcStars}
  <path d="${shield}" transform="translate(12 14)" fill="${C.ink}" opacity="0.7"/>
  <g clip-path="url(#${id}-shield)">
    ${pales}
    <rect x="352" y="300" width="320" height="108" fill="${C.navy}"/>
    ${chiefStars}
    ${chiefDome}
    <rect x="352" y="404" width="320" height="8" fill="${C.ink}"/>
  </g>
  <path d="${shield}" fill="none" stroke="${C.ink}" stroke-width="20" stroke-linejoin="round"/>
  <path d="${shield}" fill="none" stroke="${C.gold}" stroke-width="9" stroke-linejoin="round"/>
  ${ribbon(512, 668, 600, "120TH CONGRESS")}`;
}

// A scroll ribbon centred at (cx, cy) with folded tails.
function ribbon(cx, cy, w, text) {
  const h = 84, x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, tail = 78, drop = 26;
  return `
  <polygon points="${x0 + 26},${y0 + drop} ${x0 - tail},${y0 + drop} ${x0 - tail + 34},${(y0 + y1) / 2 + drop} ${x0 - tail},${y1 + drop} ${x0 + 26},${y1 + drop}" fill="${C.redDeep}" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>
  <polygon points="${x1 - 26},${y0 + drop} ${x1 + tail},${y0 + drop} ${x1 + tail - 34},${(y0 + y1) / 2 + drop} ${x1 + tail},${y1 + drop} ${x1 - 26},${y1 + drop}" fill="${C.redDeep}" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>
  <polygon points="${x0},${y1} ${x0 + 26},${y1 + drop} ${x0 + 26},${y1}" fill="${C.ink}"/>
  <polygon points="${x1},${y1} ${x1 - 26},${y1 + drop} ${x1 - 26},${y1}" fill="${C.ink}"/>
  <rect x="${x0 + 8}" y="${y0 + 8}" width="${w}" height="${h}" fill="${C.ink}" opacity="0.6"/>
  <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${C.red}" stroke="${C.ink}" stroke-width="6"/>
  <rect x="${x0 + 10}" y="${y0 + 10}" width="${w - 20}" height="${h - 20}" fill="none" stroke="${C.gold}" stroke-width="3"/>
  <text x="${cx + 3}" y="${cy + 19}" text-anchor="middle" font-family="Alfa Slab One" font-size="48" letter-spacing="2" fill="${C.ink}">${text}</text>
  <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="Alfa Slab One" font-size="48" letter-spacing="2" fill="${C.cream}">${text}</text>`;
}

function pfp() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <rect width="1024" height="1024" fill="${C.navy}"/>
  ${sunburst(512, 512, 32, 900)}
  ${seal("s")}
</svg>`;
}

// The Capitol (west front), drawn in a 400x200 box with the ground at y=200.
// `detail` false drops the small windows and columns for tiny sizes.
function capitol(detail = true) {
  const o = `stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"`;
  const thin = `stroke="${C.ink}" stroke-width="1.6"`;
  const col = (x, y, h, w = 6) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" fill="${C.cream}" ${thin}/>`;
  const shade = (x, y, w, h, op = 0.32) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.navy}" opacity="${op}"/>`;
  const wing = (x0) => `
    <rect x="${x0}" y="126" width="112" height="56" fill="${C.cream}" ${o}/>
    ${detail ? shade(x0 + 8, 134, 96, 44) + Array.from({ length: 8 }, (_, i) => col(x0 + 12 + i * 12.5, 132, 46, 5)).join("") : ""}
    <rect x="${x0 - 4}" y="118" width="120" height="10" fill="${C.cream}" ${o}/>
    <polygon points="${x0 + 18},119 ${x0 + 94},119 ${x0 + 56},103" fill="${C.cream}" ${o}/>`;
  const ribs = [-20, -10, 0, 10, 20].map((dx) => `<path d="M${200 + dx},74 Q${200 + dx * 0.9},52 200,28" fill="none" stroke="${C.ink}" stroke-width="1.4" opacity="0.5"/>`).join("");
  const drumCols = Array.from({ length: 11 }, (_, i) => col(159 + i * 8.2, 92, 22, 4)).join("");
  return `
  <rect x="-12" y="180" width="424" height="20" fill="${C.cream}" ${o}/>
  ${[0, 1, 2].map((i) => `<rect x="${118 - i * 12}" y="${172 + i * 9}" width="${164 + i * 24}" height="9" fill="${C.cream}" ${thin}/>`).join("")}
  ${wing(10)}
  ${wing(278)}
  <rect x="122" y="118" width="156" height="60" fill="${C.cream}" ${o}/>
  ${detail ? shade(130, 128, 140, 46) + Array.from({ length: 8 }, (_, i) => col(136 + i * 18.3, 124, 50, 7)).join("") : ""}
  <rect x="114" y="110" width="172" height="11" fill="${C.cream}" ${o}/>
  <polygon points="150,111 250,111 200,88" fill="${C.cream}" ${o}/>
  <rect x="150" y="106" width="100" height="9" fill="${C.cream}" ${thin}/>
  <rect x="152" y="88" width="96" height="20" fill="${C.cream}" ${o}/>
  ${detail ? drumCols : ""}
  <rect x="148" y="84" width="104" height="7" fill="${C.cream}" ${o}/>
  <rect x="162" y="72" width="76" height="13" fill="${C.cream}" ${o}/>
  <path d="M164,74 C164,46 182,30 200,26 C218,30 236,46 236,74 Z" fill="${C.cream}" ${o}/>
  ${detail ? ribs : ""}
  <rect x="192" y="18" width="16" height="10" fill="${C.cream}" ${o}/>
  <path d="M194,18 Q200,8 206,18 Z" fill="${C.cream}" ${o}/>
  <rect x="198.5" y="0" width="3" height="11" fill="${C.cream}" stroke="${C.ink}" stroke-width="1"/>`;
}

// Scattered stars, deterministic.
function starfield(n, x0, y0, w, h, seed = 7) {
  let v = seed;
  const rnd = () => ((v = (v * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => `<polygon points="${star(x0 + rnd() * w, y0 + rnd() * h, 4 + rnd() * 7)}" fill="${C.cream}" opacity="${(0.15 + rnd() * 0.35).toFixed(2)}"/>`).join("");
}

// X header, 1500x500. The avatar sits over the bottom-left, so the copy stays clear of it.
function banner() {
  const ground = 464;
  const s = 1.16;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 500" width="1500" height="500">
  <defs>
    <radialGradient id="b-sun" cx="0.5" cy="1" r="0.75">
      <stop offset="0" stop-color="${C.gold}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${C.gold}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1500" height="500" fill="${C.navy}"/>
  ${sunburst(1235, ground, 44, 1600)}
  ${starfield(70, 20, 10, 980, 440)}
  <ellipse cx="1235" cy="${ground}" rx="400" ry="300" fill="url(#b-sun)"/>
  <g transform="translate(${1235 - 200 * s} ${ground - 200 * s}) scale(${s})">${capitol()}</g>
  ${stripes("b-stripes", ground, 500 - ground, 1500)}
  <rect x="0" y="${ground - 4}" width="1500" height="6" fill="${C.ink}"/>
  <text x="96" y="112" font-family="Barlow Condensed" font-weight="700" font-size="32" letter-spacing="7" fill="${C.gold}">ELECTION DAY · NOVEMBER 3, 2026</text>
  <text x="102" y="198" font-family="Alfa Slab One" font-size="66" fill="${C.ink}">WHO CONTROLS THE</text>
  <text x="96" y="192" font-family="Alfa Slab One" font-size="66" fill="${C.cream}">WHO CONTROLS THE</text>
  <text x="103" y="311" font-family="Alfa Slab One" font-size="92" fill="${C.ink}">120TH CONGRESS?</text>
  <text x="96" y="304" font-family="Alfa Slab One" font-size="92" fill="${C.gold}">120TH CONGRESS?</text>
  <rect x="425" y="345" width="520" height="62" fill="${C.ink}"/>
  <rect x="420" y="340" width="520" height="62" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>
  <text x="680" y="382" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="32" letter-spacing="4" fill="${C.cream}">$MIDTERMS · MIDTERMS2026.FUN</text>
</svg>`;
}

// The seal alone on a transparent background (the site's logo).
const sealOnly = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${seal("l")}</svg>`;

// Tiny favicons (16-48px): just the flag shield on the gold-ringed disc.
function mark() {
  const shield = "M292,250 H732 V520 C732,640 640,710 512,770 C384,710 292,640 292,520 Z";
  const pales = Array.from({ length: 7 }, (_, i) => `<rect x="${(292 + (i * 440) / 7).toFixed(1)}" y="400" width="${(440 / 7 + 1).toFixed(1)}" height="400" fill="${i % 2 ? C.cream : C.red}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs><clipPath id="m-s"><path d="${shield}"/></clipPath></defs>
  <circle cx="512" cy="512" r="500" fill="${C.gold}" stroke="${C.ink}" stroke-width="24"/>
  <circle cx="512" cy="512" r="420" fill="${C.navy}" stroke="${C.ink}" stroke-width="20"/>
  <g clip-path="url(#m-s)">${pales}<rect x="292" y="250" width="440" height="150" fill="${C.navy}"/>
    <polygon points="${star(512, 328, 62)}" fill="${C.cream}"/></g>
  <path d="${shield}" fill="none" stroke="${C.gold}" stroke-width="30" stroke-linejoin="round"/>
</svg>`;
}

// Share card for X / Telegram, 1200x630.
function og() {
  const s = 245 / 470;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${C.navy}"/>
  ${sunburst(290, 300, 40, 1600)}
  ${starfield(40, 560, 20, 620, 540, 11)}
  <g transform="translate(${290 - 512 * s} ${300 - 512 * s}) scale(${s})">${seal("o")}</g>
  ${stripes("o-stripes", 596, 34, 1200)}
  <rect x="0" y="592" width="1200" height="5" fill="${C.ink}"/>
  <text x="584" y="132" font-family="Barlow Condensed" font-weight="700" font-size="30" letter-spacing="6" fill="${C.gold}">US MIDTERMS 2026 · ON PUMP.FUN</text>
  <text x="588" y="214" font-family="Alfa Slab One" font-size="62" fill="${C.ink}">WHO CONTROLS</text>
  <text x="584" y="210" font-family="Alfa Slab One" font-size="62" fill="${C.cream}">WHO CONTROLS</text>
  <text x="590" y="320" font-family="Alfa Slab One" font-size="90" fill="${C.ink}">THE 120TH</text>
  <text x="584" y="314" font-family="Alfa Slab One" font-size="90" fill="${C.gold}">THE 120TH</text>
  <text x="590" y="416" font-family="Alfa Slab One" font-size="76" fill="${C.ink}">CONGRESS?</text>
  <text x="584" y="410" font-family="Alfa Slab One" font-size="76" fill="${C.gold}">CONGRESS?</text>
  <rect x="589" y="457" width="540" height="62" fill="${C.ink}"/>
  <rect x="584" y="452" width="540" height="62" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>
  <text x="854" y="494" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="32" letter-spacing="4" fill="${C.cream}">$MIDTERMS · MIDTERMS2026.FUN</text>
</svg>`;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, "midterms-pfp.svg"), pfp());
  fs.writeFileSync(path.join(OUT, "midterms-banner.svg"), banner());
  for (const w of [1024, 400]) render(pfp(), `midterms-pfp-${w}.png`, w);
  render(banner(), "midterms-banner-1500x500.png", 1500);
  render(banner(), "midterms-banner-1200x400.png", 1200);
  render(banner(), "midterms-banner-600x200.png", 600);
  render(sealOnly(), "seal.png", 512);
  render(og(), "og.png", 1200);
  render(pfp(), "icon.png", 512);
  render(pfp(), "apple-icon.png", 180);
  const small = [16, 32, 48].map((w) => render(mark(), `favicon-${w}.png`, w));
  fs.writeFileSync(path.join(OUT, "favicon.ico"), await require("png-to-ico")(small));
  console.log("rendered");
}
if (require.main === module) main();

module.exports = { seal, ribbon, laurel, capitol, starfield };
