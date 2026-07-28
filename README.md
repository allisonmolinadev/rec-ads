# Site institucional — rec.ads

Site estático em HTML, CSS e JavaScript puro. **Não tem build step**: para ver,
basta abrir `docs/index.html` no navegador ou servir a pasta `docs/` em qualquer
hospedagem.

**`docs/` é a raiz do site publicado.** Tudo que está lá dentro vai para o ar;
tudo que está fora, não.

```
docs/                    <- o site (raiz de publicação)
  index.html
  404.html
  robots.txt
  sitemap.xml
  .nojekyll              desliga o Jekyll do GitHub Pages
  assets/
    css/tokens.css       variáveis de marca (cores, tipografia, espaçamento, movimento)
    css/style.css        estilos
    js/main.js           comportamento + os dados editáveis do site
    logo/                logo em SVG, derivado do manual oficial
    img/equipe/          fotos da equipe otimizadas
    og/recads-og.png     imagem de compartilhamento

material/                <- FORA do Git (ver .gitignore). Manual de marca,
                            fotos originais em alta e logos do cliente. Existe
                            só na máquina. Não versionar, não mover para docs/.
scripts/optimize.js      reprocessa as fotos da equipe
```

> **O repositório é público.** Só entra no Git o que pode ser lido por
> qualquer pessoa. Material de origem — fotos em alta de pessoas reais, manual
> de marca, arquivos do cliente — fica fora, e o site usa apenas os derivados
> otimizados em `docs/assets/img/`.

---

## Onde editar o conteúdo

Tudo que vai mudar com frequência está no topo de `docs/assets/js/main.js`, em
constantes nomeadas. Não é preciso mexer no HTML.

### Cargos da equipe

Todos estão como `Lorem ipsum`, conforme combinado. Em `EQUIPE`, troque só o
campo `cargo`:

```js
{ id: 'allison', nome: 'Allison', cargo: 'Lorem ipsum' },
```

Os nomes vieram dos nomes dos arquivos em `material/fotos-equipe-originais`
(extensão removida). Para **adicionar** alguém: rode a otimização (abaixo) e
acrescente uma linha em `EQUIPE`.

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

### Imagens de fundo dos cards (Sobre e O que fazemos)

Duas pastas com imagens **provisórias**: composições abstratas geradas na
paleta da marca, uma por tema. Não são banco de imagens — foram geradas para
não trazer dependência externa nem material de licença incerta ao repositório.

| pasta | proporção | opacidade repouso → hover |
|---|---|---|
| `docs/assets/img/pilares/` | 3:4 (900×1200) | 5% → 60% |
| `docs/assets/img/servicos/` | 4:3 (1000×750) | 14% → 62% |
| `docs/assets/img/galeria/` | 8:11 (800×1100) | 50% → 90% |

```
pilares/    estrategia · criatividade · tecnologia · dados · producao · performance
servicos/   estrategia-branding · performance-midia · conteudo-social ·
            audiovisual-eventos · tecnologia-ia · web-crm
galeria/    rodeo-country-bulls · lancamentos · chaves · patrocinio ·
            corporativos · institucionais · audiovisual · bastidores
```

Na galeria, o arquivo usado por cada card vem do campo `arte` em `GALERIA`
(`docs/assets/js/main.js`). Para uma foto real de projeto, preencha `img` com o
caminho — ele tem precedência sobre `arte`.

Para trocar por foto real, substitua os arquivos mantendo nome e proporção — o
HTML não muda. Como a imagem aparece sob um véu escuro, **fotos contrastadas
com um ponto de luz funcionam bem melhor** do que fotos claras e uniformes.

### Logos das marcas do grupo

Ficam em `docs/assets/img/marcas/` (webp + png). Os originais enviados pelo
cliente estão em `material/logos-marcas-originais/` — fora da pasta publicada,
porque vinham em tamanhos como 13.932 px de largura e 380 KB.

Na parede de marcas os logos aparecem **em branco** por padrão, para o conjunto
ler como um bloco só, e **voltam à cor original no hover**. Isso é feito com
`filter: brightness(0) invert(1)`, que só funciona porque todos têm fundo
transparente — se um logo novo vier com fundo sólido, vai virar um retângulo
branco.

Para reprocessar depois de trocar um original:

```bash
node scripts/otimiza-logos.js material/logos-marcas-originais docs/assets/img/marcas
```

O script apara a margem transparente e normaliza a altura. Logos empilhados
(ícone sobre texto) precisam de mais altura para ler no mesmo tamanho óptico
dos wordmarks horizontais — no HTML, esses recebem a classe
`brand__logo--alto`.

---

## Identidade visual

As cores e o logo saíram do manual em `material/Identidade Visual - REC•ADS/` e
estão em `docs/assets/css/tokens.css`:

| token | valor | origem |
|---|---|---|
| `--red` | `#d22110` | CMYK 0/95/100/10 |
| `--ink` | `#2d1a0c` | CMYK 0/10/20/95 |

Os valores vêm dos PNGs exportados (sRGB). O PDF, por ser CMYK, renderiza
`#EE3316` / `#34312A` — é diferença de perfil de conversão, não uma segunda
paleta. **Use os tokens.**

### Logo

`docs/assets/logo/` foi vetorizado a partir do PDF do manual:

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

Para reprocessar depois de adicionar fotos em `material/fotos-equipe-originais`,
com Node instalado:

```bash
npm install sharp
node scripts/optimize.js material/fotos-equipe-originais docs/assets/img/equipe
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

No GitHub, em *Settings › Pages*:

- **Source:** Deploy from a branch
- **Branch:** `main` · pasta **`/docs`**

⚠️ **A pasta precisa ser `/docs`, não `/ (root)`.** Apontada para a raiz, o
Jekyll não encontra `index.html` lá e renderiza o `README.md` como se fosse a
página — e ainda publica tudo que estiver na raiz do repositório.

Não há build nem workflow: o GitHub serve `docs/` como está. O `404.html` é
usado automaticamente em qualquer rota inexistente, e o `.nojekyll` impede o
GitHub de processar a pasta com o Jekyll.

**A regra que importa:** só entra em `docs/` o que pode ser público. O manual
de marca e as fotos originais em alta ficam em `material/`, fora da pasta
publicada, de propósito.

Para qualquer outra hospedagem, suba o conteúdo de `docs/` — nada mais.

### Domínio

As meta tags, o `robots.txt` e o `sitemap.xml` estão com `https://recads.com.br/`
como **suposição minha**, porque o domínio final ainda não foi definido. Ao
fechar o domínio, atualizar nos três lugares:

- `docs/index.html` — `og:url` e `<link rel="canonical">`
- `docs/robots.txt` — linha `Sitemap:`
- `docs/sitemap.xml` — `<loc>`

Enquanto estiver numa URL de projeto do Pages (`usuario.github.io/rec-ads/`),
o site funciona: todos os caminhos internos são relativos, inclusive os do 404.

---

## Pendências (dependem de material do cliente)

- [ ] Cargos reais da equipe (hoje `Lorem ipsum`)
- [x] ~~Arquivos de logo das 6 marcas do grupo~~ — recebidos e aplicados
- [ ] URLs dos canais (Instagram, YouTube, LinkedIn, TikTok, sites)
- [ ] Fotos e vídeos dos projetos da galeria
- [ ] Domínio final (ver acima)
