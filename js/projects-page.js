import { loadJson, renderProjects } from "./shared.js";
import { bootPage } from "./layout.js";

async function main() {
  try {
    await bootPage("projects", async () => {
      const [site, projects] = await Promise.all([
        loadJson("site.json"),
        loadJson("projects.json"),
      ]);
      renderProjects(projects);
      return site;
    });
  } catch (err) {
    console.error(err);
    document.querySelector(".subpage")?.insertAdjacentHTML(
      "afterbegin",
      `<p role="alert" class="load-error">Could not load content. Try refreshing or run: python3 -m http.server 8080</p>`
    );
  }
}

main();
