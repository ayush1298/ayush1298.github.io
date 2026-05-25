import { loadJson, renderProjects } from "./shared.js";
import { bootPage } from "./layout.js";

async function main() {
  await bootPage("projects", async () => {
    const [site, projects] = await Promise.all([
      loadJson("site.json"),
      loadJson("projects.json"),
    ]);
    renderProjects(projects);
    return site;
  });
}

main();
