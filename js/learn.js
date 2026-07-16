/* Learn page: interactive explainers — observatory types, EM spectrum,
 * altitude, Bortle sky simulator, history timeline and a mini quiz. */

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Hero starfield ---------- */
(function heroStars() {
  const box = document.getElementById("hero-stars");
  let html = "";
  for (let i = 0; i < 110; i++) {
    const size = (Math.random() * 1.8 + 0.8).toFixed(1);
    html += `<span style="left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 100).toFixed(2)}%;width:${size}px;height:${size}px;animation-delay:${(Math.random() * 4).toFixed(2)}s;animation-duration:${(2.5 + Math.random() * 3).toFixed(2)}s"></span>`;
  }
  box.innerHTML = html;
})();

/* ---------- Chapter 1: types of observatory ---------- */
const TYPES = [
  {
    emoji: "🔭", name: "Optical",
    tagline: "The classic dome on a mountaintop",
    what: "Optical observatories collect visible light (and often near-infrared) with mirrors — the bigger the mirror, the fainter the objects it can see. The largest today stitch dozens of hexagonal mirror segments into a single surface over 10 metres wide.",
    how: "Starlight bounces off a huge primary mirror into cameras and spectrographs. Modern telescopes fire laser beacons into the sky and flex their mirrors hundreds of times per second — <em>adaptive optics</em> — to undo the blurring of the atmosphere in real time.",
    site: "They need high, dry, dark sites with extremely stable air, which is why they cluster on desert peaks in Chile, Hawai'i and the Canary Islands.",
    examples: "Mauna Kea (Hawai'i), Paranal & the VLT (Chile), Roque de los Muchachos (La Palma)."
  },
  {
    emoji: "📡", name: "Radio",
    tagline: "Giant dishes that hear the invisible",
    what: "Radio observatories detect radio waves from space — the glow of cold hydrogen gas, the clockwork ticking of pulsars, the roar of jets around black holes. No eyepiece here: the \"image\" is built by computers from received signals.",
    how: "A single dish acts like a mirror for radio waves. Even better, many dishes can be linked together — <em>interferometry</em> — to act as one telescope the size of a continent. That's how the Event Horizon Telescope photographed a black hole's shadow in 2019.",
    site: "Clouds and daylight don't matter, but human radio chatter does. Radio observatories hide in remote \"radio-quiet zones\" — valleys and deserts where even Wi-Fi and mobile phones are restricted.",
    examples: "FAST (China, 500 m dish), the Very Large Array (USA), Parkes (Australia), Effelsberg (Germany)."
  },
  {
    emoji: "☀️", name: "Solar",
    tagline: "Telescopes that stare at one star only",
    what: "Solar observatories study the Sun: its 11-year spot cycle, its flares and the eruptions that can knock out satellites and power grids. Watching the Sun is a firehose problem — too much light rather than too little.",
    how: "Many are built as tall towers, lifting the optics above heat shimmering off the ground. Special filters isolate single colours of light, and <em>coronagraphs</em> blot out the Sun's disc to create an artificial eclipse and reveal the faint corona.",
    site: "They want the maximum number of clear, stable daytime hours — lake shores and high islands are favourites, since water keeps the surrounding air calm.",
    examples: "Daniel K. Inouye Solar Telescope (Hawai'i, the largest), Big Bear (California), Teide (Tenerife)."
  },
  {
    emoji: "🛰️", name: "Space",
    tagline: "Above the atmosphere entirely",
    what: "Some light never reaches the ground at all — ultraviolet, X-rays, gamma rays and most infrared are absorbed high in the atmosphere. The only way to see it is to put the observatory in space.",
    how: "Space telescopes trade size for a perfect sky: no weather, no blurring, no day-night cycle. The James Webb Space Telescope orbits 1.5 million km away, chilled below −220 °C so its own heat doesn't drown out the faint infrared glow of the first galaxies.",
    site: "\"Site selection\" becomes orbit selection: low Earth orbit for serviceability (Hubble was repaired five times), or distant thermally-stable points like L2 for infrared work.",
    examples: "Hubble (visible/UV), JWST (infrared), Chandra (X-ray), Fermi (gamma-ray)."
  },
  {
    emoji: "🏛️", name: "Historic",
    tagline: "Where astronomy was born",
    what: "Long before telescopes, observatories measured the sky with the naked eye and giant stone instruments — tracking calendars, predicting eclipses and guiding navigation. Many still stand, and many later observatories became museums as city lights swallowed their skies.",
    how: "Instruments like mural quadrants, sextants and gnomons measured the <em>positions</em> of stars and planets with astonishing precision — Ulugh Beg's 15th-century catalogue was accurate to fractions of a degree, centuries before optics.",
    site: "They were built where the astronomers were: in capitals and at courts. The Royal Observatory in Greenwich literally defined the world's Prime Meridian and Greenwich Mean Time.",
    examples: "Ulugh Beg (Samarkand, 1420s), Jantar Mantar (India, 1720s), Royal Greenwich (1675), Paris Observatory (1667)."
  }
];

