import { loadJson, escapeHtml, renderProjects, renderContributions, renderReading } from "./shared.js";
import { bootPage } from "./layout.js";

// Cached site data to avoid refetching on tab switch
let cachedData = null;

// Number of news items shown before the "Show older" toggle
const NEWS_VISIBLE = 6;

// Author lists longer than this collapse to the first few names plus mine
const AUTHORS_VISIBLE = 3;
const MY_NAME = /^Ayush\b/;

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

async function getSiteData() {
  if (cachedData) return cachedData;
  const [site, news, publications, experience, projects, contributions, reading] = await Promise.all([
    loadJson("site.json"),
    loadJson("news.json"),
    loadJson("publications.json"),
    loadJson("experience.json"),
    loadJson("projects.json"),
    loadJson("contributions.json"),
    loadJson("reading.json"),
  ]);
  cachedData = { site, news, publications, experience, projects, contributions, reading };
  return cachedData;
}

function pageTitle(page) {
  return { projects: "Projects", contributions: "Contributions", reading: "Reading" }[page] || page;
}

// Subpages live at #projects, #contributions and #reading. Any other hash (e.g. #news)
// is a section of the home page.
const SUBPAGES = ["projects", "contributions", "reading"];
let currentPage = null;

function pageFromHash() {
  const hash = location.hash.slice(1);
  return SUBPAGES.includes(hash) ? hash : "home";
}

function urlFor(page) {
  return page === "home" ? location.pathname + location.search : `#${page}`;
}

function renderIntro(site) {
  const name = document.getElementById("intro-name");
  if (name) {
    name.innerHTML = site.intro.nameDisplay || escapeHtml(site.name);
  }

  const paragraphs = document.getElementById("intro-paragraphs");
  if (paragraphs) {
    paragraphs.innerHTML = (site.intro.paragraphs || [])
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join("");
  }

  const cv = document.getElementById("cv-link");
  if (cv && site.cvUrl) cv.href = site.cvUrl;
}

function renderNews(items) {
  const list = document.getElementById("news-list");
  if (!list) return;

  const parseDate = (d) => {
    if (!d) return new Date(0);
    const parts = d.split(" ");
    if (parts.length === 2) {
      const month = MONTHS.indexOf(parts[0].toLowerCase());
      const year = parseInt(parts[1], 10);
      if (month !== -1 && !isNaN(year)) {
        return new Date(year, month);
      }
    }
    return new Date(d);
  };

  const sorted = [...items].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  list.innerHTML = sorted
    .map((item, i) => {
      const text = item.url
        ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.text)}</a>`
        : escapeHtml(item.text);
      return `
        <li class="news-line${i >= NEWS_VISIBLE ? " news-line--older" : ""}">
          <span class="news-date">${escapeHtml(item.date)}</span>
          <span class="news-text">${text}</span>
        </li>`;
    })
    .join("");

  // Older items stay collapsed behind a toggle so the home page leads with recent news
  list.nextElementSibling?.classList.contains("news-toggle") && list.nextElementSibling.remove();
  const older = sorted.length - NEWS_VISIBLE;
  if (older > 0) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "news-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "news-list");
    toggle.textContent = `Show older (${older})`;
    toggle.addEventListener("click", () => {
      const expanded = list.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded", String(expanded));
      toggle.textContent = expanded ? "Show less" : `Show older (${older})`;
    });
    list.after(toggle);
  }
}

function renderAuthors(authors) {
  const names = authors.split(",").map((n) => n.trim()).filter(Boolean);
  const nameHtml = (n) =>
    MY_NAME.test(n) ? `<span class="pub-me">${escapeHtml(n)}</span>` : escapeHtml(n);
  const full = names.map(nameHtml).join(", ");

  if (names.length <= AUTHORS_VISIBLE + 2) return `<p class="pub-authors">${full}</p>`;

  const me = names.findIndex((n) => MY_NAME.test(n));
  let shown = names.slice(0, AUTHORS_VISIBLE).map(nameHtml).join(", ");
  if (me >= AUTHORS_VISIBLE) shown += ` … ${nameHtml(names[me])}`;
  const hidden = names.length - AUTHORS_VISIBLE - (me >= AUTHORS_VISIBLE ? 1 : 0);

  return `
    <p class="pub-authors">
      <span class="pub-authors__short">${shown}</span><span class="pub-authors__full">${full}</span>
      <button type="button" class="pub-authors__toggle" aria-expanded="false"
        data-more="+${hidden} more" data-less="show less">+${hidden} more</button>
    </p>`;
}

// "Accepted" / "Under review" / "Workshop paper" become tags; the rest is the venue name
function parseVenue(venue) {
  const tags = [];
  const rest = [];
  (venue || "").split(",").map((p) => p.trim()).filter(Boolean).forEach((part) => {
    if (/^accepted( at)?$/i.test(part)) tags.push(["accepted", "Accepted"]);
    else if (/^accepted at /i.test(part)) {
      tags.push(["accepted", "Accepted"]);
      rest.push(part.replace(/^accepted at /i, ""));
    } else if (/^under review$/i.test(part)) tags.push(["review", "Under review"]);
    else if (/^workshop( paper)?$/i.test(part)) tags.push(["workshop", "Workshop"]);
    else rest.push(part);
  });
  const order = ["accepted", "review", "workshop"];
  tags.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  return { tags, name: rest.join(", ") };
}

function renderPublications(items) {
  const list = document.getElementById("publications-list");
  if (!list) return;

  list.innerHTML = [...items]
    .sort((a, b) => String(b.year).localeCompare(String(a.year)))
    .map((pub) => {
      const links = (pub.links || [])
        .map(
          (l) =>
            `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
        )
        .join("");

      const venue = parseVenue(pub.venue);
      const tags = venue.tags
        .map(([kind, label]) => `<span class="pub-tag pub-tag--${kind}">${label}</span>`)
        .join("");

      return `
        <li class="pub-item">
          <p class="pub-title">${escapeHtml(pub.title)}</p>
          ${pub.authors ? renderAuthors(pub.authors) : ""}
          <p class="pub-venue">${tags}${venue.name ? `<span class="pub-venue__name">${escapeHtml(venue.name)}</span>` : ""}<span class="pub-year">${escapeHtml(pub.year)}</span></p>
          ${links ? `<div class="pub-links">${links}</div>` : ""}
        </li>`;
    })
    .join("");

  list.querySelectorAll(".pub-authors__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.closest(".pub-authors").classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", String(expanded));
      btn.textContent = expanded ? btn.dataset.less : btn.dataset.more;
    });
  });
}

