import { loadJson, escapeHtml, renderProjects, renderContributions, renderReading } from "./shared.js";
import { bootPage } from "./layout.js";

// Cached site data to avoid refetching on tab switch
let cachedData = null;

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

function renderIntro(site) {
  const eyebrow = document.getElementById("intro-eyebrow");
  if (eyebrow) eyebrow.textContent = site.intro.eyebrow || site.tagline || "";

  const name = document.getElementById("intro-name");
  if (name) {
    name.innerHTML = site.intro.nameDisplay || escapeHtml(site.name);
  }

  const tagline = document.getElementById("intro-tagline");
  if (tagline) tagline.textContent = site.intro.headline || "";

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

  list.innerHTML = [...items]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .map((item) => {
      const text = item.url
        ? `<a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.text)}</a>`
        : escapeHtml(item.text);
      return `
        <li class="news-line">
          <span class="news-date">${escapeHtml(item.date)}</span>
          <span class="news-text">${text}</span>
        </li>`;
    })
    .join("");
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

      const authors = (pub.authors || "").replace(
        /(Ayush[^,.;]*)/,
        "<strong>$1</strong>"
      );

      return `
        <li class="pub-item">
          <p class="pub-title">${escapeHtml(pub.title)}</p>
          <p class="pub-authors">${authors}</p>
          <p class="pub-venue">${escapeHtml(pub.venue)}<span class="pub-year">${escapeHtml(pub.year)}</span></p>
          ${links ? `<div class="pub-links">${links}</div>` : ""}
        </li>`;
    })
    .join("");
}

function renderExperience(items) {
  const list = document.getElementById("experience-list");
  if (!list) return;

  list.innerHTML = items
    .map((exp, i) => {
      const side = i % 2 === 0 ? "right" : "left";
      const org = exp.shortOrg || exp.organization;
      const orgHtml = exp.url
        ? `<a href="${escapeHtml(exp.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(org)}</a>`
        : escapeHtml(org);

      const bg = exp.logoBg || "#1f3a64";
      const initial = (exp.shortOrg || exp.organization || "?").trim().charAt(0).toUpperCase();
      const logoImg = exp.logoUrl
        ? `<img src="${escapeHtml(exp.logoUrl)}" alt="" loading="lazy"
                 onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'exp-medallion__fallback',textContent:'${escapeHtml(initial)}'}))" />`
        : `<span class="exp-medallion__fallback">${escapeHtml(initial)}</span>`;

      const kindTag =
        exp.kind === "education"
          ? `<span class="exp-kind exp-kind--education">Education</span>`
          : "";

      const bulletsHtml = (exp.bullets && exp.bullets.length)
        ? `<ul class="exp-bullets">${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";

      return `
        <li class="exp-item exp-item--${side}">
          <div class="exp-medallion" style="--medallion-bg: ${bg}" aria-hidden="true">
            ${logoImg}
          </div>
          <article class="exp-card">
            <p class="exp-when">${escapeHtml(exp.start)} — ${escapeHtml(exp.end)}</p>
            <h3 class="exp-role">${escapeHtml(exp.role)}</h3>
            <p class="exp-org">${orgHtml}${kindTag}</p>
            <p class="exp-loc">${escapeHtml(exp.location)}</p>
            ${bulletsHtml}
          </article>
        </li>`;
    })
    .join("");
}

async function switchPage(page) {
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

    // Scroll smoothly to top on tab switch
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    // Listen to tab clicks and prevent default URL navigation
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-page]");
      if (!target || target.tagName.toLowerCase() === "body") return;

      e.preventDefault();
      const page = target.getAttribute("data-page");
      switchPage(page);
    });

    // Run router on first load (check if redirect requested)
    const redirectPage = sessionStorage.getItem("spa_redirect");
    if (redirectPage) {
      sessionStorage.removeItem("spa_redirect");
      switchPage(redirectPage);
    } else {
      switchPage("home");
    }

  } catch (err) {
    console.error(err);
    document.querySelector(".content-sheet")?.insertAdjacentHTML(
      "afterbegin",
      `<p role="alert" class="load-error">Could not load content. Run: python3 -m http.server 8080</p>`
    );
  }
}

main();
