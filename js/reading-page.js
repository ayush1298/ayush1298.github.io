import { loadJson, renderReading } from "./shared.js";
import { bootPage } from "./layout.js";

async function main() {
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
}

main();
