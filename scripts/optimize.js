const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
const dst = process.argv[3];
fs.mkdirSync(dst, { recursive: true });

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

(async () => {
  const files = fs.readdirSync(src).filter(f => /\.(jpe?g|png)$/i.test(f)).sort();
  const manifest = [];
  let before = 0, after = 0;

  for (const f of files) {
    const nome = path.parse(f).name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
    const id = slug(nome);
    const inPath = path.join(src, f);
    before += fs.statSync(inPath).size;

    const meta = await sharp(inPath).metadata();

    // 4:5 retrato, 2 densidades
    for (const [suffix, w] of [['', 640], ['@2x', 1280]]) {
      const h = Math.round(w * 5 / 4);
      const base = sharp(inPath).rotate().resize(w, h, { fit: 'cover', position: 'top' });
      const webp = path.join(dst, `${id}${suffix}.webp`);
      await base.clone().webp({ quality: 74, effort: 6 }).toFile(webp);
      after += fs.statSync(webp).size;
      if (suffix === '') {
        const jpg = path.join(dst, `${id}.jpg`);
        await base.clone().jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(jpg);
        after += fs.statSync(jpg).size;
      }
    }
    manifest.push({ id, nome, original: f, origem: `${meta.width}x${meta.height}` });
    console.log(`${f.padEnd(24)} ${meta.width}x${meta.height}  ->  ${id}.webp / ${id}@2x.webp / ${id}.jpg   nome="${nome}"`);
  }

  fs.writeFileSync(path.join(dst, 'equipe.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n${files.length} fotos | antes ${(before / 1048576).toFixed(1)} MB -> depois ${(after / 1048576).toFixed(1)} MB (${Math.round(100 - after / before * 100)}% menor)`);
})();