function renderExperience(items) {
  const list = document.getElementById("experience-list");
  if (!list) return;

  // Oldest first, so the horizontal timeline reads left to right through time
  const monthIndex = (d) => {
    const [mon, year] = String(d || "").trim().split(/\s+/);
    const m = MONTHS.indexOf((mon || "").slice(0, 3).toLowerCase());
    return (parseInt(year, 10) || 0) * 12 + Math.max(m, 0);
  };
  const sorted = [...items].sort((a, b) => monthIndex(a.start) - monthIndex(b.start));

  list.style.setProperty("--exp-cols", 2 * sorted.length + 2);
  list.innerHTML = sorted
    .map((exp, i) => {
      const side = i % 2 === 0 ? "right" : "left";
      const org = exp.organization;
      const orgHtml = exp.url
        ? `<a href="${escapeHtml(exp.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(org)}</a>`
        : escapeHtml(org);

      const bg = exp.logoBg || "#1f3a64";
      const initial = (exp.organization || "?").trim().charAt(0).toUpperCase();
      const logoImg = exp.logoUrl
        ? `<img src="${escapeHtml(exp.logoUrl)}" alt="" loading="lazy"
                 onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'exp-medallion__fallback',textContent:'${escapeHtml(initial)}'}))" />`
        : `<span class="exp-medallion__fallback">${escapeHtml(initial)}</span>`;

      const kindTag =
        exp.kind === "education"
          ? `<span class="exp-kind exp-kind--education">Education</span>`
          : "";

      // Horizontal timeline: two fixed-width half-columns per item plus one spare at
      // each end. Each medallion sits on its own pair; its card is centred on it, two
      // items wide, and alternates above/below the line so neighbours never collide.
      const pos = [
        `--medallion-col: ${2 * i + 2} / span 2`,
        `--card-col: ${2 * i + 1} / span 4`,
        `--card-row: ${i % 2 === 0 ? 1 : 3}`,
      ].join("; ");

      return `
        <li class="exp-item exp-item--${side} exp-item--${i % 2 === 0 ? "top" : "bottom"}" style="${pos}">
          <div class="exp-medallion" style="--medallion-bg: ${bg}" aria-hidden="true">
            ${logoImg}
          </div>
          <article class="exp-card">
            <p class="exp-when">${escapeHtml(exp.start)} — ${escapeHtml(exp.end)}</p>
            <h3 class="exp-role">${escapeHtml(exp.role)}</h3>
            <p class="exp-org">${orgHtml}${kindTag}</p>
            <p class="exp-loc">${escapeHtml(exp.location)}</p>
          </article>
        </li>`;
    })
    .join("");

  setupExperienceScroll(list);
}

