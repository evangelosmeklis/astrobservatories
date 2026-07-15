/* List page: browse/filter all observatories from data/observatories.json. */

const BORTLE_COLORS = {
  1: "#1e293b", 2: "#475569", 3: "#1d4ed8", 4: "#15803d", 5: "#a16207",
  6: "#c2570c", 7: "#dc2626", 8: "#be185d", 9: "#e2e8f0"
};
const BORTLE_CLASSES = {
  1: "Excellent dark-sky site", 2: "Typical truly dark site", 3: "Rural sky",
  4: "Rural/suburban transition", 5: "Suburban sky", 6: "Bright suburban sky",
  7: "Suburban/urban transition", 8: "City sky", 9: "Inner-city sky"
};
const SKY_BANDS = { dark: [1, 3], moderate: [4, 6], bright: [7, 9] };

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const country = (o) => o.location.split(",").pop().trim();

let all = [];

const el = {
  search: document.getElementById("f-search"),
  country: document.getElementById("f-country"),
  type: document.getElementById("f-type"),
  sky: document.getElementById("f-sky"),
  sort: document.getElementById("f-sort"),
  count: document.getElementById("result-count"),
  cards: document.getElementById("cards")
};

function fillSelect(select, values) {
  values.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

function cardHtml(o) {
  return `
    <article class="obs-card">
      <h3>${esc(o.name)}</h3>
      <div class="card-loc">${esc(o.location)}</div>
      <div class="card-meta">
        <span>${esc(o.type)}</span>
        <span>⋅</span>
        <span>${o.altitude_m.toLocaleString("en-US")} m</span>
        <span>⋅</span>
        <span>est. ${o.founded}</span>
      </div>
      <div class="card-bortle">
        <span class="bortle-dot" style="background:${BORTLE_COLORS[o.bortle]}"></span>
        Bortle ${o.bortle} — ${esc(BORTLE_CLASSES[o.bortle])}
      </div>
      <div class="card-links">
        <a href="index.html#${encodeURIComponent(o.id)}">View on map →</a>
        ${o.website ? `<a href="${esc(o.website)}" target="_blank" rel="noopener">Website ↗</a>` : ""}
      </div>
    </article>`;
}

function render() {
  const q = el.search.value.trim().toLowerCase();
  const c = el.country.value;
  const t = el.type.value;
  const sky = el.sky.value;

  let items = all.filter((o) => {
    if (q && !(o.name.toLowerCase().includes(q) || o.location.toLowerCase().includes(q))) return false;
    if (c && country(o) !== c) return false;
    if (t && o.type !== t) return false;
    if (sky) {
      const [lo, hi] = SKY_BANDS[sky];
      if (o.bortle < lo || o.bortle > hi) return false;
    }
    return true;
  });

  const sorters = {
    name: (a, b) => a.name.localeCompare(b.name),
    altitude: (a, b) => b.altitude_m - a.altitude_m,
    oldest: (a, b) => a.founded - b.founded,
    newest: (a, b) => b.founded - a.founded
  };
  items.sort(sorters[el.sort.value] || sorters.name);

  el.count.textContent = `Showing ${items.length} of ${all.length} observatories`;
  el.cards.innerHTML = items.map(cardHtml).join("");
}

["input", "change"].forEach((ev) => {
  el.search.addEventListener(ev, render);
});
[el.country, el.type, el.sky, el.sort].forEach((s) => s.addEventListener("change", render));

fetch("data/observatories.json")
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then((data) => {
    all = data.observatories;
    fillSelect(el.country, [...new Set(all.map(country))].sort());
    fillSelect(el.type, [...new Set(all.map((o) => o.type))].sort());
    render();
  })
  .catch((err) => {
    el.count.textContent = `Failed to load data (${err.message}).`;
  });
