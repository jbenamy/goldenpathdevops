// Interactive panel rendering — both panels shown side by side
const wallEl = document.getElementById("panelsWall");
const detailEl = document.getElementById("detail");

let selectedKey = null; // "PanelId:side-slot"

const TYPE_NAMES = {
  standard: "Standard breaker",
  gfci: "GFCI",
  afci: "AFCI",
  cafci: "CAFCI + AFCI",
  df: "Dual function (AFCI + GFCI)",
  main: "Main breaker",
  spare: "Spare / unused",
  open: "Open position",
  tie: "Handle tie",
};

// Render panels in physical wall order (left -> right)
const PANEL_ORDER = ["A", "B"];

function circuitKey(panelId, c) {
  return `${panelId}:${c.side}-${c.slot}`;
}

// Build the full ordered list of positions for one column (odd = left,
// even = right), inserting "open" placeholders for unused bus slots. A 2-pole
// breaker covers its slot and slot+2, so the covered position is skipped.
function buildColumn(panel, side) {
  const max = panel.slots || 42;
  const start = side === "left" ? 1 : 2;
  const present = panel.circuits.filter((c) => c.side === side);
  const bySlot = new Map(present.map((c) => [c.slot, c]));
  const covered = new Set();
  present.forEach((c) => {
    if (c.poles === 2) covered.add(c.slot + 2);
  });

  const items = [];
  for (let s = start; s <= max; s += 2) {
    if (bySlot.has(s)) items.push(bySlot.get(s));
    else if (covered.has(s)) continue; // lower half of a 2-pole breaker above
    else items.push({ slot: s, side, poles: 1, amps: null, label: "Open", type: "open" });
  }
  return items;
}

function renderWall() {
  wallEl.innerHTML = "";
  PANEL_ORDER.forEach((id) => wallEl.appendChild(makePanel(id, PANELS[id])));
}

function makePanel(id, panel) {
  const wrap = document.createElement("div");
  wrap.className = "panel-unit";

  const meta = document.createElement("div");
  meta.className = "panel-meta";
  meta.innerHTML = `
    <strong>${panel.name}</strong> — ${panel.make}<br/>
    ${panel.mainAmps}A main · ${panel.voltage}`;
  wrap.appendChild(meta);

  const panelBox = document.createElement("div");
  panelBox.className = "panel";

  const main = panel.circuits.find((c) => c.side === "main");
  const left = buildColumn(panel, "left");
  const right = buildColumn(panel, "right");

  if (main) {
    const m = document.createElement("button");
    m.className = "main-breaker";
    if (circuitKey(id, main) === selectedKey) m.classList.add("selected");
    m.innerHTML = `<span class="amp-badge">${main.amps}A</span><span>${main.label}</span>`;
    m.addEventListener("click", () => selectCircuit(id, main));
    panelBox.appendChild(m);
  }

  const bus = document.createElement("div");
  bus.className = "bus";

  const colL = document.createElement("div");
  colL.className = "column left";
  left.forEach((c) => colL.appendChild(makeBreaker(id, c)));

  const colR = document.createElement("div");
  colR.className = "column right";
  right.forEach((c) => colR.appendChild(makeBreaker(id, c)));

  bus.appendChild(colL);
  bus.appendChild(colR);
  panelBox.appendChild(bus);
  wrap.appendChild(panelBox);
  return wrap;
}

function makeBreaker(panelId, c) {
  const b = document.createElement("button");
  b.className = `breaker t-${c.type}` + (c.poles === 2 ? " double" : "");
  if (circuitKey(panelId, c) === selectedKey) b.classList.add("selected");
  const ampBadge = c.amps != null ? `<span class="amp-badge">${c.amps}A</span>` : "";
  const slotMarkup =
    c.poles === 2 ? `<span>${c.slot}</span><span>${c.slot + 2}</span>` : `${c.slot}`;
  b.innerHTML = `
    <span class="slot-num">${slotMarkup}</span>
    ${ampBadge}
    <span class="breaker-label">${c.label}</span>`;
  b.addEventListener("click", () => selectCircuit(panelId, c));
  return b;
}

function selectCircuit(panelId, c) {
  selectedKey = circuitKey(panelId, c);
  renderWall();
  renderDetail(panelId, c);
}

function renderDetail(panelId, c) {
  const panel = PANELS[panelId];

  if (c.type === "open") {
    detailEl.innerHTML = `
      <span class="type-pill dt-open">${TYPE_NAMES.open}</span>
      <h2>Open slot ${c.slot}</h2>
      <div class="detail-panel-tag">${panel.name} · ${panel.make}</div>
      <div class="notes">Empty bus position — available for a new breaker.</div>`;
    return;
  }

  const poleText = c.poles === 2 ? "2-pole (240V)" : "1-pole (120V)";
  const slotText = c.poles === 2 ? `slots ${c.slot}/${c.slot + 2}` : `slot ${c.slot}`;
  detailEl.innerHTML = `
    <span class="type-pill dt-${c.type}">${TYPE_NAMES[c.type] || c.type}</span>
    <h2>${c.label}</h2>
    <div class="detail-panel-tag">${panel.name} · ${panel.make}</div>
    <dl>
      <dt>Rating</dt><dd>${c.amps} A</dd>
      <dt>Poles</dt><dd>${poleText}</dd>
      <dt>Position</dt><dd>${c.side === "main" ? "Service main" : c.side + " column, " + slotText}</dd>
    </dl>
    <div class="notes">${c.notes ? c.notes : "No additional notes."}</div>`;
}

renderWall();
