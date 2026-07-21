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
      <a class="site-brand" href="#" data-page="home"></a>
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="header-menu" aria-label="Toggle menu">
        <span class="nav-toggle__box">
          <span class="nav-toggle__inner"></span>
        </span>
      </button>
      <div class="header-menu" id="header-menu">
        <nav class="header-pages" aria-label="Pages">${pageLinks}</nav>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
          <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
          <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          <svg class="aurora-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16c2.2-7 4.8-7 7-1 2.2-8 5-8 9-4"/><path d="M5 20h14"/></svg>
        </button>
      </div>
    </div>`;

  initMobileMenu();

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "aurora";
      const next = { aurora: "light", light: "dark", dark: "aurora" }[current] || "aurora";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);

      // Dynamically reload the map script if on the homepage
      const mapContainer = document.getElementById("map-container");
      if (mapContainer) {
        mapContainer.innerHTML = "";
        const mapPalette = {
          light: { ocean: "f6f8fc", land: "dfe7f5", marker: "3c5cff", text: "172033" },
          dark: { ocean: "0b1020", land: "24314b", marker: "8ca6ff", text: "f2f5fb" },
          aurora: { ocean: "091426", land: "163a54", marker: "57e6c2", text: "eaf7ff" },
        }[next];

        let width = Math.round(mapContainer.getBoundingClientRect().width) || 600;
        width = width - 24;
        if (width < 280) width = 280;
        if (width > 680) width = 680;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "mapmyvisitors";
        script.src = `https://mapmyvisitors.com/map.js?cl=${mapPalette.land}&w=${width}&t=tt&d=UozTdHdb3WU-yTGa9a5rIt-U1u8z_sS9tYrDAXk4HGw&co=${mapPalette.ocean}&cmo=${mapPalette.marker}&cmn=ff5353&ct=${mapPalette.text}`;
        mapContainer.appendChild(script);
      }
    });
  }
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
        <ul class="icon-row">${iconLinks}</ul>
      </div>

      ${nowBlock}
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
