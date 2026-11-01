// X post graphic: the burn so far, with live numbers. 1200x675 design, exported at 1600x900.
const { C, sunburst, button, stripes, title, render } = require("./render");
const { seal } = require("./midterms");

const tile = (x, y, w, h, value, label) => `
  <rect x="${x + 6}" y="${y + 6}" width="${w}" height="${h}" fill="${C.ink}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.navy}" stroke="${C.gold}" stroke-width="3"/>
  <text x="${x + w / 2}" y="${y + 62}" text-anchor="middle" font-family="Alfa Slab One" font-size="${value.length > 5 ? 33 : 40}" fill="${C.cream}">${value}</text>
  <text x="${x + w / 2}" y="${y + 98}" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="19" letter-spacing="2.5" fill="${C.gold}">${label}</text>`;

function xpost(d) {
  const s = 124 / 470;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
  <rect width="1200" height="675" fill="${C.navy}"/>
  ${sunburst(330, 300, 40, 1600)}
  <polygon points="930,0 1200,0 1200,675 780,675" fill="${C.red}"/>
  <polygon points="900,0 930,0 780,675 750,675" fill="${C.cream}"/>
  ${stripes("x-stripes", 640, 35, 1200)}
  <g transform="translate(${1062 - 512 * s} ${150 - 512 * s}) scale(${s})">${seal("x")}</g>

  <text x="62" y="72" font-family="Barlow Condensed" font-weight="700" font-size="26" letter-spacing="4" fill="${C.gold}">${d.kicker || "US MIDTERMS 2026 · THE FEE ENGINE IS LIVE"}</text>
  ${title(56, 222, 150, d.burned, C.cream, C.ink, 8)}
  ${title(60, 300, 56, "$MIDTERMS BURNED", C.gold)}
  <text x="62" y="352" font-family="Barlow Condensed" font-weight="700" font-size="32" letter-spacing="3" fill="${C.cream}">${d.pct} OF THE SUPPLY · GONE FOREVER</text>

  ${tile(60, 400, 160, 118, d.mcap, "MARKET CAP")}
  ${tile(236, 400, 160, 118, d.vol, "24H VOLUME")}
  ${tile(412, 400, 160, 118, d.holders, "HOLDERS")}
  ${tile(588, 400, 160, 118, d.coins, "COINS LIVE")}

  <g font-family="Barlow Condensed" font-weight="700" font-size="34" letter-spacing="2" fill="${C.cream}" text-anchor="middle">
    <text x="1040" y="345">EVERY CANDIDATE</text>
    <text x="1040" y="385">COIN FEEDS</text>
    <text x="1040" y="425">THE BURN</text>
  </g>
  <text x="1040" y="490" text-anchor="middle" font-family="Alfa Slab One" font-size="34" fill="${C.gold}">${d.every || "EVERY 15 MIN"}</text>

  <text x="62" y="562" font-family="Barlow Condensed" font-weight="600" font-size="24" letter-spacing="3" fill="${C.cream}" opacity="0.85">${d.lead}</text>
  <text x="62" y="614" font-family="Barlow Condensed" font-weight="700" font-size="36" letter-spacing="5" fill="${C.gold}">MIDTERMS2026.FUN</text>
</svg>`;
}

const data = JSON.parse(process.argv[2]);
render(xpost(data), "x-post-burn.png", 1600);
console.log("rendered out/x-post-burn.png");