(function typesWidget() {
  const tabs = document.getElementById("type-tabs");
  const panel = document.getElementById("type-panel");

  tabs.innerHTML = TYPES.map((t, i) =>
    `<button type="button" class="type-tab${i === 0 ? " active" : ""}" role="tab" aria-selected="${i === 0}" data-i="${i}">
       <span class="type-tab-emoji">${t.emoji}</span><span>${t.name}</span>
     </button>`).join("");

  function show(i) {
    const t = TYPES[i];
    tabs.querySelectorAll(".type-tab").forEach((b, j) => {
      b.classList.toggle("active", j === i);
      b.setAttribute("aria-selected", j === i);
    });
    panel.innerHTML = `
      <div class="type-head">
        <span class="type-big-emoji">${t.emoji}</span>
        <div><div class="type-name">${t.name} observatories</div><div class="type-tagline">${t.tagline}</div></div>
      </div>
      <div class="type-grid">
        <div class="type-block"><h4><span>👁</span> What they see</h4><p>${t.what}</p></div>
        <div class="type-block"><h4><span>⚙️</span> How they work</h4><p>${t.how}</p></div>
        <div class="type-block"><h4><span>📍</span> Where they're built</h4><p>${t.site}</p></div>
        <div class="type-block"><h4><span>🌟</span> Famous examples</h4><p>${t.examples}</p></div>
      </div>`;
    panel.classList.remove("pop");
    void panel.offsetWidth;
    panel.classList.add("pop");
  }

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".type-tab");
    if (btn) show(Number(btn.dataset.i));
  });
  show(0);
})();

/* ---------- Chapter 2: EM spectrum ---------- */
const BANDS = [
  {
    key: "radio", name: "Radio", wl: "m – km", color: "#dc2626", width: 3, ground: "✅ Reaches the ground",
    groundNote: "The atmosphere is transparent to radio — one of only two natural \"windows\". Radio telescopes even work in daylight and through clouds.",
    reveals: "Pulsars spinning hundreds of times a second, clouds of cold hydrogen mapping the Milky Way's spiral arms, and jets blasting from supermassive black holes.",
    scope: "FAST (China) · Very Large Array (USA) · Parkes (Australia)"
  },
  {
    key: "mm", name: "Microwave", wl: "mm – cm", color: "#ea580c", width: 2, ground: "🏔️ High & dry sites only",
    groundNote: "Water vapour absorbs millimetre waves, so these telescopes sit on extreme sites — ALMA lives at 5,050 m in the Atacama Desert.",
    reveals: "The cosmic microwave background — the afterglow of the Big Bang — plus the cold dust and gas discs where new stars and planets are forming right now.",
    scope: "ALMA (Chile) · South Pole Telescope"
  },
  {
    key: "ir", name: "Infrared", wl: "µm", color: "#ca8a04", width: 2, ground: "🏔️ Partly — best from space",
    groundNote: "Only slivers of infrared sneak through the atmosphere, and the air itself glows in IR. High peaks catch some; space telescopes catch it all.",
    reveals: "Newborn stars hidden inside dark dust clouds, the atmospheres of exoplanets, and the most distant galaxies — their ancient light stretched into the infrared by cosmic expansion.",
    scope: "JWST (space) · VISTA (Chile) · UKIRT (Hawai'i)"
  },
  {
    key: "visible", name: "Visible", wl: "≈400–700 nm", color: "#16a34a", width: 1.4, ground: "✅ Reaches the ground",
    groundNote: "The second natural window — the one our eyes evolved for. Still blurred by moving air, which is why big telescopes use adaptive optics.",
    reveals: "Stars, planets, nebulae and galaxies — the classic universe. Spectra of visible light tell us what stars are made of and how fast galaxies rush away.",
    scope: "VLT (Chile) · Keck (Hawai'i) · Gran Telescopio Canarias"
  },
  {
    key: "uv", name: "Ultraviolet", wl: "10–400 nm", color: "#7c3aed", width: 1.5, ground: "🛰️ Space only",
    groundNote: "The ozone layer absorbs UV — great for your skin, useless for astronomy. Every UV observatory flies above it.",
    reveals: "The hottest, youngest, most massive stars, and the violent inner regions of active galaxies feeding their central black holes.",
    scope: "Hubble (space) · GALEX (retired)"
  },
  {
    key: "xray", name: "X-ray", wl: "0.01–10 nm", color: "#2563eb", width: 1.6, ground: "🛰️ Space only",
    groundNote: "X-rays are stopped high in the atmosphere (fortunately for life on Earth). X-ray mirrors are so shallow the light skips off them like stones on water.",
    reveals: "Gas heated to millions of degrees as it spirals into black holes, the crushed remains of exploded stars, and vast hot halos around galaxy clusters.",
    scope: "Chandra (space) · XMM-Newton (space)"
  },
  {
    key: "gamma", name: "Gamma", wl: "< 0.01 nm", color: "#0f766e", width: 1.6, ground: "🛰️ Space — with a twist",
    groundNote: "Gamma rays never reach the ground, but when one hits the atmosphere it sparks a flash of blue Cherenkov light — which ground telescopes like H.E.S.S. catch. The atmosphere becomes part of the detector!",
    reveals: "The most violent events in the universe: gamma-ray bursts from collapsing stars, blazars, and matter annihilating around black holes.",
    scope: "Fermi (space) · H.E.S.S. (Namibia) · CTA (building now)"
  }
];

