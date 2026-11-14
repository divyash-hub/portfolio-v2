// Turns the original screenshots in assets-source/ into optimised WebP files
// in public/images/projects/<project-slug>/.
//
// Naming rule: "<project-slug>-<name>.png"  ->  public/images/projects/<project-slug>/<name>.webp
// (plus a smaller "<name>-800.webp" for cards and phones).
//
// Run with:  npm run images
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-source";
const OUT = "public/images/projects";
const SLUGS = ["helios", "coreframe", "royal-wedding-planners", "ayush-raj", "digital-electronic-dice"];

for (const file of await readdir(SRC)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const slug = SLUGS.find((s) => file.startsWith(s + "-"));
  if (!slug) {
    console.warn("skipped (name does not start with a project slug):", file);
    continue;
  }
  const name = file.slice(slug.length + 1).replace(/\.\w+$/, "");
  const dir = path.join(OUT, slug);
  await mkdir(dir, { recursive: true });
  const input = path.join(SRC, file);
  await sharp(input).resize({ width: 1440, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(dir, name + ".webp"));
  await sharp(input).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(dir, name + "-800.webp"));
  console.log("ok", slug + "/" + name);
}
