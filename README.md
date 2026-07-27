# Site institucional — rec.ads

Site estático em HTML, CSS e JavaScript puro. **Não tem build step**: para ver,
basta abrir `index.html` no navegador ou servir a pasta em qualquer hospedagem.

```
index.html
404.html
robots.txt
sitemap.xml
assets/
  css/tokens.css     variáveis de marca (cores, tipografia, espaçamento, movimento)
  css/style.css      estilos
  js/main.js         comportamento + os dados editáveis do site
  logo/              logo em SVG, derivado do manual oficial
  img/equipe/        fotos da equipe otimizadas
  og/recads-og.png   imagem de compartilhamento
scripts/optimize.js  reprocessa as fotos da equipe
docs/                material de origem (manual de marca, fotos originais)
.github/workflows/   publicação no GitHub Pages
```

---

## Onde editar o conteúdo

Tudo que vai mudar com frequência está no topo de `assets/js/main.js`, em
constantes nomeadas. Não é preciso mexer no HTML.

### Cargos da equipe

Todos estão como `Lorem ipsum`, conforme combinado. Em `EQUIPE`, troque só o
campo `cargo`:

```js
{ id: 'allison', nome: 'Allison', cargo: 'Lorem ipsum' },
```

Os nomes vieram dos nomes dos arquivos em `docs/img` (extensão removida). Para
**adicionar** alguém: rode a otimização (abaixo) e acrescente uma linha em `EQUIPE`.

### Galeria de projetos

Em `GALERIA`. Só existe um projeto real — **Rodeo Country Bulls + FAJ**, o único
descrito na copy. Os outros sete são slots marcados com `placeholder: true`, que
o site exibe com a tarja "Em breve".

Para publicar um projeto real:

```js
{
  titulo: 'Nome do projeto',
  cat: 'lancamentos',              // id de CATEGORIAS
  marca: 'FAJ Empreendimentos',
  descricao: 'Descrição curta.',
  objetivo: 'Objetivo da ação.',   // null se não houver
  resultado: null,                 // null se não houver — não preencher no chute
  img: 'assets/img/galeria/nome.jpg',
  placeholder: false,
}
```

Campos em `null` simplesmente não aparecem no modal. Enquanto `img` for `null`,
o card usa o símbolo da marca como arte de fundo.

### Links dos canais

Em `CANAIS`, o campo `url` está `null` em todos. Com `null` o card é uma `<div>`
inerte; assim que receber uma URL vira link com `target="_blank"`.

### Logos das marcas do grupo

Estão como cartões tipográficos em `index.html`, na seção `#marcas`. Quando os
arquivos chegarem, troque

```html
<span class="brand__name">Grupo FAJ</span>
```

por

```html
<img src="assets/img/marcas/grupo-faj.svg" alt="Grupo FAJ" style="max-height:44px">
```

---

## Identidade visual

As cores e o logo saíram do manual em `docs/Identidade Visual - REC•ADS/` e estão
em `assets/css/tokens.css`:

| token | valor | origem |
|---|---|---|
| `--red` | `#d22110` | CMYK 0/95/100/10 |
| `--ink` | `#2d1a0c` | CMYK 0/10/20/95 |

Os valores vêm dos PNGs exportados (sRGB). O PDF, por ser CMYK, renderiza
`#EE3316` / `#34312A` — é diferença de perfil de conversão, não uma segunda
paleta. **Use os tokens.**

### Logo

`assets/logo/` foi vetorizado a partir do PDF do manual:

| arquivo | uso |
|---|---|
| `recads-horizontal.svg` | lockup em cores, fundo claro |
| `recads-horizontal-branco.svg` | fundo escuro (usado no site) |
| `recads-horizontal-mono.svg` | herda a cor via `currentColor` |
| `recads-empilhado.svg` | versão empilhada |
| `recads-simbolo.svg` | só a pílula REC |
| `recads-c.svg` / `-mono` | símbolo C• (manual, pág. 6) |
| `favicon.svg` | C• branco sobre quadrado vermelho |

**Atenção:** o logo é *knockout* — as letras "REC" são furos na pílula, não
formas brancas. É o comportamento oficial (na pág. 5 do manual elas ficam
vermelhas sobre fundo vermelho). Consequência prática: **não aplique o logo
direto sobre foto ou vídeo**, porque a imagem vaza pelas letras. Sobre imagem,
use uma faixa sólida atrás.

A área de proteção do manual é `0.5x` (x = altura da pílula).

### Tipografia

O manual pede Myriad Variable (Adobe, sem licença web) e o briefing liberou
trocar. Sistema em uso, via Google Fonts:

- **Archivo** — títulos. Tem eixo de largura (62–125), usado via `font-stretch`
  para títulos expandidos sem distorcer a fonte.
- **Instrument Sans** — texto corrido.
- **JetBrains Mono** — rótulos, numeração de seção e dados.

---

## Imagens

As fotos da equipe foram reduzidas de **9,7 MB para 1,5 MB** (85% menor):
recorte 4:5, WebP em 1x/2x e JPG de fallback via `<picture>`.

Para reprocessar depois de adicionar fotos em `docs/img`, com Node instalado:

```bash
npm install sharp
node scripts/optimize.js docs/img assets/img/equipe
```

O nome do arquivo vira o nome exibido, então **nomeie os arquivos com o nome da
pessoa** (`Maria Eduarda.jpg` → "Maria Eduarda").

---

## Acessibilidade e desempenho

- Navegação por teclado em todo o site; foco preso dentro do modal, `Esc` fecha.
- `prefers-reduced-motion` desliga animações de scroll, marquee, contadores e
  o pulso do ponto REC.
- Imagens com `loading="lazy"`, `width`/`height` declarados (sem *layout shift*).
- Sem dependências de JavaScript: nenhuma biblioteca externa.

---

## Publicação

Há um workflow em `.github/workflows/pages.yml` que publica no GitHub Pages a
cada push na `main`. **Ele só entra em vigor depois de habilitar o Pages** em
*Settings › Pages › Source: GitHub Actions*; antes disso o job falha no passo de
deploy, o que é esperado.

O workflow **não publica o repositório inteiro** — monta um pacote só com
`index.html`, `404.html`, `robots.txt`, `sitemap.xml` e `assets/`. A pasta
`docs/` fica de fora de propósito: contém o manual de marca em PDF e as fotos
originais em alta, que não devem ir para um servidor público.

Para qualquer outra hospedagem, basta subir esses mesmos arquivos — não há build.

### Domínio

As meta tags, o `robots.txt` e o `sitemap.xml` estão com `https://recads.com.br/`
como **suposição minha**, porque o domínio final ainda não foi definido. Ao
fechar o domínio, atualizar nos três lugares:

- `index.html` — `og:url` e `<link rel="canonical">`
- `robots.txt` — linha `Sitemap:`
- `sitemap.xml` — `<loc>`

Enquanto estiver numa URL de projeto do Pages (`usuario.github.io/rec-ads/`),
o site funciona: todos os caminhos internos são relativos, inclusive os do 404.

---

## Pendências (dependem de material do cliente)

- [ ] Cargos reais da equipe (hoje `Lorem ipsum`)
- [ ] Arquivos de logo das 6 marcas do grupo
- [ ] URLs dos canais (Instagram, YouTube, LinkedIn, TikTok, sites)
- [ ] Fotos e vídeos dos projetos da galeria
- [ ] Domínio final (ver acima)