(function spectrumWidget() {
  const bar = document.getElementById("spectrum-bar");
  const panel = document.getElementById("spectrum-panel");

  bar.innerHTML = BANDS.map((b, i) =>
    `<button type="button" class="spec-band" role="tab" aria-selected="false" data-i="${i}"
             style="flex:${b.width};--band-color:${b.color}">
       <span>${b.name}</span><small>${b.wl}</small>
     </button>`).join("");

  function show(i) {
    const b = BANDS[i];
    bar.querySelectorAll(".spec-band").forEach((el, j) => {
      el.classList.toggle("active", j === i);
      el.setAttribute("aria-selected", j === i);
    });
    panel.style.borderTop = `3px solid ${b.color}`;
    panel.innerHTML = `
      <div class="spec-head" style="--band-color:${b.color}">
        <span class="spec-dot"></span>
        <strong>${b.name}</strong>
        <span class="spec-wl">${b.wl}</span>
        <span class="spec-ground">${b.ground}</span>
      </div>
      <div class="spec-body">
        <p class="spec-reveals"><strong>What it reveals:</strong> ${b.reveals}</p>
        <p class="spec-note">${b.groundNote}</p>
        <p class="spec-scopes"><strong>Who watches it:</strong> ${b.scope}</p>
      </div>`;
    panel.classList.remove("pop");
    void panel.offsetWidth;
    panel.classList.add("pop");
  }

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".spec-band");
    if (btn) show(Number(btn.dataset.i));
  });
  show(3); // start on visible light
})();

/* ---------- Chapter 3: altitude slider ---------- */
const ALT_EXAMPLES = [
  { h: 47, name: "Royal Observatory Greenwich, UK" },
  { h: 1283, name: "Lick Observatory, USA" },
  { h: 1712, name: "Palomar Observatory, USA" },
  { h: 2168, name: "Calar Alto Observatory, Spain" },
  { h: 2396, name: "Roque de los Muchachos, La Palma" },
  { h: 3064, name: "Cerro Armazones, Chile — future home of the ELT" },
  { h: 4207, name: "Mauna Kea Observatories, Hawai'i" },
  { h: 5050, name: "ALMA / Chajnantor Plateau, Chile" }
];

