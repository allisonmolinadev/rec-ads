/* Fotos dos cards de "O que fazemos".
 *
 * Os originais vem em paisagem 2200x1200, com a pessoa na esquerda e o resto do
 * quadro so' fundo claro. Os cards sao estreitos e altos, entao um cover do
 * quadro inteiro mostraria o fundo e cortaria a pessoa. Aqui o recorte e' feito
 * antes: fica a faixa da esquerda, que ja' e' retrato e ja' e' escura.
 *
 *   npm install sharp
 *   node scripts/recorta-servicos.js material/originais-cliente/servicos docs/assets/img/servicos
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = process.argv[2];
const OUT = process.argv[3];
if (!SRC || !OUT) {
  console.error('uso: node scripts/recorta-servicos.js <origem> <destino>');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

// nome do arquivo original -> id usado no HTML
const MAPA = {
  'Brand': 'estrategia-branding',
  'Performance': 'performance-midia',
  'Social': 'conteudo-social',
  'Audiovisual': 'audiovisual-eventos',
  'Tech': 'tecnologia-ia',
  'Web': 'web-crm',
};

const FATIA = 0.46;   // fracao da largura, a partir da esquerda
const LARGURA = 800;  // o card mais aberto tem ~500px; 800 cobre telas 1.5x

(async () => {
  let antes = 0, depois = 0;
  for (const [arquivo, id] of Object.entries(MAPA)) {
    const p = path.join(SRC, `${arquivo}.jpg`);
    if (!fs.existsSync(p)) { console.log(`  ${arquivo}: nao encontrado, pulando`); continue; }
    antes += fs.statSync(p).size;

    const m = await sharp(p).metadata();
    const buf = await sharp(p)
      .extract({ left: 0, top: 0, width: Math.round(m.width * FATIA), height: m.height })
      .resize({ width: LARGURA, kernel: 'lanczos3' })
      .toBuffer();

    await sharp(buf).webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, `${id}.webp`));
    await sharp(buf).jpeg({ quality: 76, mozjpeg: true, progressive: true }).toFile(path.join(OUT, `${id}.jpg`));

    const t = fs.statSync(path.join(OUT, `${id}.webp`)).size + fs.statSync(path.join(OUT, `${id}.jpg`)).size;
    depois += t;
    console.log(`  ${arquivo.padEnd(12)} -> ${id.padEnd(20)} ${Math.round(fs.statSync(p).size / 1024)} KB -> ${Math.round(t / 1024)} KB`);
  }
  console.log(`\ntotal: ${Math.round(antes / 1024)} KB -> ${Math.round(depois / 1024)} KB`);
  console.log('se a altura do recorte mudar, ajuste width/height dos <img> em docs/index.html');
})();
