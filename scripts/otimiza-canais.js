/* Artes dos cards de "Canais" (redes sociais).
 *
 * Os originais sao lockups de logo centralizados num quadro 1280x1080, cada um
 * no fundo da propria marca. O card e' 5:4, entao o cover corta so' uma faixa
 * de altura e o logo continua inteiro e centralizado.
 *
 *   npm install sharp
 *   node scripts/otimiza-canais.js material/originais-cliente/canais docs/assets/img/canais
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) {
  console.error('uso: node scripts/otimiza-canais.js <origem> <destino>');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

// nome do arquivo original -> id usado no main.js (mesmo id de assets/img/marcas/)
const MAPA = {
  'Grupo FAJ': 'grupo-faj',
  'FAJ Empreendimentos': 'faj-empreendimentos',
  'FAJ Invest': 'faj-invest',
  'Utani': 'utani',
  'Energy Field': 'energy-field',
};

const LARGURA = 900;                                  // card ~430px; 900 cobre 2x
const ALTURA = Math.round(LARGURA * 4 / 5);           // 5:4, igual ao .canal

(async () => {
  let antes = 0, depois = 0;
  for (const [arquivo, id] of Object.entries(MAPA)) {
    const p = path.join(SRC, `${arquivo}.jpg`);
    if (!fs.existsSync(p)) { console.log(`  ${arquivo}: nao encontrado, pulando`); continue; }
    antes += fs.statSync(p).size;

    const buf = await sharp(p)
      .resize(LARGURA, ALTURA, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
      .toBuffer();

    await sharp(buf).webp({ quality: 78, effort: 6 }).toFile(path.join(OUT, `${id}.webp`));
    await sharp(buf).jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${id}.jpg`));

    const t = fs.statSync(path.join(OUT, `${id}.webp`)).size + fs.statSync(path.join(OUT, `${id}.jpg`)).size;
    depois += t;
    console.log(`  ${arquivo.padEnd(20)} -> ${id.padEnd(20)} ${Math.round(fs.statSync(p).size / 1024)} KB -> ${Math.round(t / 1024)} KB`);
  }
  console.log(`\ntotal: ${Math.round(antes / 1024)} KB -> ${Math.round(depois / 1024)} KB`);
})();
