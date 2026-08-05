/* Fotos da entrega de chaves do FAJ Realiza.
 *
 * Mesma receita do otimiza-rodeio.js, porque o destino e' o mesmo: o carrossel
 * do modal da galeria. Saem duas coisas:
 *
 *   - a capa do card da galeria, em pe' (800x1100). O recorte vertical come dos
 *     dois lados, entao a capa e' escolhida entre as fotos com o assunto no
 *     meio do quadro;
 *   - o conjunto do modal, mantido em 3:2 em duas larguras: 800px para o
 *     carrossel e 1600px (@2x) para o visor, onde a foto ocupa a tela inteira.
 *
 *   npm install sharp
 *   node scripts/otimiza-chaves.js material/originais-cliente/entrega-de-chaves docs/assets/img
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) {
  console.error('uso: node scripts/otimiza-chaves.js <origem> <destino-img>');
  process.exit(1);
}

// nome do arquivo original -> id usado no main.js
const MAPA = {
  'FAJ-276': 'chave-na-mao',
  'FAJ-378': 'grupo-chave',
  'FAJ-141': 'dupla-pasta-chave',
  'FAJ-201': 'cartao-chave',
  'FAJ-382': 'duas-moradoras-pasta',
  'FAJ-35':  'abraco-painel',
  'FAJ-160': 'sacola-parabens',
  'FAJ-267': 'pasta-conquista',
  'FAJ-73':  'kit-boas-vindas',
};

// a capa do card: a chave em primeiro plano no centro do quadro — e' a que
// aguenta o corte em pe' sem perder o assunto, e diz do que e' a categoria
// antes de qualquer legenda.
const CAPA = 'FAJ-276';
const CAPA_ID = 'chaves';

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
      t += await par(buf, path.join(OUT, 'chaves'), `${id}${sufixo}`);
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
