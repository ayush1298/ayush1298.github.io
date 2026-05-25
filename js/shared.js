/**
 * Shared data loading and content renderers.
 */

export const CONTENT_BASE = "content";

export async function loadJson(path) {
  const res = await fetch(`${CONTENT_BASE}/${path}`);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

export function escapeHtml(str) {
  if (str == null) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

export function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("header-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });
}

export function renderContributions(data, rootId = "contributions-root") {
  const root = document.getElementById(rootId);
  if (!root) return;

  root.innerHTML = (data.blocks || [])
    .map((block) => {
      const prs = (block.prs || [])
        .map(
          (pr) => `
          <li class="pr-item">
            <a class="pr-title" href="${escapeHtml(pr.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(pr.title)}</a>
            <span class="pr-meta">${escapeHtml(pr.date)}</span>
            ${pr.summary ? `<p class="pr-summary">${escapeHtml(pr.summary)}</p>` : ""}
          </li>`
        )
        .join("");

      return `
        <article class="contrib-block">
          <div class="contrib-head">
            <h2 class="contrib-name"><a href="${escapeHtml(block.projectUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(block.name)}</a></h2>
            <span class="contrib-role">${escapeHtml(block.role)}</span>
          </div>
          <p class="contrib-desc">${escapeHtml(block.description)}</p>
          <ul class="pr-list">${prs}</ul>
        </article>`;
    })
    .join("");
}

export function renderReading(data) {
  const fullEl = document.getElementById("reading-full");
  if (!fullEl) return;

  const reposHtml = (data.repos || [])
    .map(
      (r) => `
      <article class="repo-card">
        <h3><a href="${escapeHtml(r.repoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.title)}</a></h3>
        <p>${escapeHtml(r.description)}</p>
        <div class="repo-links">
          <a href="${escapeHtml(r.repoUrl)}" target="_blank" rel="noopener noreferrer">GitHub</a>
          ${r.liveUrl ? `<a href="${escapeHtml(r.liveUrl)}" target="_blank" rel="noopener noreferrer">Live site</a>` : ""}
        </div>
      </article>`
    )
    .join("");

  fullEl.innerHTML = `
    <div class="reading-block">
      <h2 class="reading-label">Blog &amp; interview repos</h2>
      <div class="repo-grid">${reposHtml}</div>
    </div>
    <div class="reading-block">
      <h2 class="reading-label">Articles by others</h2>
      <ul class="read-list read-list--full">${(data.articles || [])
        .map((a) => {
          const title = `<a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.title)}</a>`;
          return `
            <li class="read-item">
              <p class="read-line">${title}</p>
              <p class="read-meta">${escapeHtml(a.author)} · ${escapeHtml(a.year)}</p>
              ${a.note ? `<p class="read-note">${escapeHtml(a.note)}</p>` : ""}
            </li>`;
        })
        .join("")}</ul>
    </div>`;
}

function projectCard(project, featured = false) {
  const links = (project.links || [])
    .map(
      (l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`
    )
    .join("");

  const tags = (project.tags || [])
    .map((t) => `<span>${escapeHtml(t)}</span>`)
    .join("");

  return `
    <li class="project-card${featured ? " project-card--featured" : ""}">
      <span class="project-year">${escapeHtml(project.year)}</span>
      <div class="project-body">
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        ${project.role ? `<p class="project-role">${escapeHtml(project.role)}</p>` : ""}
        <p class="project-desc">${escapeHtml(project.description)}</p>
        ${tags ? `<div class="project-tags">${tags}</div>` : ""}
        ${links ? `<div class="project-links">${links}</div>` : ""}
      </div>
    </li>`;
}

export function renderProjects(items) {
  const featuredEl = document.getElementById("projects-featured");
  const listEl = document.getElementById("projects-list");
  if (!listEl) return;

  if (featuredEl) featuredEl.hidden = true;

  listEl.innerHTML = [...items]
    .sort((a, b) => String(b.year).localeCompare(String(a.year)))
    .map((p) => projectCard(p))
    .join("");
}
