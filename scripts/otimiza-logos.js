/* Otimiza os logotipos das marcas do grupo:
   apara a margem transparente, normaliza a altura e exporta webp + png. */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
const SHEET = process.argv[4];
fs.mkdirSync(OUT, { recursive: true });

// altura alvo (@2x). Wordmarks muito largos recebem altura menor para nao
// dominarem a parede optica.
const ALTURA = {
  'faj-log': 92, 'faj-invest': 100, concrejota: 108, 'faj-empreendimentos': 104,
  'grupo-faj': 150, utani: 118, 'energy-field': 150,
};

(async () => {
  const itens = [];
  let antes = 0, depois = 0;

  for (const f of fs.readdirSync(SRC).filter((f) => /^logotipo-.*\.png$/i.test(f))) {
    const id = f.replace(/^logotipo-|\.png$/gi, '');
    const p = path.join(SRC, f);
    antes += fs.statSync(p).size;

    const original = await sharp(p).metadata();
    // trim usa o pixel do canto como referencia (transparente aqui)
    const aparado = await sharp(p).trim({ threshold: 5 }).toBuffer();
    const m = await sharp(aparado).metadata();

    // teto de largura alem da altura: sem ele o wordmark 5:1 da FAJ LOG fica
    // opticamente muito maior que os demais
    const h = ALTURA[id] || 110;
    const buf = await sharp(aparado)
      .resize({ width: 400, height: h, fit: 'inside', withoutEnlargement: false, kernel: 'lanczos3' })
      .toBuffer();
    const fim = await sharp(buf).metadata();

    await sharp(buf).webp({ quality: 88, alphaQuality: 100, effort: 6 }).toFile(path.join(OUT, `${id}.webp`));
    await sharp(buf).png({ compressionLevel: 9, palette: true }).toFile(path.join(OUT, `${id}.png`));

    depois += fs.statSync(path.join(OUT, `${id}.webp`)).size + fs.statSync(path.join(OUT, `${id}.png`)).size;
    itens.push({ id, buf, w: fim.width, h: fim.height });

    console.log(`${id.padEnd(22)} ${original.width}x${original.height} -> aparado ${m.width}x${m.height} -> ${fim.width}x${fim.height}  (razao ${(fim.width / fim.height).toFixed(2)})`);
  }

  console.log(`\nantes ${Math.round(antes / 1024)} KB  ->  depois ${Math.round(depois / 1024)} KB`);

  // prova visual: os seis em branco sobre o fundo escuro do site
  if (SHEET) {
    const CW = 1400, RH = 190;
    const linhas = 2, cols = 3;
    const comp = [];
    itens.forEach((it, i) => {
      const cx = (i % cols) * (CW / cols) + (CW / cols) / 2;
      const cy = Math.floor(i / cols) * RH + RH / 2;
      comp.push({ input: it.buf, left: Math.round(cx - it.w / 2), top: Math.round(cy - it.h / 2) });
    });
    await sharp({ create: { width: CW, height: RH * linhas, channels: 4, background: '#100c0a' } })
      .composite(comp).png().toFile(SHEET);
    console.log('prova: ' + SHEET);
  }
})();