const ALT_TIERS = [
  { max: 400, text: "You're in the thick of the atmosphere. Air turbulence smears stars into twinkling blobs, and haze and light pollution wash out the sky. Fine for historic and public observatories — hopeless for frontier research." },
  { max: 1500, text: "Better! You're above the worst of the haze and some of the weather. Many classic 19th–20th century observatories were built at this height, back when any hilltop out of town was dark." },
  { max: 2600, text: "Now we're talking. You're above most clouds and much of the water vapour. The air is thinner and steadier — this is the realm of major research observatories like Calar Alto and La Palma." },
  { max: 4000, text: "Serious territory. Star images sharpen dramatically as the churning lower atmosphere drops away below you. Sites like Cerro Armazones (future ELT) live here — dry, dark, and brutally remote." },
  { max: 6000, text: "The roof of astronomy. At Mauna Kea and Chajnantor, you're above ~40% of the atmosphere and ~90% of its water vapour — infrared and millimetre light finally gets through. Humans need acclimatisation (and sometimes oxygen) to work here." }
];

(function altitudeWidget() {
  const slider = document.getElementById("alt-slider");
  const scene = document.getElementById("alt-scene");
  const starsBox = document.getElementById("alt-stars");
  const value = document.getElementById("alt-value");
  const atmo = document.getElementById("alt-atmo");
  const fill = document.getElementById("alt-fill");
  const desc = document.getElementById("alt-desc");
  const example = document.getElementById("alt-example");
  const dome = document.getElementById("alt-dome");
  const haze = document.getElementById("alt-haze");

  // Static starfield, revealed as the sky darkens with altitude
  let html = "";
  for (let i = 0; i < 70; i++) {
    const size = (Math.random() * 1.6 + 0.8).toFixed(1);
    html += `<span style="left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 70).toFixed(2)}%;width:${size}px;height:${size}px"></span>`;
  }
  starsBox.innerHTML = html;

  // Sky colour: hazy pale blue at sea level → deep near-space blue at 5,100 m
  const SKY = {
    lowTop: [147, 197, 253], lowBot: [219, 229, 240],
    highTop: [7, 15, 38], highBot: [90, 96, 128]
  };
  const lerp = (a, b, f) => Math.round(a + (b - a) * f);
  const rgb = (a, b, f) => `rgb(${lerp(a[0], b[0], f)},${lerp(a[1], b[1], f)},${lerp(a[2], b[2], f)})`;

  function update() {
    const h = Number(slider.value);
    // Fraction of atmosphere (by mass) below altitude h, scale height ≈ 8,435 m
    const below = 1 - Math.exp(-h / 8435);
    value.textContent = `${h.toLocaleString("en-US")} m`;
    atmo.textContent = `Above ${(below * 100).toFixed(0)}% of the atmosphere's mass`;
    fill.style.width = `${(below * 100).toFixed(1)}%`;
    desc.textContent = ALT_TIERS.find((t) => h <= t.max).text;

    let best = ALT_EXAMPLES[0];
    for (const ex of ALT_EXAMPLES) if (Math.abs(ex.h - h) < Math.abs(best.h - h)) best = ex;
    example.innerHTML = `📍 Nearby real site: <strong>${esc(best.name)}</strong> (${best.h.toLocaleString("en-US")} m)`;

    const f = h / 5100;
    scene.style.background = `linear-gradient(to top, ${rgb(SKY.lowBot, SKY.highBot, f)}, ${rgb(SKY.lowTop, SKY.highTop, f)})`;
    starsBox.style.opacity = String(Math.max(0, (f - 0.45) / 0.55) * 0.9);
    haze.style.opacity = String(0.75 * (1 - f));
    // Dome climbs the main peak's left slope (base ≈ x 27%, summit ≈ x 65%)
    dome.style.left = `${27 + f * 38}%`;
    dome.style.bottom = `${5 + f * 76}%`;
  }

  slider.addEventListener("input", update);
  update();
})();

/* ---------- Chapter 4: Bortle sky simulator ---------- */
const BORTLE_COLORS = {
  1: "#1e293b", 2: "#475569", 3: "#1d4ed8", 4: "#15803d", 5: "#a16207",
  6: "#c2570c", 7: "#dc2626", 8: "#be185d", 9: "#e2e8f0"
};

