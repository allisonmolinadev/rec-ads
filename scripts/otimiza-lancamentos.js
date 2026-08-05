/* Fotos da noite de lançamento (SOHO Business / Nápoles / FAJ).
 *
 * Mesma receita das outras galerias, com uma diferença: estes originais tem
 * 1200x800, e nao os ~2000px dos outros lotes. Por isso o @2x pede
 * withoutEnlargement — sem isso o sharp esticaria a foto ate' 1600 e o visor
 * mostraria uma imagem inventada, mais pesada e mais borrada que a original.
 *
 *   npm install sharp
 *   node scripts/otimiza-lancamentos.js material/originais-cliente/lancamentos docs/assets/img
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) {
  console.error('uso: node scripts/otimiza-lancamentos.js <origem> <destino-img>');
  process.exit(1);
}

// nome do arquivo original -> id usado no main.js, na ordem do carrossel
const MAPA = {
  'IMG_7390': 'palco-lancamento',
  'IMG_7437': 'anuncio-2026',
  'IMG_7322': 'abertura-palco',
  'IMG_6782': 'entrevista-risos',
  'IMG_6726': 'entrevista-convidada',
  'IMG_6704': 'entrevista-microfone',
  'IMG_6830': 'entrevista-palco',
  'IMG_7188': 'convidados-soho',
  'IMG_6728': 'camera-entrevista',
  'IMG_6793': 'camera-close',
  'IMG_6887': 'monitor-captacao',
  'IMG_6750': 'celular-registro',
  'IMG_7271': 'operacao-bastidor',
  'IMG_6879': 'quarteto-cordas',
  'IMG_7228': 'violinos',
  'IMG_6758': 'arte-iluminada',
  'IMG_6773': 'obra-azul',
  'IMG_7543': 'convidados-mesa',
};

// a capa do card: o palco com os feixes de luz. E' a que sobrevive ao corte em
// pe' sem depender de texto legivel — le como "evento de lancamento" no
// tamanho de card, que e' o trabalho da capa.
const CAPA = 'IMG_7390';
const CAPA_ID = 'lancamentos';

const par = async (buf, dir, id) => {
  fs.mkdirSync(dir, { recursive: true });
  await sharp(buf).webp({ quality: 76, effort: 6 }).toFile(path.join(dir, `${id}.webp`));
  await sharp(buf).jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(dir, `${id}.jpg`));
  return fs.statSync(path.join(dir, `${id}.webp`)).size + fs.statSync(path.join(dir, `${id}.jpg`)).size;
};

(async () => {
  let antes = 0, depois = 0;

  for (const [arquivo, id] of Object.entries(MAPA)) {
    const p = path.join(SRC, `${arquivo}.jpg`);
    if (!fs.existsSync(p)) { console.log(`  ${arquivo}: nao encontrado, pulando`); continue; }
    antes += fs.statSync(p).size;

    let t = 0;
    for (const [sufixo, w] of [['', 800], ['@2x', 1600]]) {
      const buf = await sharp(p)
        .resize({ width: w, kernel: 'lanczos3', withoutEnlargement: true })
        .toBuffer();
      t += await par(buf, path.join(OUT, 'lancamentos'), `${id}${sufixo}`);
    }
    depois += t;
    console.log(`  ${id.padEnd(22)} ${Math.round(fs.statSync(p).size / 1024)} KB -> ${Math.round(t / 1024)} KB`);
  }

  const capa = await sharp(path.join(SRC, `${CAPA}.jpg`))
    .resize(800, 1100, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
    .toBuffer();
  const tc = await par(capa, path.join(OUT, 'galeria'), CAPA_ID);
  depois += tc;
  console.log(`\n  capa ${CAPA_ID} (800x1100) -> ${Math.round(tc / 1024)} KB`);

  console.log(`\ntotal: ${Math.round(antes / 1024)} KB -> ${Math.round(depois / 1024)} KB`);
})();
