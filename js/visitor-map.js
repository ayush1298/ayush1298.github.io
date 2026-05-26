/**
 * Visitor map — dot-grid world map that pins the current reader
 * (geolocated via ipwho.is, with ipapi.co fallback), persists
 * prior visits in localStorage, and seeds a handful of sample
 * cities so the map never looks empty on first load.
 *
 * Highly optimized vanilla JS implementation with no runtime D3 dependencies.
 */

const WIDTH = 1100;
const HEIGHT = 500;
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
    svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // 1. Fetch pre-calculated dots
    const res = await fetch("content/map-dots.json");
    if (!res.ok) throw new Error("Failed to load map-dots.json");
    const landDots = await res.json();

    // 2. Render land grid circles
    const landGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    landGroup.setAttribute("class", "map-land");
    
    let dotsHtml = "";
    for (let i = 0; i < landDots.length; i++) {
      const d = landDots[i];
      dotsHtml += `<circle cx="${d[0]}" cy="${d[1]}" r="${DOT_R}"></circle>`;
    }
    landGroup.innerHTML = dotsHtml;
    svg.appendChild(landGroup);

    // 3. Create visitors group
    const visitorsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    visitorsGroup.setAttribute("class", "map-visitors");
    svg.appendChild(visitorsGroup);

    // Math-based Equirectangular Projection
    const scale = WIDTH / (2 * Math.PI);
    function project([lng, lat]) {
      const lambda = lng * Math.PI / 180;
      const phi = lat * Math.PI / 180;
      const x = WIDTH / 2 + scale * lambda;
      const y = (HEIGHT / 2 + 30) - scale * phi;
      return [x, y];
    }

    function plotPin({ lat, lng }, { you = false } = {}) {
      const p = project([lng, lat]);
      if (!p) return;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", you ? "pin pin--you" : "pin");

      let html = "";
      if (you) {
        html += `<circle class="pin__pulse" cx="${p[0]}" cy="${p[1]}" r="14"></circle>`;
      }
      html += `<circle class="pin__core" cx="${p[0]}" cy="${p[1]}" r="${you ? 4.5 : 3}"></circle>`;
      
      g.innerHTML = html;
      visitorsGroup.appendChild(g);
    }

    // 4. Plot sample + persisted visitors
    const stored = readStored();
    [...SAMPLE_VISITORS, ...stored].forEach((v) => plotPin(v));

    // 5. Pin the current visitor
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
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