const BORTLE_INFO = [
  { name: "Excellent dark-sky site", zenith: "#01020a", horizon: "#0a0f1c", vis: 1.0, mw: 0.9,
    desc: "The darkest skies on Earth — remote deserts, high mountains, mid-ocean islands.",
    see: "The Milky Way is so bright it casts faint shadows. Zodiacal light, airglow and thousands of stars are visible. Clouds appear as black holes in the sky." },
  { name: "Typical truly dark site", zenith: "#020310", horizon: "#0d1322", vis: 0.85, mw: 0.75,
    desc: "Where most of the world's great observatories live.",
    see: "The summer Milky Way shows rich structure to the naked eye. Airglow may be visible near the horizon. Your surroundings are barely visible." },
  { name: "Rural sky", zenith: "#050718", horizon: "#141b2e", vis: 0.7, mw: 0.55,
    desc: "Deep countryside, far from towns.",
    see: "The Milky Way is still impressive, with some visible structure. A little light-pollution glow sits on the horizon toward distant towns." },
  { name: "Rural / suburban transition", zenith: "#0a0d20", horizon: "#243049", vis: 0.5, mw: 0.3,
    desc: "The edge of a town's influence.",
    see: "The Milky Way is visible overhead but washed out low down. Light domes from towns are obvious in several directions. Clouds are lit from below." },
  { name: "Suburban sky", zenith: "#12162b", horizon: "#3a3f5c", vis: 0.35, mw: 0.12,
    desc: "Typical suburbs of a small city.",
    see: "Only hints of the Milky Way remain, high overhead on the best nights. The sky glows greyish; the brightest deep-sky objects still show in a telescope." },
  { name: "Bright suburban sky", zenith: "#1a1e35", horizon: "#565377", vis: 0.22, mw: 0,
    desc: "Dense suburbs and small-city skies.",
    see: "No Milky Way at all. The sky within 35° of the horizon glows greyish-white. Only brighter constellations are obvious." },
  { name: "Suburban / urban transition", zenith: "#232744", horizon: "#7a6684", vis: 0.12, mw: 0,
    desc: "The outskirts of major cities.",
    see: "The entire sky has a greyish glow. Bright planets and perhaps 50–100 stars are visible. Deep-sky observing is essentially finished." },
  { name: "City sky", zenith: "#2e3252", horizon: "#9a7a72", vis: 0.07, mw: 0,
    desc: "Inside a major city.",
    see: "The sky glows orange or grey. You can read a newspaper by skyglow alone. Only the brightest stars and planets punch through." },
  { name: "Inner-city sky", zenith: "#3a3e60", horizon: "#c08a55", vis: 0.04, mw: 0,
    desc: "The heart of a metropolis.",
    see: "Perhaps a dozen stars survive: the Moon, planets, and the very brightest stars. Many city dwellers have never seen the Milky Way." }
];

(function bortleWidget() {
  const sky = document.getElementById("bortle-sky");
  const mw = document.getElementById("milky-way");
  const starsBox = document.getElementById("bortle-stars");
  const slider = document.getElementById("bortle-slider");
  const chip = document.getElementById("bortle-chip");
  const name = document.getElementById("bortle-name");
  const desc = document.getElementById("bortle-desc");
  const see = document.getElementById("bortle-see");

  // Fixed random starfield; each star has a brightness rank in [0,1) —
  // fainter stars (higher rank) vanish first as the sky brightens.
  const stars = [];
  let html = "";
  for (let i = 0; i < 260; i++) {
    const rank = Math.random();
    const size = rank < 0.06 ? 2.6 : rank < 0.25 ? 1.8 : 1.2;
    html += `<span style="left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 100).toFixed(2)}%;width:${size}px;height:${size}px"></span>`;
    stars.push(rank);
  }
  starsBox.innerHTML = html;
  const starEls = starsBox.children;

  function update() {
    const b = Number(slider.value);
    const info = BORTLE_INFO[b - 1];
    sky.style.background = `linear-gradient(to top, ${info.horizon}, ${info.zenith})`;
    mw.style.opacity = String(info.mw);
    for (let i = 0; i < starEls.length; i++) {
      starEls[i].style.opacity = stars[i] < info.vis ? "0.95" : "0";
    }
    chip.style.background = BORTLE_COLORS[b];
    chip.textContent = `Class ${b}`;
    chip.style.color = b === 9 ? "#1e293b" : "#f8fafc";
    name.textContent = info.name;
    desc.textContent = info.desc;
    see.textContent = `👁 What you'd see: ${info.see}`;
  }

  slider.addEventListener("input", update);
  update();
})();

