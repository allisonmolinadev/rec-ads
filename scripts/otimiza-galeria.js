/* Fotos de um projeto da galeria, prontas para o carrossel do modal.
 *
 * Generico: recebe um JSON com o de-para de nomes e a capa, em vez de ter uma
 * copia do script por projeto (havia tres quase identicas — rodeio, chaves e
 * lancamentos — e ainda faltavam quatro categorias).
 *
 * Saem duas coisas:
 *   - a capa do card, em pe' (800x1100). O corte vertical come dos dois lados,
 *     entao a capa e' escolhida entre as fotos com o assunto no meio do quadro;
 *   - o conjunto do modal em 3:2, em 800px para o carrossel e 1600px (@2x) para
 *     o visor. withoutEnlargement trava o @2x: original menor que 1600 nao e'
 *     esticado, o que so' geraria um arquivo maior e mais borrado.
 *
 * Todo processamento comeca por .rotate(), que aplica a orientacao do EXIF.
 * Foto de celular costuma vir com os pixels deitados e a orientacao so' na
 * etiqueta: sem isso ela sai de lado no site, porque o resize descarta o EXIF.
 *
 *   node scripts/otimiza-galeria.js <config.json>
 *
 * Formato do config:
 *   {
 *     "origem": "material/originais-cliente/bastidores",
 *     "destino": "docs/assets/img",
 *     "pasta": "bastidores",          // subpasta de destino e prefixo do id
 *     "capa": { "arquivo": "FOTO_1", "id": "bastidores" },
 *     "ext": ".JPG",                  // opcional, padrao .jpg
 *     "fotos": { "FOTO_1": "id-da-foto", "FOTO_2.jpeg": "outro-id" }
 *   }
 *
 * A chave pode trazer a propria extensao — util quando o lote vem com
 * extensoes misturadas (.JPG da camera, .jpeg do celular).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CONFIG = process.argv[2];
if (!CONFIG) {
  console.error('uso: node scripts/otimiza-galeria.js <config.json>');
  process.exit(1);
}
const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
// a chave do config pode ja' vir com extensao; se nao vier, usa a do lote
const arquivoDe = (nome) => (/\.[a-z]+$/i.test(nome) ? nome : nome + (cfg.ext || '.jpg'));

const par = async (buf, dir, id) => {
  fs.mkdirSync(dir, { recursive: true });
  await sharp(buf).webp({ quality: 76, effort: 6 }).toFile(path.join(dir, `${id}.webp`));
  await sharp(buf).jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(path.join(dir, `${id}.jpg`));
  return fs.statSync(path.join(dir, `${id}.webp`)).size + fs.statSync(path.join(dir, `${id}.jpg`)).size;
};

(async () => {
  let antes = 0, depois = 0;

  for (const [arquivo, id] of Object.entries(cfg.fotos)) {
    const p = path.join(cfg.origem, arquivoDe(arquivo));
    if (!fs.existsSync(p)) { console.log(`  ${arquivo}: nao encontrado, pulando`); continue; }
    antes += fs.statSync(p).size;

    let t = 0;
    for (const [sufixo, w] of [['', 800], ['@2x', 1600]]) {
      const buf = await sharp(p)
        .rotate()
        .resize({ width: w, kernel: 'lanczos3', withoutEnlargement: true })
        .toBuffer();
      t += await par(buf, path.join(cfg.destino, cfg.pasta), `${id}${sufixo}`);
    }
    depois += t;
    console.log(`  ${id.padEnd(22)} ${Math.round(fs.statSync(p).size / 1024)} KB -> ${Math.round(t / 1024)} KB`);
  }

  if (cfg.capa) {
    const capa = await sharp(path.join(cfg.origem, arquivoDe(cfg.capa.arquivo)))
      .rotate()
      .resize(800, 1100, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
      .toBuffer();
    const tc = await par(capa, path.join(cfg.destino, 'galeria'), cfg.capa.id);
    depois += tc;
    console.log(`\n  capa ${cfg.capa.id} (800x1100) -> ${Math.round(tc / 1024)} KB`);
  }

  console.log(`\ntotal: ${Math.round(antes / 1024)} KB -> ${Math.round(depois / 1024)} KB`);
})();
