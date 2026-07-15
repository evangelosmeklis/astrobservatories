# Deep-research prompt for the global observatory dataset

Copy everything below the line into the research agent. Its output must be saved as
`data/observatories.json` (replacing the current file) — the site reads it as-is.

---

You are compiling a dataset of astronomical observatories around the world for an
interactive map website. Your ONLY output must be a single valid JSON file — no
commentary, no markdown fences, no explanations.

## Output format

A single JSON object with one key, `observatories`, holding an array of entries.
Each entry has EXACTLY these fields:

```json
{
  "id": "paranal",
  "name": "Paranal Observatory (VLT)",
  "location": "Cerro Paranal, Atacama Desert, Chile",
  "coords": [-24.6272, -70.4042],
  "altitude_m": 2635,
  "founded": 1999,
  "type": "Research",
  "operator": "European Southern Observatory (ESO)",
  "bortle": 1,
  "telescopes": "Very Large Telescope — four 8.2 m Unit Telescopes plus interferometer",
  "description": "ESO's flagship site in one of the driest places on Earth. The four VLT telescopes can work together as a giant interferometer, and produced the first image of an exoplanet.",
  "history": "Built through the 1990s, with first light in 1998. The nearby Cerro Armazones is now home to ESO's Extremely Large Telescope (39 m), under construction.",
  "website": "https://www.eso.org/public/teles-instr/paranal-observatory/"
}
```

Field rules:
- `id` — unique kebab-case slug, stable and human-readable (e.g. "mauna-kea", "kitt-peak").
- `name` — common English name; put a famous telescope name in parentheses if better known.
- `location` — "site/mountain, region, country" in English.
- `coords` — `[latitude, longitude]` as decimal degrees, 4 decimal places, from a reliable source (official site, Wikipedia coordinates, or observatory databases). If you can only locate the site approximately, add `"approx": true` as an extra field.
- `altitude_m` — integer metres above sea level.
- `founded` — integer year the observatory (not the institution) was established; for multi-telescope sites use the year the site began operating.
- `type` — short label, e.g. "Research", "Radio", "Solar", "Historic / Museum", "University / Educational", "Public / Astrotourism", "Research (multi-observatory site)".
- `operator` — the institution(s) running it.
- `bortle` — integer 1–9, your best estimate of the Bortle dark-sky class of the site's area. Base it on light-pollution atlas data (e.g. lightpollutionmap.info, djlorenz atlas): remote high-altitude deserts ≈ 1, rural mountains ≈ 2–3, near towns ≈ 4–5, suburbs ≈ 6–7, cities ≈ 8–9.
- `telescopes` — one line naming the main instrument(s) with apertures.
- `description` — 1–3 sentences: what it is, what makes it notable, in plain engaging English.
- `history` — 1–3 sentences: founding story and/or the most famous discoveries made there.
- `website` — official URL, or `""` if none exists.

## Scope and coverage

Aim for **150–300 entries** covering, in priority order:
1. All major professional research observatories (optical, radio, solar), worldwide — every site hosting a telescope ≥ 2 m or a major radio instrument.
2. Historically significant observatories, including ones no longer doing research (Greenwich, Paris, Pulkovo, Yerkes, Arecibo…).
3. Notable national/university observatories of countries not covered above — aim for geographic breadth: every continent, and the leading observatory of as many countries as possible.
4. A selection of famous public-outreach/astrotourism observatories and planetarium-observatories with real telescopes.

Do NOT include: planetariums without telescopes, space telescopes, private amateur backyard domes, or defunct sites with nothing left to see (exception: historically famous ones).

## Quality rules

- Verify coordinates against at least one source; wrong-hemisphere or swapped lat/long errors are the worst possible failure. Latitude range −90…90, longitude −180…180.
- No duplicate `id`s. Multi-telescope summits (Mauna Kea, La Palma, Kitt Peak…) are ONE entry each.
- Every fact (founding year, aperture, altitude) must come from a real source — official sites, Wikipedia, IAU/MPC observatory lists. If unsure of a value, prefer omitting the site over inventing data.
- Plain ASCII-safe JSON: escape internal double quotes, no trailing commas, no comments. The file must pass `python3 -m json.tool`.
- Keep descriptions fresh and specific — name the discovery, the instrument, the record. Avoid generic filler like "an important observatory for astronomy".