/* ---------- Chapter 5: timeline ---------- */
const TIMELINE = [
  { year: "~3000 BC", title: "Stone circles track the Sun", emoji: "🗿",
    text: "Monuments like Stonehenge and Newgrange align precisely with solstice sunrises — the first structures built, at least in part, to follow the sky. Calendars for planting and ritual were astronomy's first job." },
  { year: "1420s", title: "Ulugh Beg's giant sextant", emoji: "🏛️",
    text: "In Samarkand, the astronomer-king Ulugh Beg builds a 40-metre stone sextant and catalogues over 1,000 stars with accuracy unmatched for 150 years — all without a telescope." },
  { year: "1609", title: "Galileo points a telescope up", emoji: "🔭",
    text: "Galileo turns a small spyglass to the sky and finds mountains on the Moon, moons around Jupiter and countless stars in the Milky Way. Observation becomes the engine of astronomy." },
  { year: "1675", title: "Greenwich defines time itself", emoji: "⏱️",
    text: "The Royal Observatory is founded to perfect navigation. Its meridian becomes the world's Prime Meridian (0° longitude), and Greenwich Mean Time becomes the planet's clock." },
  { year: "1917", title: "The 100-inch at Mount Wilson", emoji: "🌌",
    text: "Using the world's largest telescope, Edwin Hubble proves the 'spiral nebulae' are other galaxies — then shows the universe is expanding. Our cosmos grows a billionfold overnight." },
  { year: "1937", title: "The first radio telescope", emoji: "📡",
    text: "Grote Reber builds a 9-metre dish in his Illinois backyard and maps the radio sky alone for a decade. A whole invisible universe — pulsars, quasars, the Big Bang's echo — awaits." },
  { year: "1990", title: "Hubble leaves the atmosphere", emoji: "🛰️",
    text: "The Hubble Space Telescope launches, and after a famous repair mission delivers the sharpest views of the cosmos ever seen — deep fields, dark energy, and images that redefine astronomy's public face." },
  { year: "1993", title: "Keck and the segmented mirror", emoji: "💠",
    text: "The 10-metre Keck I telescope proves a giant mirror can be built from small hexagonal segments acting as one — the design breakthrough behind every future giant telescope, including JWST." },
  { year: "2019", title: "A black hole, photographed", emoji: "🕳️",
    text: "The Event Horizon Telescope links radio dishes on four continents into one Earth-sized instrument and captures the shadow of the black hole in galaxy M87." },
  { year: "2021", title: "JWST opens the infrared deep", emoji: "✨",
    text: "The James Webb Space Telescope unfolds 1.5 million km from Earth and peers at the first galaxies, forming stars and exoplanet atmospheres in exquisite infrared detail." },
  { year: "~2029", title: "The Extremely Large Telescope", emoji: "🏗️",
    text: "On Cerro Armazones in Chile, a 39-metre mirror of 798 segments — bigger than all previous large research telescopes combined — will hunt for signs of life on planets around other stars." }
];

(function timelineWidget() {
  const box = document.getElementById("timeline");
  box.innerHTML = TIMELINE.map((t, i) => `
    <div class="tl-item${i === 0 ? " open" : ""}">
      <button type="button" class="tl-head" aria-expanded="${i === 0}" data-i="${i}">
        <span class="tl-dot" aria-hidden="true"></span>
        <span class="tl-year">${t.year}</span>
        <span class="tl-title">${t.emoji} ${t.title}</span>
        <span class="tl-caret" aria-hidden="true">▾</span>
      </button>
      <div class="tl-body"><p>${t.text}</p></div>
    </div>`).join("");

  box.addEventListener("click", (e) => {
    const head = e.target.closest(".tl-head");
    if (!head) return;
    const item = head.parentElement;
    const open = item.classList.toggle("open");
    head.setAttribute("aria-expanded", open);
  });
})();

