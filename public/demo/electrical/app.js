// Interactive panel rendering — both panels shown side by side
const wallEl = document.getElementById("panelsWall");
const detailEl = document.getElementById("detail");

let selectedKey = null; // "PanelId:side-slot"

const TYPE_NAMES = {
  standard: "Standard breaker",
  df: "Dual function (AFCI + GFCI)",
  main: "Main breaker",
  spare: "Spare / unused",
  open: "Open position",
  tie: "Handle tie",
};

// Render panels in physical wall order (left -> right)
const PANEL_ORDER = ["B", "A"];

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
    <strong>${panel.name}</strong> — ${panel.make} · ${panel.mainAmps}A main<br/>
    ${panel.voltage}`;
  wrap.appendChild(meta);

  const panelBox = document.createElement("div");
  panelBox.className = "panel";

  const main = panel.circuits.find((c) => c.side === "main");
  const left = buildColumn(panel, "left");
  const right = buildColumn(panel, "right");

  if (main) {
    const m = document.createElement("button");
    m.className = "main-breaker";
    m.dataset.key = circuitKey(id, main);
    if (circuitKey(id, main) === selectedKey) m.classList.add("selected");
    m.innerHTML = `<span class="amp-badge">${main.amps}A</span><span>${main.label}</span>`;
    m.addEventListener("click", () => selectCircuit(id, main));
    panelBox.appendChild(m);
  }

  const feedRow = document.createElement("div");
  feedRow.className = "panel-feed-row";
  const waveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`;
  const downArrow = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`;
  ["Line 1", "Line 2"].forEach((line) => {
    const f = document.createElement("div");
    f.className = "panel-feed";
    f.innerHTML = `
      <div class="panel-feed-top">
        <span class="panel-feed-name">${line}</span>
        <span class="panel-feed-voltage">120V</span>
      </div>
      <div class="panel-feed-bottom">
        <span class="panel-feed-monitored">${waveIcon} Monitored</span>
        <span class="panel-feed-arrow">${downArrow} to circuits</span>
      </div>`;
    feedRow.appendChild(f);
  });

  const feedConnector = document.createElement("div");
  feedConnector.className = "panel-feed-connector";

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
  panelBox.appendChild(feedRow);
  panelBox.appendChild(feedConnector);
  panelBox.appendChild(bus);
  wrap.appendChild(panelBox);
  wrap.appendChild(makeEmporia(panel));
  return wrap;
}

function makeEmporia(panel) {
  const circuit = panel.circuits.find((c) => c.label.startsWith("Emporia"));

  const connector = document.createElement("div");
  connector.className = "emporia-connector";

  const device = document.createElement("div");
  device.className = "emporia-device";
  device.innerHTML = `
    <div class="emporia-header">
      <span class="emporia-name">Emporia Vue 3</span>
      <span class="emporia-status">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        Monitoring
      </span>
    </div>
    <div class="emporia-info">
      Whole-home energy monitor${circuit ? ` · ${circuit.amps}A 240V · slots ${circuit.slot}/${circuit.slot + 2}` : ""}
    </div>
    <div class="emporia-channels">
      <span class="emporia-channel-count">${panel.monitored ? panel.monitored.length : 0}</span>
      channels monitored
    </div>`;

  const wrap = document.createElement("div");
  wrap.className = "emporia-unit";
  wrap.appendChild(connector);
  wrap.appendChild(device);
  return wrap;
}

function makeBreaker(panelId, c) {
  const monitored = new Set(PANELS[panelId].monitored || []);
  const b = document.createElement("button");
  b.className = `breaker t-${c.type}` + (c.poles === 2 ? " double" : "") + (monitored.has(c.slot) ? " monitored" : "");
  b.dataset.key = circuitKey(panelId, c);
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
  const prev = wallEl.querySelector(".selected");
  if (prev) prev.classList.remove("selected");
  selectedKey = circuitKey(panelId, c);
  const next = wallEl.querySelector(`[data-key="${selectedKey}"]`);
  if (next) next.classList.add("selected");
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
