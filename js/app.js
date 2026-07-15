/* Asteroskopeia — interactive map of astronomical observatories around the world.
 * All observatory content lives in data/observatories.json. */

const BORTLE_CLASSES = {
  1: "Excellent dark-sky site",
  2: "Typical truly dark site",
  3: "Rural sky",
  4: "Rural/suburban transition",
  5: "Suburban sky",
  6: "Bright suburban sky",
  7: "Suburban/urban transition",
  8: "City sky",
  9: "Inner-city sky"
};

/* Conventional light-pollution-map colours for Bortle classes 1–9 */
const BORTLE_COLORS = {
  1: "#1e293b",
  2: "#475569",
  3: "#1d4ed8",
  4: "#15803d",
  5: "#a16207",
  6: "#c2570c",
  7: "#dc2626",
  8: "#be185d",
  9: "#e2e8f0"
};

const TILE_URLS = {
  light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
};

let observatories = [];

/* ---------- Map setup ---------- */
const map = L.map("map", {
  center: [30, 10],
  zoom: 3,
  minZoom: 2,
  maxZoom: 17,
  zoomControl: false,
  worldCopyJump: true
});
L.control.zoom({ position: "bottomright" }).addTo(map);

const tileLayer = L.tileLayer(TILE_URLS[document.documentElement.dataset.theme || "light"], {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: "abcd",
  maxZoom: 19
}).addTo(map);

document.addEventListener("themechange", (e) => tileLayer.setUrl(TILE_URLS[e.detail]));

/* Reset-view control (above the zoom buttons) */
const ResetControl = L.Control.extend({
  options: { position: "bottomright" },
  onAdd() {
    const btn = L.DomUtil.create("button", "reset-view-btn");
    btn.type = "button";
    btn.innerHTML = "🌐";
    btn.title = "Reset to world view";
    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.on(btn, "click", () => map.setView([30, 10], 3));
    return btn;
  }
});
map.addControl(new ResetControl());

/* Marker icon varies with observatory type */
function typeEmoji(type) {
  if (/radio/i.test(type)) return "📡";
  if (/solar/i.test(type)) return "☀️";
  if (/historic|museum/i.test(type)) return "🏛️";
  return "🔭";
}

