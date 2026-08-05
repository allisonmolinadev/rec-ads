/* Fotos do Rodeo Country Bulls + FAJ.
 *
 * Os originais sao 2048x1365 (3:2 deitado, ~2,3 MB cada). Saem duas coisas:
 *
 *   - a capa do card da galeria, que e' em pe' (800x1100). O recorte vertical
 *     come de um lado e do outro, entao a capa e' a unica foto com o assunto
 *     no meio do quadro;
 *   - o conjunto que abre no modal, mantido em 3:2 em duas larguras: 800px
 *     para o carrossel e 1600px (@2x) para o visor, onde a foto ocupa a tela
 *     inteira e o detalhe precisa aguentar o tamanho.
 *
 *   npm install sharp
 *   node scripts/otimiza-rodeio.js material/originais-cliente/rodeio docs/assets/img
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) {
  console.error('uso: node scripts/otimiza-rodeio.js <origem> <destino-img>');
  process.exit(1);
}

// nome do arquivo original -> id usado no main.js
const MAPA = {
  'Evento FAJ Rodeio - 09-07-26-103': 'arena-painel-faj',
  'Evento FAJ Rodeio - 10-07-26-141': 'bandeira-arena',
  'Evento FAJ Rodeio - 09-07-26-113': 'camarote-faj-realiza',
  'Evento FAJ Rodeio - 09-07-26-141': 'camarote-faj-invest',
  'Evento FAJ Rodeio - 09-07-26-27':  'lounge-50-anos',
  'Evento FAJ Rodeio - 08-07-26-168': 'convidados-camarote',
  'Evento FAJ Rodeio - 10-07-26-63':  'chapeu-marcas',
  'Evento FAJ Rodeio - 09-07-26-174': 'panfleto-touro-mecanico',
};

// a capa do card: os dois convidados estao no centro do quadro, e' a unica
// que aguenta o corte em pe' sem perder o assunto.
const CAPA = 'Evento FAJ Rodeio - 08-07-26-168';
const CAPA_ID = 'rodeo-country-bulls';

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
      const buf = await sharp(p).resize({ width: w, kernel: 'lanczos3' }).toBuffer();
      t += await par(buf, path.join(OUT, 'rodeio'), `${id}${sufixo}`);
    }
    depois += t;
    console.log(`  ${id.padEnd(24)} ${Math.round(fs.statSync(p).size / 1024)} KB -> ${Math.round(t / 1024)} KB`);
  }

  const capa = await sharp(path.join(SRC, `${CAPA}.jpg`))
    .resize(800, 1100, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
    .toBuffer();
  const tc = await par(capa, path.join(OUT, 'galeria'), CAPA_ID);
  depois += tc;
  console.log(`\n  capa ${CAPA_ID} (800x1100) -> ${Math.round(tc / 1024)} KB`);

  console.log(`\ntotal: ${Math.round(antes / 1024)} KB -> ${Math.round(depois / 1024)} KB`);
})();
