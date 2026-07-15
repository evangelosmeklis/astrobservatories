# Astrobservatories 🔭

Interactive map of astronomical observatories around the world — planned home: **asteroskopeia.gr**.

A plain static site: no framework, no build step, no backend. HTML + CSS + vanilla JS + [Leaflet](https://leafletjs.com) (vendored locally in `vendor/leaflet/`). The only external dependency at runtime is the map tile server.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

(Any static server works. Opening `index.html` directly via `file://` won't load the JSON data due to browser CORS rules.)

## Editing content — the only file you normally touch

All observatory content lives in **`data/observatories.json`**:

```jsonc
{
  "id": "unique-slug",
  "name": "…",
  "location": "…",
  "coords": [37.98, 22.19],        // [latitude, longitude]
  "approx": true,                  // optional: shows "position is approximate"
  "altitude_m": 2340,
  "founded": 2007,
  "type": "Research",
  "operator": "…",
  "bortle": 3,                     // Bortle class 1 (darkest) … 9 (brightest)
  "telescopes": "…",
  "description": "…",
  "history": "…",
  "website": "https://…"           // "" if none
}
```

Add/edit an entry, refresh the page — done. UI labels and Bortle class names are at the top of `js/app.js`.

## Structure

```
index.html               map page
list.html                browsable list with search + country/type/sky filters
about.html               about the site & the Bortle scale
contact.html             contact info (plain email, no form)
css/style.css            all styling (light by default, dark "night sky" via toggle)
js/app.js                map logic, clustering, detail panel, #id deep links
js/list.js               list page filtering/sorting
js/theme.js              shared light/dark toggle (all pages)
data/observatories.json  ← all observatory content
vendor/leaflet/          Leaflet 1.9.4, vendored (no CDN needed)
vendor/markercluster/    Leaflet.markercluster 1.5.3, vendored
```

## Deployment (homelab)

Runs as an nginx container on the homelab via `docker-compose.yml` (port **3015**, following the house 30xx convention):

```bash
docker compose up -d      # start / apply compose changes
docker compose restart    # not needed for content edits — files are bind-mounted
```

The project directory is bind-mounted read-only as the web root, so editing any site file on the host is live immediately (nginx caches `/data/` for 5 min). `nginx.conf` adds gzip and cache headers — it is a single-file mount, so after editing it run `docker compose up -d --force-recreate` (single-file bind mounts pin the old inode; a plain restart won't pick up the change).

When `asteroskopeia.gr` is bought, either:
- point DNS at the homelab and put the usual reverse proxy (Caddy/Traefik/NPM) in front of port 3015 for HTTPS, or
- host the same files for free on Cloudflare Pages / Netlify / GitHub Pages and point DNS there, avoiding exposing the homelab.

## Map tiles

The basemap uses CARTO's free tiles — `voyager` in light mode, `dark_all` in dark mode (fine for small non-commercial sites, attribution required and already included). To switch providers, change the `TILE_URLS` in `js/app.js` — e.g. standard OSM:
`https://tile.openstreetmap.org/{z}/{x}/{y}.png`.

## Data notes

- Coverage: 154 observatories worldwide — research summits (Mauna Kea, Paranal, La Palma…), radio arrays (VLA, MeerKAT, FAST, GMRT…), solar sites, and historic observatories on every continent. Most of the dataset was compiled by a deep-research agent using `docs/research-prompt.md`; the Greek sites and a few others were curated by hand.
- Bortle values are reasonable estimates for each area, not measurements — refine them with https://www.lightpollutionmap.info if you want precision.
- Entries flagged `"approx": true` have approximate coordinates.
- Markers are clustered (Leaflet.markercluster, vendored in `vendor/markercluster/`) — clusters show a count and split apart as you zoom.
