import { loadJson, renderReading } from "./shared.js";
import { bootPage } from "./layout.js";

async function main() {
  try {
    await bootPage("reading", async () => {
      const [site, reading] = await Promise.all([
        loadJson("site.json"),
        loadJson("reading.json"),
      ]);

      const intro = document.getElementById("reading-intro");
      if (intro) intro.textContent = reading.intro || "";

      renderReading(reading);
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