// Prev/next buttons for the horizontally scrolling timeline; they grey out at
// either end and hide entirely when everything already fits.
function setupExperienceScroll(list) {
  list.parentElement.querySelector(".exp-nav")?.remove();
  const nav = document.createElement("div");
  nav.className = "exp-nav";
  nav.innerHTML = `
    <button type="button" class="exp-nav__btn" data-dir="-1" aria-label="Scroll timeline left">←</button>
    <button type="button" class="exp-nav__btn" data-dir="1" aria-label="Scroll timeline right">→</button>`;
  list.after(nav);

  const [prev, next] = nav.querySelectorAll("button");
  let startedAtEnd = false;
  const update = () => {
    const max = list.scrollWidth - list.clientWidth;
    // Open on the newest entry (right end) the first time the timeline has a real width;
    // it has none while the home view is hidden behind a subpage.
    if (!startedAtEnd && max > 1) {
      list.scrollLeft = max;
      startedAtEnd = true;
    }
    nav.hidden = max <= 1;
    prev.disabled = list.scrollLeft <= 1;
    next.disabled = list.scrollLeft >= max - 1;
    list.classList.toggle("fade-left", !prev.disabled);
    list.classList.toggle("fade-right", !next.disabled);
  };
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) list.scrollBy({ left: Number(btn.dataset.dir) * list.clientWidth * 0.6, behavior: "smooth" });
  });
  list.addEventListener("scroll", update, { passive: true });
  new ResizeObserver(update).observe(list);
}

async function switchPage(page) {
  // Section links on the home page change the hash too; they only need to scroll
  if (page === currentPage) return;
  currentPage = page;

  try {
    const data = await getSiteData();
    
    // Update page title tag dynamically
    document.title = page === "home"
      ? data.site.name
      : `${pageTitle(page)} · ${data.site.name}`;

    const homeView = document.getElementById("home-view");
    const subpageView = document.getElementById("subpage-view");

    // Clear and set active navigation links in header
    document.querySelectorAll(".header-link, .site-brand").forEach(a => {
      a.removeAttribute("aria-current");
      if (a.getAttribute("data-page") === page) {
        a.setAttribute("aria-current", "page");
      }
    });

    if (page === "home") {
      if (homeView) homeView.style.display = "grid";
      if (subpageView) subpageView.style.display = "none";
    } else {
      if (homeView) homeView.style.display = "none";
      if (subpageView) subpageView.style.display = "block";

      const titleEl = document.getElementById("subpage-title");
      const leadEl = document.getElementById("subpage-lead");
      const contentEl = document.getElementById("subpage-content");

      // Reset content area to trigger transition fade-ins
      if (contentEl) contentEl.innerHTML = "";

      if (page === "projects") {
        if (titleEl) titleEl.textContent = "Projects";
        if (leadEl) leadEl.textContent = "A working notebook of things I've shipped, prototyped, or studied — ML systems, retrieval, and a few side experiments.";
        if (contentEl) {
          const list = document.createElement("ul");
          list.className = "projects-list";
          list.id = "projects-list";
          contentEl.appendChild(list);
          renderProjects(data.projects);
        }
      } else if (page === "contributions") {
        if (titleEl) titleEl.textContent = "Contributions";
        if (leadEl) leadEl.textContent = "Patches, evaluations, and tasks I've added to open-source projects — mostly retrieval and embedding benchmarks.";
        if (contentEl) {
          const root = document.createElement("div");
          root.id = "contributions-root";
          contentEl.appendChild(root);
          renderContributions(data.contributions);
        }
      } else if (page === "reading") {
        if (titleEl) titleEl.textContent = "Reading";
        if (leadEl) leadEl.textContent = "A small library of essays I keep returning to, plus the repos where I write up what I've been reading.";
        if (contentEl) {
          const root = document.createElement("div");
          root.id = "reading-full";
          contentEl.appendChild(root);
          renderReading(data.reading);
        }
      }
    }

    // Returning to a home section (e.g. Back to #news) lands on it; otherwise start at the top
    const section = page === "home" && location.hash && document.getElementById(location.hash.slice(1));
    if (section) section.scrollIntoView();
    else window.scrollTo({ top: 0 });
  } catch (err) {
    console.error(err);
    document.querySelector(".content-sheet, .subpage")?.insertAdjacentHTML(
      "afterbegin",
      `<p role="alert" class="load-error">Could not load content. Try refreshing or running a local server.</p>`
    );
  }
}

async function main() {
  try {
    const data = await getSiteData();
    
    // Boot the layouts
    await bootPage("home", async () => data.site);
    
    renderIntro(data.site);
    renderNews(data.news);
    renderPublications(data.publications);
    renderExperience(data.experience);

    // Page links update the URL so pages can be shared, refreshed and reached with Back.
    // Modified clicks (new tab, etc.) fall through to the browser.
    document.addEventListener("click", (e) => {
      const target = e.target.closest("a[data-page]");
      if (!target || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      const page = target.getAttribute("data-page");
      if (page === currentPage) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      history.pushState(null, "", urlFor(page));
      switchPage(page);
    });

    window.addEventListener("popstate", () => switchPage(pageFromHash()));

    switchPage(pageFromHash());

  } catch (err) {
    console.error(err);
    document.querySelector(".content-sheet")?.insertAdjacentHTML(
      "afterbegin",
      `<p role="alert" class="load-error">Could not load content. Run: python3 -m http.server 8080</p>`
    );
  }
}

main();
