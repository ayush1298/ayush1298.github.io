/**
 * Visitor map — dot-grid world map that pins the current reader
 * (geolocated via ipwho.is, with ipapi.co fallback), persists
 * prior visits in localStorage, and seeds a handful of sample
 * cities so the map never looks empty on first load.
 *
 * Renderer: d3-geo + topojson-client + world-atlas (all via esm.sh / jsdelivr).
 */

const WIDTH = 1100;
const HEIGHT = 500;
const GRID_X = 130;   // longitude samples
const GRID_Y = 60;    // latitude samples
const DOT_R  = 0.95;
const STORAGE_KEY = "am.visitors.v1";

const SAMPLE_VISITORS = [
  { lat: 22.5726, lng: 88.3639,  city: "Kolkata",       country: "IN" },
  { lat: 19.0760, lng: 72.8777,  city: "Mumbai",        country: "IN" },
  { lat: 12.9716, lng: 77.5946,  city: "Bengaluru",     country: "IN" },
  { lat: 37.7749, lng: -122.4194, city: "San Francisco", country: "US" },
  { lat: 40.7128, lng: -74.0060,  city: "New York",      country: "US" },
  { lat: 51.5074, lng: -0.1278,   city: "London",        country: "GB" },
  { lat: 52.5200, lng: 13.4050,   city: "Berlin",        country: "DE" },
  { lat: 35.6762, lng: 139.6503,  city: "Tokyo",         country: "JP" },
  { lat: 1.3521,  lng: 103.8198,  city: "Singapore",     country: "SG" },
  { lat: -33.8688, lng: 151.2093, city: "Sydney",        country: "AU" },
  { lat: -23.5505, lng: -46.6333, city: "São Paulo",     country: "BR" },
  { lat: 55.7558, lng: 37.6173,   city: "Moscow",        country: "RU" },
  { lat: 30.0444, lng: 31.2357,   city: "Cairo",         country: "EG" },
  { lat: -1.2921, lng: 36.8219,   city: "Nairobi",       country: "KE" },
  { lat: 25.2048, lng: 55.2708,   city: "Dubai",         country: "AE" },
];

let booted = false;

export async function initVisitorMap() {
  if (booted) return;
  booted = true;

  const svg = document.getElementById("world-map");
  const caption = document.getElementById("visitor-caption");
  if (!svg) return;

  try {
    // 1. Pull dependencies + world topology in parallel
    const [selectionMod, geoMod, topoMod, worldRes] = await Promise.all([
      import("https://esm.sh/d3-selection@3"),
      import("https://esm.sh/d3-geo@3"),
      import("https://esm.sh/topojson-client@3"),
      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    ]);

    const { select } = selectionMod;
    const { geoEquirectangular, geoContains } = geoMod;
    const { feature } = topoMod;
    const world = await worldRes.json();
    const land = feature(world, world.objects.countries);

    const projection = geoEquirectangular()
      .scale(WIDTH / (2 * Math.PI))
      .translate([WIDTH / 2, HEIGHT / 2 + 30]);

    const svgSel = select(svg)
      .attr("viewBox", `0 0 ${WIDTH} ${HEIGHT}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // 2. Build land dot grid by sampling lat/lng cells through countries
    const landDots = [];
    for (let xi = 0; xi < GRID_X; xi++) {
      const lng = -180 + (xi + 0.5) * (360 / GRID_X);
      for (let yi = 0; yi < GRID_Y; yi++) {
        const lat = 90 - (yi + 0.5) * (180 / GRID_Y);
        if (lat > 83 || lat < -60) continue; // skip the polar caps
        if (geoContains(land, [lng, lat])) {
          const p = projection([lng, lat]);
          if (p) landDots.push(p);
        }
      }
    }

    svgSel
      .append("g")
      .attr("class", "map-land")
      .selectAll("circle")
      .data(landDots)
      .join("circle")
      .attr("cx", (d) => d[0])
      .attr("cy", (d) => d[1])
      .attr("r", DOT_R);

    const visitorsLayer = svgSel.append("g").attr("class", "map-visitors");

    function plotPin({ lat, lng }, { you = false } = {}) {
      const p = projection([lng, lat]);
      if (!p) return;
      const g = visitorsLayer
        .append("g")
        .attr("class", you ? "pin pin--you" : "pin");
      if (you) {
        g.append("circle").attr("class", "pin__pulse").attr("cx", p[0]).attr("cy", p[1]).attr("r", 14);
      }
      g.append("circle").attr("class", "pin__core").attr("cx", p[0]).attr("cy", p[1]).attr("r", you ? 4.5 : 3);
    }

    // 3. Plot sample + persisted visitors
    const stored = readStored();
    [...SAMPLE_VISITORS, ...stored].forEach((v) => plotPin(v));

    // 4. Pin the current visitor — try ipwho.is first, fall back to ipapi.co
    const me = await locateVisitor();

    if (me) {
      plotPin(me, { you: true });
      if (caption) {
        const where = `${escapeText(me.city)}${me.country ? ", " + escapeText(me.country) : ""}`;
        caption.innerHTML = `Saying hi to <strong>${where}</strong>. You're now a fresh pin on the map — every reader leaves one.`;
      }
      writeStored([...stored, { ...me, ts: Date.now() }].slice(-200));
    } else if (caption) {
      caption.textContent =
        "Hello from somewhere on Earth — couldn't geolocate your IP (private network or blocker).";
    }
  } catch (err) {
    console.warn("Visitor map failed to render", err);
    if (caption) {
      caption.textContent =
        "The map couldn't load right now — offline mode or the CDN is unreachable.";
    }
  }
}

async function locateVisitor() {
  // Provider 1: ipwho.is — no key, generous rate limits, returns latitude/longitude
  try {
    const r = await fetch("https://ipwho.is/", { cache: "no-store" });
    if (r.ok) {
      const d = await r.json();
      if (d.success !== false && typeof d.latitude === "number") {
        return {
          lat: d.latitude,
          lng: d.longitude,
          city: d.city || "somewhere",
          country: d.country_code || d.country || "",
        };
      }
    }
  } catch {
    /* fall through */
  }

  // Provider 2: ipapi.co — fallback
  try {
    const r = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (r.ok) {
      const d = await r.json();
      if (typeof d.latitude === "number") {
        return {
          lat: d.latitude,
          lng: d.longitude,
          city: d.city || "somewhere",
          country: d.country_code || d.country_name || "",
        };
      }
    }
  } catch {
    /* swallow */
  }
  return null;
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStored(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    /* private mode etc — ignore */
  }
}

function escapeText(s) {
  const d = document.createElement("div");
  d.textContent = String(s);
  return d.innerHTML;
}
