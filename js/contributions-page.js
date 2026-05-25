import { loadJson, renderContributions } from "./shared.js";
import { bootPage } from "./layout.js";

async function main() {
  await bootPage("contributions", async () => {
    const [site, contributions] = await Promise.all([
      loadJson("site.json"),
      loadJson("contributions.json"),
    ]);
    renderContributions(contributions);
    return site;
  });
}

main();
