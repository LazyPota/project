import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyRecursive(srcDir, destDir) {
  if (!(await pathExists(srcDir))) return false;
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
  return true;
}

async function main() {
  const repoDeclarations = path.resolve(__dirname, '..', '..', '..', 'declarations');
  const publicDir = path.resolve(__dirname, '..', 'public');
  const publicDeclarations = path.join(publicDir, 'declarations');

  await fs.mkdir(publicDir, { recursive: true });

  const copied = await copyRecursive(repoDeclarations, publicDeclarations);
  if (!copied) {
    // No declarations yet; this is fine in dev. Leave a hint file once.
    const hintDir = path.join(publicDeclarations);
    await fs.mkdir(hintDir, { recursive: true });
    const hintFile = path.join(hintDir, 'README.txt');
    const hint = 'This folder is populated on dev start if ../../declarations exists. Run "dfx generate aura-backend" at the repo root to create it.';
    try { await fs.writeFile(hintFile, hint, { flag: 'wx' }); } catch {}
  }
}

main().catch((err) => {
  console.warn('sync-declarations failed:', err?.message || err);
});