/* ---------- Chapter 6: quiz ---------- */
const QUIZ = [
  {
    q: "Why are most big optical observatories built on high mountains?",
    options: [
      "To be closer to the stars — every kilometre counts",
      "To get above turbulent, moisture-laden air that blurs and absorbs starlight",
      "Because land is cheaper on mountaintops",
      "So the domes stay cold enough for the electronics"
    ],
    answer: 1,
    why: "The few kilometres of altitude are nothing compared to the light-years to the stars — but they lift the telescope above most of the water vapour and the churning air that smears star images."
  },
  {
    q: "Which kind of observatory can happily observe in daylight and through thick clouds?",
    options: ["Optical", "Solar", "Radio", "None — all need clear night skies"],
    answer: 2,
    why: "Radio waves pass straight through clouds, and the Sun doesn't drown them out — radio telescopes observe around the clock in almost any weather."
  },
  {
    q: "On the Bortle scale of sky darkness, what does class 1 mean?",
    options: [
      "The brightest, most light-polluted sky",
      "An average suburban sky",
      "A perfectly dark sky where the Milky Way can cast shadows",
      "A sky with exactly one visible star"
    ],
    answer: 2,
    why: "The scale runs from 1 (exceptional dark-sky site) to 9 (inner-city sky). At class 1, the Milky Way is bright enough to cast faint shadows."
  },
  {
    q: "What discovery was made with the 100-inch telescope at Mount Wilson in the 1920s?",
    options: [
      "The rings of Saturn",
      "That the universe is expanding and other galaxies exist",
      "The first exoplanet",
      "Radio waves from Jupiter"
    ],
    answer: 1,
    why: "Edwin Hubble used it to prove the spiral 'nebulae' were separate galaxies, then to show they're receding from us — the expanding universe."
  },
  {
    q: "Why does the James Webb Space Telescope observe from space instead of a mountaintop?",
    options: [
      "Mountaintops are all occupied by other telescopes",
      "It's safer from earthquakes in space",
      "The infrared light it studies is absorbed by Earth's atmosphere, and the telescope must be extremely cold",
      "Space telescopes are cheaper to build"
    ],
    answer: 2,
    why: "Water vapour swallows most infrared light before it reaches the ground, and JWST must be chilled below −220 °C so its own warmth doesn't blind it — only deep space offers both."
  },
  {
    q: "How did astronomers photograph a black hole in 2019?",
    options: [
      "With the Hubble Space Telescope's zoom lens",
      "By linking radio dishes across the planet into one Earth-sized telescope",
      "With a probe sent to the galaxy M87",
      "Using the largest single mirror ever built"
    ],
    answer: 1,
    why: "The Event Horizon Telescope combined dishes from Hawai'i to the South Pole using interferometry, achieving the resolving power of a telescope the size of Earth."
  }
];

(function quizWidget() {
  const card = document.getElementById("quiz-card");
  const LETTERS = ["A", "B", "C", "D"];
  let current = 0;
  let score = 0;
  let answered = false;

  function renderQuestion() {
    const q = QUIZ[current];
    answered = false;
    card.innerHTML = `
      <div class="quiz-progress">Question ${current + 1} of ${QUIZ.length}</div>
      <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${(current / QUIZ.length) * 100}%"></div></div>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((o, i) =>
          `<button type="button" class="quiz-opt" data-i="${i}"><span class="quiz-letter">${LETTERS[i]}</span><span>${o}</span></button>`).join("")}
      </div>
      <div class="quiz-why" id="quiz-why" hidden></div>
      <button type="button" class="quiz-next" id="quiz-next" hidden>${current + 1 === QUIZ.length ? "See my score →" : "Next question →"}</button>`;
  }

  function renderScore() {
    const verdicts = [
      [1.0, "🏆 Flawless! You're ready for a night shift at Paranal."],
      [0.8, "🌟 Excellent — you clearly know your way around a dome."],
      [0.5, "🔭 Solid! A little more stargazing and you'll be unstoppable."],
      [0, "🌱 Everyone starts somewhere — scroll back up and explore some more!"]
    ];
    const frac = score / QUIZ.length;
    const verdict = verdicts.find(([min]) => frac >= min)[1];
    card.innerHTML = `
      <div class="quiz-score">
        <div class="quiz-score-big">${score} / ${QUIZ.length}</div>
        <p>${verdict}</p>
        <button type="button" class="quiz-next" id="quiz-restart">Try again ↺</button>
      </div>`;
  }

  card.addEventListener("click", (e) => {
    const opt = e.target.closest(".quiz-opt");
    if (opt && !answered) {
      answered = true;
      const picked = Number(opt.dataset.i);
      const q = QUIZ[current];
      if (picked === q.answer) score++;
      card.querySelectorAll(".quiz-opt").forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) b.classList.add("correct");
        else if (i === picked) b.classList.add("wrong");
      });
      const why = document.getElementById("quiz-why");
      why.textContent = (picked === q.answer ? "✅ Correct! " : "❌ Not quite. ") + q.why;
      why.hidden = false;
      document.getElementById("quiz-next").hidden = false;
      return;
    }
    if (e.target.id === "quiz-next") {
      current++;
      current < QUIZ.length ? renderQuestion() : renderScore();
    }
    if (e.target.id === "quiz-restart") {
      current = 0;
      score = 0;
      renderQuestion();
    }
  });

  renderQuestion();
})();