const iconCache = {};
function obsIconFor(type) {
  const emoji = typeEmoji(type);
  if (!iconCache[emoji]) {
    iconCache[emoji] = L.divIcon({
      className: "",
      html: `<div class="obs-marker">${emoji}</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      tooltipAnchor: [0, -22]
    });
  }
  return iconCache[emoji];
}

/* ---------- Helpers ---------- */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function bortleScaleHtml(cls) {
  const cells = Array.from({ length: 9 }, (_, i) => {
    const n = i + 1;
    return `<span class="bortle-cell${n === cls ? " active" : ""}" style="background:${BORTLE_COLORS[n]}"></span>`;
  }).join("");
  return `<div class="bortle-scale">
    <div class="bortle-cells">${cells}</div>
    <div class="bortle-name">Class ${cls} — ${esc(BORTLE_CLASSES[cls] || "")}</div>
  </div>`;
}

function tooltipHtml(o) {
  return `
    <div class="tip-name">${esc(o.name)}</div>
    <div class="tip-loc">${esc(o.location)}</div>
    <div class="tip-stats">
      <div class="tip-stat">
        <span class="tip-label">Altitude</span>
        <span class="tip-value">${o.altitude_m.toLocaleString("en-US")} m</span>
      </div>
      <div class="tip-stat">
        <span class="tip-label">Founded</span>
        <span class="tip-value">${o.founded}</span>
      </div>
      <div class="tip-stat">
        <span class="tip-label">Bortle sky</span>
        <span class="tip-value"><span class="bortle-dot" style="background:${BORTLE_COLORS[o.bortle]}"></span>${o.bortle} / 9</span>
      </div>
    </div>
    <div class="tip-hint">Click for full details</div>`;
}

function panelHtml(o) {
  const rows = [
    ["Type", esc(o.type)],
    ["Operated by", esc(o.operator)],
    ["Altitude", `${o.altitude_m.toLocaleString("en-US")} m`],
    ["Founded", String(o.founded)],
    ["Telescopes", esc(o.telescopes)]
  ]
    .map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`)
    .join("");

  return `
    <h2>${esc(o.name)}</h2>
    <div class="obs-loc">${esc(o.location)}</div>
    <dl class="obs-meta">${rows}</dl>
    <h3>Sky darkness</h3>
    ${bortleScaleHtml(o.bortle)}
    <h3>About</h3>
    <p>${esc(o.description)}</p>
    <h3>History</h3>
    <p>${esc(o.history)}</p>
    ${o.website ? `<a class="obs-link" href="${esc(o.website)}" target="_blank" rel="noopener">Official website ↗</a>` : ""}
    ${o.approx ? `<div class="approx-note">Map position is approximate.</div>` : ""}`;
}

/* ---------- Panel ---------- */
const panel = document.getElementById("panel");
const panelContent = document.getElementById("panel-content");

function openPanel(o) {
  panelContent.innerHTML = panelHtml(o);
  panel.hidden = false;
}
function closePanel() {
  panel.hidden = true;
}
document.getElementById("panel-close").addEventListener("click", closePanel);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

/* ---------- Rendering ---------- */
const clusterGroup = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 42,
  spiderfyOnMaxZoom: true,
  iconCreateFunction: (cluster) => {
    const n = cluster.getChildCount();
    const size = n >= 20 ? 54 : n >= 8 ? 46 : 38;
    return L.divIcon({
      className: "",
      html: `<div class="obs-cluster">${n}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }
});

function renderMarkers() {
  observatories.forEach((o) => {
    const marker = L.marker(o.coords, { icon: obsIconFor(o.type), keyboard: true });
    marker.on("click", () => openPanel(o));
    marker.bindTooltip(tooltipHtml(o), {
      className: "obs-tooltip",
      direction: "top",
      opacity: 1
    });
    clusterGroup.addLayer(marker);
  });
  map.addLayer(clusterGroup);
}

/* ---------- Map search ---------- */
const searchInput = document.getElementById("map-search-input");
const searchResults = document.getElementById("map-search-results");

function goTo(o) {
  searchInput.value = "";
  searchResults.hidden = true;
  map.flyTo(o.coords, 10, { duration: 1.2 });
  openPanel(o);
}

function renderSearch() {
  const q = searchInput.value.trim().toLowerCase();
  if (q.length < 2) {
    searchResults.hidden = true;
    return;
  }
  const hits = observatories
    .filter((o) => o.name.toLowerCase().includes(q) || o.location.toLowerCase().includes(q))
    .slice(0, 8);
  if (!hits.length) {
    searchResults.innerHTML = `<div class="search-empty">No matches</div>`;
    searchResults.hidden = false;
    return;
  }
  searchResults.innerHTML = hits
    .map(
      (o) => `<button type="button" class="search-hit" data-id="${esc(o.id)}">
        <span class="hit-emoji">${typeEmoji(o.type)}</span>
        <span class="hit-text"><strong>${esc(o.name)}</strong><small>${esc(o.location)}</small></span>
      </button>`
    )
    .join("");
  searchResults.hidden = false;
  searchResults.querySelectorAll(".search-hit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const o = observatories.find((x) => x.id === btn.dataset.id);
      if (o) goTo(o);
    });
  });
}

searchInput.addEventListener("input", renderSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const first = searchResults.querySelector(".search-hit");
    if (first) first.click();
  } else if (e.key === "Escape") {
    searchInput.value = "";
    searchResults.hidden = true;
    searchInput.blur();
  }
});
document.addEventListener("click", (e) => {
  if (!e.target.closest(".map-search")) searchResults.hidden = true;
});

function renderLegend() {
  const legend = document.getElementById("legend-scale");
  for (let i = 1; i <= 9; i++) {
    const cell = document.createElement("div");
    cell.className = "legend-cell";
    cell.title = `${i} — ${BORTLE_CLASSES[i]}`;
    cell.innerHTML = `<span class="legend-swatch" style="background:${BORTLE_COLORS[i]}"></span><span class="legend-num">${i}</span>`;
    legend.appendChild(cell);
  }
}

/* ---------- Init ---------- */
renderLegend();

fetch("data/observatories.json")
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((data) => {
    observatories = data.observatories;
    searchInput.placeholder = `Search ${observatories.length} observatories…`;
    renderMarkers();
    // Deep link from the list page: index.html#<observatory-id>
    const target = decodeURIComponent(location.hash.slice(1));
    if (target) {
      const o = observatories.find((x) => x.id === target);
      if (o) {
        map.setView(o.coords, 10);
        openPanel(o);
      }
    }
  })
  .catch((err) => {
    console.error("Failed to load observatory data:", err);
    panelContent.innerHTML = `<p>Failed to load data (${esc(err.message)}). Serve the site over HTTP, e.g. <code>python3 -m http.server</code>.</p>`;
    panel.hidden = false;
  });
