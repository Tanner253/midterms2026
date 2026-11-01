// X post graphic: the burn so far, set as election returns, with live numbers. 1200x675 design,
// exported at 1600x900. Pass the numbers as JSON: burned, pct, mcap, vol, holders, coins, lead.
const { C, HEAD, LABEL, timing, text, render } = require("./render");
const { mark, svg } = require("./midterms");

const tile = (x, y, w, value, label) => `
  <rect x="${x}" y="${y}" width="${w}" height="120" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>
  <rect x="${x}" y="${y}" width="${w}" height="34" fill="${C.ink}"/>
  ${text(x + w / 2, y + 24, 18, label, { font: LABEL, weight: 700, fill: C.paper, anchor: "middle", spacing: 2 })}
  ${text(x + w / 2, y + 96, value.length > 6 ? 46 : 56, value, { anchor: "middle" })}`;

function xpost(d) {
  return svg(1200, 675, `
  <rect width="1200" height="675" fill="${C.paper}"/>
  ${timing(30, 16, 1150)}
  ${timing(30, 647, 1150)}
  ${text(60, 76, 25, d.kicker || "OFFICIAL RETURNS · US MIDTERMS 2026 · THE FEE ENGINE IS LIVE", { font: LABEL, weight: 700, spacing: 3 })}
  <rect x="60" y="90" width="1080" height="6" fill="${C.ink}"/>
  ${text(56, 262, 180, d.burned)}
  ${text(60, 332, 66, "$MIDTERMS BURNED", { fill: C.swing })}
  ${text(62, 376, 28, `${d.pct} OF THE SUPPLY · GONE FOREVER`, { font: LABEL, weight: 700, spacing: 3 })}

  ${tile(60, 404, 170, d.mcap, "MARKET CAP")}
  ${tile(242, 404, 170, d.vol, "24H VOLUME")}
  ${tile(424, 404, 170, d.holders, "HOLDERS")}
  ${tile(606, 404, 170, d.coins, "COINS LIVE")}

  <g transform="translate(838 96) scale(0.3)">${mark()}</g>
  ${text(990, 422, 44, "EVERY CANDIDATE", { anchor: "middle", weight: 800 })}
  ${text(990, 468, 44, "COIN FEEDS THE BURN", { anchor: "middle", weight: 800 })}
  ${text(990, 524, 52, d.every || "EVERY 15 MINUTES", { anchor: "middle", fill: C.swing })}

  ${text(62, 572, 24, d.lead, { font: LABEL, weight: 700, spacing: 2 })}
  ${text(60, 620, 42, "MIDTERMS2026.FUN")}`);
}

if (require.main === module) {
  const data = JSON.parse(process.argv[2]);
  render(xpost(data), "x-post-burn.png", 1600);
  console.log("rendered out/x-post-burn.png");
}
