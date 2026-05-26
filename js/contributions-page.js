import { loadJson, renderContributions } from "./shared.js";
import { bootPage } from "./layout.js";

async function main() {
  try {
    await bootPage("contributions", async () => {
      const [site, contributions] = await Promise.all([
        loadJson("site.json"),
        loadJson("contributions.json"),
      ]);
      renderContributions(contributions);
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
