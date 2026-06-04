/**
 * Header (brand + page nav), home sidebar (TOC + icon contacts + now line), footer.
 */
import { escapeHtml, initMobileMenu } from "./shared.js";
import { iconFor } from "./icons.js";

export function renderSiteHeader(site, activePage) {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const pageLinks = (site.pages || [])
    .map((item) => {
      const active = item.page === activePage ? ' aria-current="page"' : "";
      return `<a href="#" data-page="${escapeHtml(item.page)}" class="header-link"${active}>${escapeHtml(item.label)}</a>`;
    })
    .join("");

  mount.innerHTML = `
    <div class="site-header">
      <a class="site-brand" href="#" data-page="home">Ayush Munot</a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="header-menu" aria-label="Toggle menu">
        <span class="nav-toggle__box">
          <span class="nav-toggle__inner"></span>
        </span>
      </button>
      <div class="header-menu" id="header-menu">
        <nav class="header-pages" aria-label="Pages">${pageLinks}</nav>
      </div>
    </div>`;

  initMobileMenu();
}

export function renderHomeSidebar(site) {
  const mount = document.getElementById("home-sidebar");
  if (!mount) return;

  const sectionLinks = (site.homeSections || [])
    .map(
      (s) =>
        `<li><a href="#${escapeHtml(s.id)}" data-section="${escapeHtml(s.id)}">${escapeHtml(s.label)}</a></li>`
    )
    .join("");

  const iconLinks = (site.links || [])
    .map((l) => {
      const external = !l.url.startsWith("mailto:");
      const target = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `
        <li>
          <a class="icon-link" href="${escapeHtml(l.url)}"${target}
             aria-label="${escapeHtml(l.label)}"
             title="${escapeHtml(l.display || l.label)}">
            ${iconFor(l.type)}
            <span class="icon-link__sr">${escapeHtml(l.label)}</span>
          </a>
        </li>`;
    })
    .join("");

  const nowBlock = site.now
    ? `<p class="sidebar-now"><span class="sidebar-now__label">Now</span> ${escapeHtml(site.now)}</p>`
    : "";

  mount.innerHTML = `
    <div class="sidebar-inner">
      <nav class="sidebar-nav" aria-label="On this page">
        <ol>${sectionLinks}</ol>
      </nav>

      <div class="sidebar-block">
        <p class="sidebar-block__label">Elsewhere</p>
        <ul class="icon-row">${iconLinks}</ul>
      </div>

      ${nowBlock}

      <div class="sidebar-foot">
        <p>${escapeHtml(site.location)} <span class="dot">·</span> ${escapeHtml(site.status)}</p>
      </div>
    </div>`;
}

export function renderSiteFooter(site) {
  const mount = document.getElementById("site-footer");
  if (!mount) return;

  mount.innerHTML = `
    <div class="site-footer">
      <p>© ${new Date().getFullYear()} Ayush Munot</p>
      <p>${site.lastUpdated ? `Last updated · ${escapeHtml(site.lastUpdated)}` : ""}</p>
      <p>Set in Fraunces &amp; Inter</p>
    </div>`;
}

export async function bootPage(activePage, loadContent) {
  const site = await loadContent();
  document.title =
    activePage === "home" ? site.name : `${pageTitle(activePage)} · ${site.name}`;

  renderSiteHeader(site, activePage);
  renderSiteFooter(site);

  if (activePage === "home") {
    renderHomeSidebar(site);
    initHomeSectionNav();
  } else {
    // Add a back link on subpages
    const main = document.querySelector(".subpage");
    if (main && !main.querySelector(".subpage-back")) {
      const back = document.createElement("a");
      back.className = "subpage-back";
      back.href = "index.html";
      back.textContent = "Home";
      main.insertBefore(back, main.firstChild);
    }
  }

  return site;
}

function pageTitle(page) {
  return { projects: "Projects", contributions: "Contributions", reading: "Reading" }[page] || page;
}

function initHomeSectionNav() {
  const links = document.querySelectorAll(".sidebar-nav a[data-section]");
  if (!links.length) return;

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle("is-active", a.dataset.section === id));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-25% 0px -60% 0px", threshold: 0 }
  );

  document.querySelectorAll(".home-shell .block[id], .home-shell #visitors").forEach((el) =>
    observer.observe(el)
  );
}
