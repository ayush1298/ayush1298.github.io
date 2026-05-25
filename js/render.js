import { loadJson, escapeHtml } from "./shared.js";
import { bootPage } from "./layout.js";
import { initVisitorMap } from "./visitor-map.js";

function renderIntro(site) {
  const eyebrow = document.getElementById("intro-eyebrow");
  if (eyebrow) eyebrow.textContent = site.intro.eyebrow || site.tagline || "";

  const name = document.getElementById("intro-name");
  if (name) {
    // Allow a soft accent on a fragment of the name via the JSON `nameDisplay`.
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

  const highlights = document.getElementById("intro-highlights");
  if (highlights) {
    highlights.innerHTML = (site.intro.highlights || [])
      .map(
        (h) =>
          `<div class="facts-row"><dt>${escapeHtml(h.label)}</dt><dd>${escapeHtml(h.value)}</dd></div>`
      )
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

      // Bold the author's own name (Ayush ...) inline.
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
          </article>
        </li>`;
    })
    .join("");
}

async function main() {
  try {
    await bootPage("home", async () => {
      const [site, news, publications, experience] = await Promise.all([
        loadJson("site.json"),
        loadJson("news.json"),
        loadJson("publications.json"),
        loadJson("experience.json"),
      ]);
      renderIntro(site);
      renderNews(news);
      renderPublications(publications);
      renderExperience(experience);
      return site;
    });

    initVisitorMap();
  } catch (err) {
    console.error(err);
    document.querySelector(".content-sheet")?.insertAdjacentHTML(
      "afterbegin",
      `<p role="alert" class="load-error">Could not load content. Run: python3 -m http.server 8080</p>`
    );
  }
}

main();
