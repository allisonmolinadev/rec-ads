/* ===========================================================================
   REC.ADS — comportamento
   Sem dependencias. Tudo degrada com elegancia se o JS falhar, exceto as
   listas montadas por dado (galeria, canais, equipe), que sao renderizadas
   aqui para ficarem faceis de editar num unico lugar.
   =========================================================================== */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================== DADOS ==== */

  /* --- Equipe, agrupada por area e na ordem definida pelo cliente --------
     `id` e o nome do arquivo de foto em assets/img/equipe/ e nao muda;
     `nome` e o que aparece no card. Para reordenar, mover a linha.        */
  const EQUIPE = [
    {
      area: 'Marketing & Criação',
      pessoas: [
        { id: 'fer-dourado',    nome: 'Fernando Dourado',   cargo: 'Diretor de Criação' },
        { id: 'eduardo-duarte', nome: 'Eduardo Duarte',     cargo: 'Brand Designer' },
        { id: 'allison',        nome: 'Allison Molina',     cargo: 'Web Designer' },
        { id: 'rebeca',         nome: 'Rebeca Machado',     cargo: 'Analista de Marketing' },
        { id: 'nathalia',       nome: 'Nathália Gomes',     cargo: 'Assessora de Imprensa' },
        { id: 'maria',          nome: 'Maria Salles',       cargo: 'Analista de Conteúdo' },
        { id: 'rodrigo',        nome: 'Rodrigo Dantas',     cargo: 'Motion Designer' },
        { id: 'edu-souza',      nome: 'Eduardo Souza',      cargo: 'Videomaker' },
        { id: 'maria-eduarda',  nome: 'Maria Eduarda Vera', cargo: 'Jovem Aprendiz' },
      ],
    },
    {
      area: 'Tecnologia & Desenvolvimento',
      pessoas: [
        { id: 'rafa',           nome: 'Rafael Gouveia',      cargo: 'Head de Marketing e Tecnologia' },
        { id: 'devanir',        nome: 'Devanir Annovazzi',   cargo: 'Software Dev' },
        { id: 'vinicius',       nome: 'Vinícius Jardinetti', cargo: 'TI' },
        { id: 'henrique',       nome: 'Henrique Julio',      cargo: 'Analista de Dados' },
        { id: 'guilherme',      nome: 'Guilherme Pomini',    cargo: 'TI' },
        { id: 'lorena-pereira', nome: 'Lorena Pereira',      cargo: 'P&D' },
      ],
    },
  ];

  /* --- Galeria ---------------------------------------------------------
     Só existe um projeto documentado na copy (Rodeo Country Bulls + FAJ).
     Os demais sao SLOTS marcados como placeholder — nao inventam case nem
     resultado. Para publicar um projeto real: preencher os campos e trocar
     `placeholder` para false, opcionalmente apontando `img`.              */
  const CATEGORIAS = [
    { id: 'todos',          nome: 'Todos' },
    { id: 'lancamentos',    nome: 'Lançamentos imobiliários' },
    { id: 'chaves',         nome: 'Entregas de chaves' },
    { id: 'patrocinio',     nome: 'Eventos de patrocínio' },
    { id: 'corporativos',   nome: 'Eventos corporativos' },
    { id: 'institucionais', nome: 'Campanhas institucionais' },
    { id: 'audiovisual',    nome: 'Produções audiovisuais' },
    { id: 'bastidores',     nome: 'Bastidores' },
  ];

  /* `arte` e' o fundo do card (provisorio, gerado — trocar os arquivos em
     assets/img/galeria/). `placeholder: true` continua marcando que ainda nao
     ha' projeto real ali, e a tarja "Em breve" aparece por causa disso. */
  const GALERIA = [
    {
      titulo: 'Rodeo Country Bulls + FAJ',
      cat: 'patrocinio',
      marca: 'Grupo FAJ',
      descricao: 'Cobertura, stand, camarote, ativações, vídeos, carrosséis, mídia paga e conteúdo em tempo real.',
      objetivo: null,
      resultado: null,
      arte: 'rodeo-country-bulls',
      img: null,
      placeholder: false,
      /* As fotos do evento, na ordem em que passam no carrossel do modal — a
         primeira e' a que abre. O id e' o caminho a partir de assets/img/, sem
         extensao: a pasta vai junto porque cada projeto tem a sua. O alt
         descreve a cena: aqui a foto e' conteudo, nao enfeite. Para reordenar,
         mover a linha. */
      fotos: [
        { id: 'rodeio/arena-painel-faj',        alt: 'Arena do rodeio com os painéis de LED da FAJ Empreendimentos ao fundo' },
        { id: 'rodeio/bandeira-arena',          alt: 'Dois homens estendem a bandeira do Brasil na arena durante a abertura' },
        { id: 'rodeio/camarote-faj-realiza',    alt: 'Fachada do camarote com o letreiro "A FAJ realiza" e um cinegrafista em cena' },
        { id: 'rodeio/camarote-faj-invest',     alt: 'Camarote do Grupo FAJ com o letreiro da FAJ Invest aceso' },
        { id: 'rodeio/lounge-50-anos',          alt: 'Lounge do camarote com o painel dos 50 anos e o logo do Grupo FAJ na parede' },
        { id: 'rodeio/convidados-camarote',     alt: 'Dois convidados posam para foto dentro do camarote' },
        { id: 'rodeio/chapeu-marcas',           alt: 'Chapéu personalizado com a fita das marcas do grupo' },
        { id: 'rodeio/panfleto-touro-mecanico', alt: 'Panfletos do Desafio Touro Mecânico sobre uma mesa de madeira' },
      ],
    },
    {
      titulo: 'Lançamentos imobiliários',
      cat: 'lancamentos',
      marca: 'FAJ Empreendimentos',
      descricao: 'Campanhas de lançamento, stand de vendas, conteúdo e mídia para novos empreendimentos.',
      objetivo: null,
      resultado: null,
      arte: 'lancamentos',
      img: null,
      placeholder: false,
      fotos: [
        { id: 'lancamentos/palco-lancamento',     alt: 'Palco da noite de lançamento sob feixes de luz, com o painel de LED homenageando o fundador do Grupo FAJ' },
        { id: 'lancamentos/anuncio-2026',         alt: 'Apresentador anuncia no painel os 13 empreendimentos e mais de R$ 1 bilhão previstos para 2026' },
        { id: 'lancamentos/abertura-palco',       alt: 'Dois apresentadores abrem a noite diante do painel com as marcas do empreendimento' },
        { id: 'lancamentos/entrevista-risos',     alt: 'Convidada sorri durante entrevista diante do painel do SOHO Business' },
        { id: 'lancamentos/entrevista-convidada', alt: 'Convidada é entrevistada ao microfone no painel do SOHO Business' },
        { id: 'lancamentos/entrevista-microfone', alt: 'Repórter conduz a entrevista com o microfone da cobertura' },
        { id: 'lancamentos/entrevista-palco',     alt: 'Dois homens conversam ao microfone durante a cobertura do evento' },
        { id: 'lancamentos/convidados-soho',      alt: 'Convidados conversam sob a luz azul do painel do SOHO Business' },
        { id: 'lancamentos/camera-entrevista',    alt: 'Câmera em tripé registra a entrevista, com a cena enquadrada no visor' },
        { id: 'lancamentos/camera-close',         alt: 'Close da câmera de vídeo com a entrevista na tela do equipamento' },
        { id: 'lancamentos/monitor-captacao',     alt: 'Monitor de captação mostra o entrevistado durante a gravação' },
        { id: 'lancamentos/celular-registro',     alt: 'Celular grava a apresentação que acontece no palco' },
        { id: 'lancamentos/operacao-bastidor',    alt: 'Equipe acompanha a transmissão na mesa de operação, nos bastidores' },
        { id: 'lancamentos/quarteto-cordas',      alt: 'Quarteto de cordas toca durante a recepção dos convidados' },
        { id: 'lancamentos/violinos',             alt: 'Violinistas em close durante a apresentação musical' },
        { id: 'lancamentos/arte-iluminada',       alt: 'Convidado observa a obra iluminada em azul exposta no evento' },
        { id: 'lancamentos/obra-azul',            alt: 'Obra de arte iluminada em azul, exposta na noite de lançamento' },
        { id: 'lancamentos/convidados-mesa',      alt: 'Convidados acompanham a noite de lançamento nas mesas do salão' },
      ],
    },
    {
      titulo: 'Entrega de chaves',
      cat: 'chaves',
      marca: 'FAJ Empreendimentos',
      descricao: 'Registro das entregas, depoimentos de clientes e conteúdo de relacionamento.',
      objetivo: null,
      resultado: null,
      arte: 'chaves',
      img: null,
      placeholder: false,
      fotos: [
        { id: 'chaves/chave-na-mao',         alt: 'Menina estende a chave do apartamento, com o chaveiro da FAJ Empreendimentos em primeiro plano' },
        { id: 'chaves/grupo-chave',          alt: 'Quatro moradores comemoram juntos, com a chave à mostra, diante do painel do evento' },
        { id: 'chaves/dupla-pasta-chave',    alt: 'Duas pessoas seguram a pasta de entrega com a chave presa na página' },
        { id: 'chaves/cartao-chave',         alt: 'Moradora mostra o cartão com a chave ao lado de um menino' },
        { id: 'chaves/duas-moradoras-pasta', alt: 'Duas moradoras seguram a pasta "Parabéns pela sua conquista"' },
        { id: 'chaves/abraco-painel',        alt: 'Duas convidadas abraçadas diante do painel "Realizei o meu sonho com a FAJ"' },
        { id: 'chaves/sacola-parabens',      alt: 'Moradora exibe a sacola e o cartão do FAJ Realiza' },
        { id: 'chaves/pasta-conquista',      alt: 'Moradora segura a pasta de entrega e a sacola de boas-vindas' },
        { id: 'chaves/kit-boas-vindas',      alt: 'Detalhe das mãos com a pasta aberta, o chaveiro e a sacola do FAJ Realiza' },
      ],
    },
    {
      titulo: 'Eventos de patrocínio',
      cat: 'patrocinio',
      marca: 'Grupo FAJ',
      descricao: 'Ativações de marca, camarote, stand e cobertura em tempo real.',
      objetivo: null,
      resultado: null,
      arte: 'patrocinio',
      img: null,
      placeholder: false,
      /* o estande do rodeio: a estrutura em si, enquanto o card do Rodeo
         Country Bulls guarda a arena, o camarote e os convidados */
      fotos: [
        { id: 'patrocinio/portal-mudamos-o-jogo', alt: 'Portal de entrada do estande com o painel de LED "Em 1 ano, mudamos o jogo"' },
        { id: 'patrocinio/portal-soho',           alt: 'Portal do SOHO Business na entrada do estande' },
        { id: 'patrocinio/fachada-stand',         alt: 'Fachada do estande com o videowall visível pela entrada' },
        { id: 'patrocinio/corredor-led',          alt: 'Corredor do estande revestido de painéis de LED com a marca FAJ Realiza' },
        { id: 'patrocinio/lounge-unidades',       alt: 'Lounge do estande sob o painel "+5.700 unidades lançadas"' },
        { id: 'patrocinio/lounge-sonhos',         alt: 'Área de estar do estande sob o letreiro "Sonhos realizados"' },
        { id: 'patrocinio/painel-grupo-faj',      alt: 'Painel de LED com entrevista acima do letreiro do Grupo FAJ' },
      ],
    },
    {
      titulo: 'Eventos corporativos',
      cat: 'corporativos',
      marca: 'Grupo FAJ',
      descricao: 'Convenções, encontros internos e apresentações do grupo.',
      objetivo: null,
      resultado: null,
      arte: 'corporativos',
      img: null,
      placeholder: false,
      fotos: [
        { id: 'corporativos/feira-equipe',        alt: 'Equipe posa para foto em um estande durante feira do setor da construção' },
        { id: 'corporativos/time-comemora',       alt: 'Time comemora de braços erguidos no escritório' },
        { id: 'corporativos/treinamento-sala',    alt: 'Apresentação para o time em sala de treinamento, com slide projetado' },
        { id: 'corporativos/gravacao-depoimento', retrato: true, alt: 'Gravação de depoimento no escritório, com celular em estabilizador e teleprompter' },
        { id: 'corporativos/acao-mulheres',       alt: 'Ecobag da ação de Dia das Mulheres, diante do painel com fotos do time' },
      ],
    },
    {
      titulo: 'Campanhas institucionais',
      cat: 'institucionais',
      marca: 'Grupo FAJ',
      descricao: 'Peças de posicionamento e autoridade para as marcas do grupo.',
      objetivo: null,
      resultado: null,
      arte: 'institucionais',
      img: null,
      placeholder: false,
      fotos: [
        { id: 'institucionais/apresentacao-time',     alt: 'Apresentação para o time reunido na sala, vista por trás de quem apresenta' },
        { id: 'institucionais/dupla-apresentadores',  alt: 'Dois integrantes conduzem a apresentação, um sentado ao notebook e outro em pé' },
        { id: 'institucionais/apresentacao-programa', alt: 'Equipe acompanha a apresentação do programa na tela projetada' },
        { id: 'institucionais/programa-plateia',      alt: 'Plateia de camisetas das marcas do grupo acompanha a apresentação' },
        { id: 'institucionais/plateia-atenta',        alt: 'Plateia atenta durante a apresentação' },
        { id: 'institucionais/plateia-perguntas',     alt: 'Integrantes levantam a mão para perguntar durante a apresentação' },
        { id: 'institucionais/maos-levantadas',       alt: 'Mãos levantadas na plateia durante a dinâmica da apresentação' },
      ],
    },
    {
      titulo: 'Produções audiovisuais',
      cat: 'audiovisual',
      marca: 'Grupo FAJ',
      descricao: 'Vídeos institucionais, documentários, highlights e entrevistas.',
      objetivo: null,
      resultado: null,
      arte: 'audiovisual',
      img: null,
      placeholder: false,
      /* as tres sao verticais (captacao de celular na feira): `retrato` troca o
         recorte do carrossel por encaixe, senao sobraria uma tira do meio */
      fotos: [
        { id: 'audiovisual/camera-feicon',    retrato: true, alt: 'Câmera em estabilizador grava os corredores da feira Feicon' },
        { id: 'audiovisual/gravacao-estande', retrato: true, alt: 'Câmera grava o estande com o personagem da marca ao fundo' },
        { id: 'audiovisual/captacao-publico', retrato: true, alt: 'Captação de imagens do público no estande durante a feira' },
      ],
    },
    {
      titulo: 'Bastidores',
      cat: 'bastidores',
      marca: 'SOHO Square',
      descricao: 'Os bastidores da operação: captação, montagem e time em campo.',
      objetivo: null,
      resultado: null,
      arte: 'bastidores',
      img: null,
      placeholder: false,
      fotos: [
        { id: 'bastidores/edicao-notebook',  alt: 'Integrante da equipe trabalha no notebook durante a montagem do material' },
        { id: 'bastidores/equipe-monitores', alt: 'Time reunido nos monitores da estação de trabalho durante a produção' },
        { id: 'bastidores/arte-na-tela',     alt: 'Monitor exibe a arte do lançamento do SOHO Square enquanto a equipe acompanha' },
        { id: 'bastidores/dupla-operacao',   alt: 'Dupla da equipe acompanha a operação atrás dos notebooks' },
      ],
    },
  ];

  /* --- Canais, um card por empresa --------------------------------------
     `url` fica null ate os links oficiais serem enviados; sem link o botao
     e' renderizado como <span> inerte, nao como <a> quebrado.
     Para publicar, basta preencher a url — o botao vira link sozinho.     */
  /* `arte` e' o caminho da arte do card, sem extensao — o render monta o
     .webp e o .jpg. Sao os lockups de cada marca, enviados pelo cliente e
     recortados por scripts/otimiza-canais.js. */
  const CANAIS = [
    {
      empresa: 'Grupo FAJ',
      arte: 'canais/grupo-faj',
      redes: [
        { plataforma: 'Instagram', ico: 'instagram', url: 'https://www.instagram.com/fajgrupo/' },
        { plataforma: 'YouTube',   ico: 'youtube',   url: 'https://www.youtube.com/@grupofaj' },
        { plataforma: 'LinkedIn',  ico: 'linkedin',  url: 'https://br.linkedin.com/company/grupofaj' },
      ],
    },
    {
      empresa: 'FAJ Empreendimentos',
      arte: 'canais/faj-empreendimentos',
      redes: [
        { plataforma: 'Instagram', ico: 'instagram', url: 'https://www.instagram.com/fajempreendimentos/' },
        { plataforma: 'TikTok',    ico: 'tiktok',    url: 'https://www.tiktok.com/@fajempreendimentos' },
      ],
    },
    {
      empresa: 'FAJ Invest',
      arte: 'canais/faj-invest',
      redes: [{ plataforma: 'Instagram', ico: 'instagram', url: 'https://www.instagram.com/fajinvest/' }],
    },
    {
      empresa: 'Utani',
      arte: 'canais/utani',
      redes: [{ plataforma: 'Instagram', ico: 'instagram', url: 'https://www.instagram.com/utani.imoveis/' }],
    },
    {
      empresa: 'Energy Field',
      arte: 'canais/energy-field',
      redes: [{ plataforma: 'Instagram', ico: 'instagram', url: 'https://www.instagram.com/energyfield.brasil/' }],
    },
    /* Ultimo card e' uma chamada, nao uma empresa: leva para a galeria, que e'
       o portfolio dentro do proprio site. */
    { cta: true, texto: 'Conheça o portfólio completo', href: '#galeria' },
  ];

  const ICONES = {
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/>',
    youtube: '<rect x="2" y="5" width="20" height="14" rx="4.4" stroke="currentColor" stroke-width="1.6"/><path d="m10 9 5 3-5 3V9z" fill="currentColor"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 10.5V17M7.5 7.4v.1M11.5 17v-3.6a2.1 2.1 0 0 1 4.2 0V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    tiktok: '<path d="M14 4v9.6a3.4 3.4 0 1 1-2.8-3.35" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 4c.4 2.2 1.9 3.6 4.2 3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    web: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.4 2.6 2.4 15.4 0 18-2.4-2.6-2.4-15.4 0-18z" stroke="currentColor" stroke-width="1.6"/>',
  };

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ==================================================== TEXT REVEAL ===== */
  /* Envolve cada palavra numa mascara. Preserva a marcacao interna (<em>),
     por isso ando na arvore em vez de sobrescrever innerHTML.              */
  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    let i = 0;

    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const words = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach((w) => {
            if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; }
            const outer = document.createElement('span');
            outer.className = 'split__w';
            const inner = document.createElement('span');
            inner.className = 'split__i';
            inner.style.setProperty('--d', `${i * 38}ms`);
            inner.textContent = w;
            outer.appendChild(inner);
            frag.appendChild(outer);
            i++;
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };

    walk(el);
    el.classList.add('split');
  }

  /* ======================================================== REVEAL ====== */
  function observeReveal() {
    const targets = [...$$('[data-reveal]'), ...$$('[data-split]')];
    if (reduced || !('IntersectionObserver' in window)) {
      targets.forEach((t) => t.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach((t) => io.observe(t));
  }

  /* ======================================================== PALCOS ====== */
  /* As cenas 3D dos cards de P&D so' animam enquanto o card esta' na tela.
     Sao sete cenas com varias camadas cada: girando o tempo todo em segundo
     plano, comeriam bateria sem ninguem ver. O CSS deixa tudo pausado por
     padrao, entao com movimento reduzido — ou sem observer — as cenas ficam
     paradas na pose, que ja' e' a composicao final. */
  function palcos() {
    const cenas = $$('[data-palco]');
    if (!cenas.length || reduced || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-vivo', e.isIntersecting));
    }, { rootMargin: '20% 0px' });
    cenas.forEach((c) => io.observe(c));
  }

  /* ====================================================== CONTADORES ==== */
  function counters() {
    const els = $$('.counter');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => { el.textContent = el.dataset.to; });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const to = parseFloat(el.dataset.to);
        const dur = 1700;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          // valores < 10 nao se beneficiam de arredondar cedo
          el.textContent = to < 10
            ? (eased * to).toFixed(p < 1 ? 1 : 0).replace('.', ',')
            : Math.round(eased * to);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = to;
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach((el) => io.observe(el));
  }

  /* ========================================================= HEADER ===== */
  function header() {
    const h = $('#header');
    if (!h) return;
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      h.classList.toggle('is-stuck', y > 24);
      // esconde ao descer, revela ao subir — mas nunca perto do topo
      if (y > 320 && y > last + 6) h.classList.add('is-hidden');
      else if (y < last - 6 || y < 320) h.classList.remove('is-hidden');
      last = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ==================================================== MENU MOBILE ===== */
  function menu() {
    const burger = $('#burger');
    const panel = $('#menu');
    if (!burger || !panel) return;
    const links = $$('.menu__link', panel);
    links.forEach((l, i) => l.style.setProperty('--d', `${120 + i * 45}ms`));

    const set = (open) => {
      panel.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      panel.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('is-locked', open);
    };

    burger.addEventListener('click', () => set(!panel.classList.contains('is-open')));
    links.forEach((l) => l.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) set(false);
    });
  }

  /* ====================================================== SCROLLSPY ===== */
  function scrollspy() {
    const links = $$('.nav__link');
    const map = new Map();
    links.forEach((l) => {
      const id = l.getAttribute('href');
      if (!id || !id.startsWith('#')) return;
      const sec = $(id);
      if (sec) map.set(sec, l);
    });
    if (!map.size || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.remove('is-active'));
        map.get(e.target)?.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, sec) => io.observe(sec));
  }

  /* ========================================================= GLOW ======= */
  /* halo do cursor nos cards — passa a posicao para o CSS */
  function cardGlow() {
    if (reduced || window.matchMedia('(hover: none)').matches) return;
    $$('.card--glow').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ========================================================== FITAS ===== */
  /* Carrossel continuo, usado nos pilares e na parede de marcas.
     A pista precisa de duas copias identicas para o translateX(-50%) emendar
     sem salto; a copia e' escondida de leitores de tela. Sem JS, o CSS deixa
     a pista rolavel na mao — nada some. */
  const VELOCIDADE = 52; // px por segundo

  function fitas() {
    $$('[data-fita]').forEach((caixa) => {
      const pista = $('.fita__pista', caixa);
      if (!pista || pista.dataset.pronta) return;
      /* data-fita="manual": a fita nao anda sozinha, so' pelas setas e pelo
         arrasto. O laco infinito continua valendo — as setas seguem podendo
         girar sem fim, nos dois sentidos. */
      const manual = caixa.dataset.fita === 'manual';

      [...pista.children].forEach((item) => {
        const copia = item.cloneNode(true);
        copia.setAttribute('aria-hidden', 'true');
        // a copia nao deve ser anunciada nem contada como conteudo novo
        copia.querySelectorAll('h3, img').forEach((el) => el.setAttribute('aria-hidden', 'true'));
        copia.querySelectorAll('img').forEach((el) => { el.alt = ''; });
        pista.appendChild(copia);
      });

      /* Largura fixa em px, nao max-content: e' o que permite os itens
         encolherem quando um cresce no hover — com max-content a pista
         acompanharia o crescimento e a emenda do laco mudaria de lugar. */
      let metade = 0;
      const medir = () => {
        pista.style.width = '';
        const total = pista.scrollWidth;
        pista.style.width = `${total}px`;
        metade = total / 2;
      };
      medir();
      let t;
      window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(medir, 180); });

      /* A posicao e' controlada aqui, e nao por animacao CSS, porque o avanco
         automatico e o arrasto precisam dividir o mesmo valor. Com @keyframes
         o transform seria da animacao e o arrasto brigaria com ele. */
      let pos = 0, pausado = false, arrastando = false, ultimoX = 0, anterior = null, andou = 0;
      /* px que ainda faltam do salto pedido por uma seta. Guardar a distancia
         que resta — e nao uma posicao de destino — deixa o deslize conviver com
         a normalizacao do laco, que reescreve `pos` a cada volta. */
      let resta = 0;

      const passo = (agora) => {
        if (anterior === null) anterior = agora;
        const dt = Math.min((agora - anterior) / 1000, 0.05); // trava saltos ao voltar de outra aba
        anterior = agora;
        if (!pausado && !arrastando && !reduced && !manual) pos -= VELOCIDADE * dt;
        if (resta !== 0 && !arrastando) {
          const avanco = resta * Math.min(1, dt * 9);
          pos += avanco;
          resta -= avanco;
          if (Math.abs(resta) < 0.5) { pos += resta; resta = 0; }
        }
        if (metade > 0) {
          // mantem a posicao dentro de uma copia: o laco fica infinito nos dois sentidos
          while (pos <= -metade) pos += metade;
          while (pos > 0) pos -= metade;
        }
        pista.style.transform = `translate3d(${pos.toFixed(2)}px, 0, 0)`;
        requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);

      caixa.addEventListener('pointerenter', () => { pausado = true; });
      caixa.addEventListener('pointerleave', () => { pausado = false; });
      caixa.addEventListener('focusin', () => { pausado = true; });
      caixa.addEventListener('focusout', () => { pausado = false; });

      caixa.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        arrastando = true; andou = 0; ultimoX = e.clientX;
        caixa.setPointerCapture(e.pointerId);
        caixa.classList.add('is-arrastando');
      });
      caixa.addEventListener('pointermove', (e) => {
        if (!arrastando) return;
        const d = e.clientX - ultimoX;
        ultimoX = e.clientX;
        andou += Math.abs(d);
        pos += d;
      });
      const soltar = (e) => {
        if (!arrastando) return;
        arrastando = false;
        caixa.classList.remove('is-arrastando');
        if (caixa.hasPointerCapture?.(e.pointerId)) caixa.releasePointerCapture(e.pointerId);
      };
      caixa.addEventListener('pointerup', soltar);
      caixa.addEventListener('pointercancel', soltar);
      // um arrasto nao deve virar clique em algo dentro da fita
      caixa.addEventListener('click', (e) => { if (andou > 6) { e.preventDefault(); e.stopPropagation(); } }, true);

      /* usado pelas setas: um clique anda um cartao, no mesmo transform do
         avanco automatico — assim os dois nunca disputam a posicao */
      caixa.avancar = (dir) => {
        const item = pista.children[0];
        if (!item) return;
        const largura = item.getBoundingClientRect().width +
          (parseFloat(getComputedStyle(item).marginRight) || 0);
        resta -= dir * largura;
      };

      pista.dataset.pronta = '1';
      caixa.classList.add('is-loop');
    });
  }

  /* Setas de uma fita: ficam fora dela (no cabecalho), por isso a ligacao e'
     por id. Sem fita montada — JS parcial — o controle some em vez de ficar
     inerte na tela. */
  function setasDeFita() {
    $$('[data-fita-nav]').forEach((botao) => {
      const alvo = document.getElementById(botao.dataset.alvo);
      if (!alvo || typeof alvo.avancar !== 'function') { botao.remove(); return; }
      botao.addEventListener('click', () => alvo.avancar(botao.dataset.fitaNav === 'next' ? 1 : -1));
    });
  }

  /* ========================================================= EQUIPE ===== */
  function team() {
    const wrap = $('#team');
    if (!wrap) return;

    /* sem data-reveal no cartao: quem revela e' a fita inteira. As copias que a
       fita cria para fechar o laco nao passam pelo observador, e com o reveal
       no cartao elas ficariam invisiveis a cada volta. */
    /* mesma pilha do card de pilar: foto (z 0), veu (z 1), nome (z 2) — o
       nome vive sobre a foto, nao embaixo dela */
    const cartao = (p) => `
      <article class="member">
        <picture>
          <source type="image/webp"
                  srcset="assets/img/equipe/${p.id}.webp 1x, assets/img/equipe/${p.id}@2x.webp 2x">
          <img class="member__bg" src="assets/img/equipe/${p.id}.jpg" alt="${esc(p.nome)}"
               width="640" height="800" loading="lazy" decoding="async">
        </picture>
        <span class="member__veu" aria-hidden="true"></span>
        <div class="member__body">
          <h4 class="member__n">${esc(p.nome)}</h4>
          <p class="member__r">${esc(p.cargo)}</p>
        </div>
      </article>`;

    const seta = (id, dir, rotulo) => `
      <button class="fita-seta" type="button" data-fita-nav="${dir}" data-alvo="${id}"
              aria-controls="${id}" aria-label="${rotulo}">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="${dir === 'next' ? 'M9 4l8 8-8 8' : 'M15 4l-8 8 8 8'}"
                fill="none" stroke="currentColor" stroke-width="2.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>`;

    /* O cabecalho fica no .wrap para acompanhar o resto da pagina; a fita corre
       de ponta a ponta da tela, fora dele. */
    wrap.innerHTML = EQUIPE.map((g, gi) => {
      const id = `fita-equipe-${gi}`;
      return `
      <section class="equipe-grupo">
        <div class="wrap">
          <div class="equipe-grupo__cab" data-reveal>
            <h3 class="equipe-grupo__t">${esc(g.area)}</h3>
            <div class="equipe-grupo__meta">
              <span class="equipe-grupo__n">${String(g.pessoas.length).padStart(2, '0')} ${g.pessoas.length === 1 ? 'pessoa' : 'pessoas'}</span>
              <div class="fita-setas">
                ${seta(id, 'prev', `Voltar em ${esc(g.area)}`)}
                ${seta(id, 'next', `Avançar em ${esc(g.area)}`)}
              </div>
            </div>
          </div>
        </div>
        <div class="team fita" id="${id}" data-fita="manual" data-reveal>
          <div class="fita__pista">${g.pessoas.map(cartao).join('')}</div>
        </div>
      </section>`;
    }).join('');
  }

  /* ========================================================= CANAIS ===== */
  function channels() {
    const wrap = $('#channels');
    if (!wrap) return;

    /* Botao redondo so' com o icone: o nome da plataforma vai no aria-label e
       no title, senao o botao ficaria sem nome acessivel. */
    const botao = (r, empresa) => {
      const ico = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">${ICONES[r.ico] || ''}</svg>`;
      const rotulo = `${esc(r.plataforma)} de ${esc(empresa)}`;
      return r.url
        ? `<a class="rede-btn" href="${esc(r.url)}" target="_blank" rel="noopener"
              aria-label="${rotulo}" title="${rotulo}">${ico}</a>`
        : `<span class="rede-btn is-inerte" role="img" aria-label="${rotulo}" title="${rotulo}">${ico}</span>`;
    };

    const cta = (c) => `
      <a class="canal canal--cta" href="${esc(c.href)}">
        <span class="canal__seta" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M7 7 32 32M32 32V15M32 32H15" stroke="currentColor" stroke-width="2.6"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="canal__cta-t">${esc(c.texto)}</span>
      </a>`;

    const cartao = (c) => `
      <article class="canal">
        <picture>
          <source type="image/webp" srcset="assets/img/${c.arte}.webp">
          <img class="canal__bg" src="assets/img/${c.arte}.jpg" alt="" aria-hidden="true"
               loading="lazy" decoding="async">
        </picture>
        <span class="canal__veu" aria-hidden="true"></span>
        <div class="canal__body">
          <h3 class="canal__empresa">${esc(c.empresa)}</h3>
          <div class="canal__redes">${c.redes.map((r) => botao(r, c.empresa)).join('')}</div>
        </div>
      </article>`;

    wrap.innerHTML = CANAIS.map((c) => (c.cta ? cta(c) : cartao(c))).join('');
  }

  /* ======================================================== GALERIA ===== */
  function gallery() {
    const grid = $('#gallery');
    const bar = $('#filters');
    if (!grid || !bar) return;

    bar.innerHTML = CATEGORIAS.map((c, i) =>
      `<button class="filter${i === 0 ? ' is-active' : ''}" data-cat="${c.id}"
               aria-pressed="${i === 0}">${esc(c.nome)}</button>`).join('');

    const nomeCat = (id) => CATEGORIAS.find((c) => c.id === id)?.nome || '';

    const fundo = (g) => g.img
      ? `<img class="shot__img" src="${esc(g.img)}" alt="" aria-hidden="true" loading="lazy" decoding="async">`
      : `<picture>
           <source type="image/webp" srcset="assets/img/galeria/${g.arte}.webp">
           <img class="shot__img" src="assets/img/galeria/${g.arte}.jpg" alt="" aria-hidden="true"
                width="800" height="1100" loading="lazy" decoding="async">
         </picture>`;

    grid.innerHTML = GALERIA.map((g, i) => `
      <button class="shot" data-cat="${g.cat}" data-i="${i}"
              aria-label="Abrir ${esc(g.titulo)}">
        ${fundo(g)}
        <span class="shot__veu" aria-hidden="true"></span>
        <span class="shot__topo">
          <span class="shot__cat">${esc(nomeCat(g.cat))}</span>
          ${g.placeholder ? '<span class="shot__tag">Em breve</span>' : ''}
        </span>
        <span class="shot__body">
          <span class="shot__t">${esc(g.titulo)}</span>
          ${g.descricao ? `<span class="shot__d">${esc(g.descricao)}</span>` : ''}
          <span class="shot__acao">Ver detalhes
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M2 11 11 2M11 2H4M11 2v7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </span>
      </button>`).join('') + '<p class="gallery-empty" hidden>Nenhum projeto nesta categoria ainda.</p>';

    const shots = $$('.shot', grid);
    const empty = $('.gallery-empty', grid);

    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;
      const cat = btn.dataset.cat;
      $$('.filter', bar).forEach((f) => {
        const on = f === btn;
        f.classList.toggle('is-active', on);
        f.setAttribute('aria-pressed', String(on));
      });
      let visiveis = 0;
      shots.forEach((s) => {
        const show = cat === 'todos' || s.dataset.cat === cat;
        s.classList.toggle('is-hidden', !show);
        if (show) visiveis++;
      });
      empty.hidden = visiveis > 0;
    });

    shots.forEach((s) => s.addEventListener('click', () => openModal(GALERIA[+s.dataset.i], nomeCat)));
  }

  /* ======================================================= CARROSSEL ==== */
  /* A posicao e' o scroll da propria pista, nao um indice guardado a parte:
     assim o arrasto no celular e a roda do mouse continuam mandando, e as
     setas sao so' mais um jeito de empurrar o mesmo scroll.                */
  function carrossel(escopo, fotos = []) {
    const raiz = $('[data-carrossel]', escopo);
    if (!raiz) return;

    const pista = $('.carrossel__pista', raiz);
    const slides = $$('.carrossel__slide', pista);
    const ant = $('.carrossel__seta--ant', raiz);
    const prox = $('.carrossel__seta--prox', raiz);
    const conta = $('.carrossel__conta', raiz);
    if (slides.length < 2) { raiz.classList.add('is-unica'); return; }

    const onde = () => Math.round(pista.scrollLeft / pista.clientWidth);

    /* Da' a volta nas pontas. Nesse salto o scroll e' instantaneo: animar a
       pista inteira de uma ponta a outra vira um borrao longo.             */
    const ir = (i) => {
      const n = (i + slides.length) % slides.length;
      const volta = Math.abs(n - onde()) > 1;
      pista.scrollTo({ left: n * pista.clientWidth, behavior: (reduced || volta) ? 'auto' : 'smooth' });
    };

    let t;
    const sync = () => { conta.textContent = `${onde() + 1} / ${slides.length}`; };
    pista.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sync, 80); }, { passive: true });

    ant.addEventListener('click', () => ir(onde() - 1));
    prox.addEventListener('click', () => ir(onde() + 1));

    /* Clicar na foto abre o visor. Ao fechar, a pista pula para a foto onde a
       pessoa parou la' dentro, senao as duas ficariam contando historias
       diferentes. */
    pista.addEventListener('click', (e) => {
      const slide = e.target.closest('.carrossel__slide');
      if (!slide) return;
      abrirVisor(fotos, +slide.dataset.i, (i) => {
        pista.scrollTo({ left: i * pista.clientWidth, behavior: 'auto' });
        sync();
      });
    });

    /* setas do teclado valem em qualquer ponto do carrossel; o Tab continua
       circulando pelo modal, que ja' tem a propria armadilha de foco. */
    raiz.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      ir(onde() + (e.key === 'ArrowLeft' ? -1 : 1));
    });
  }

  /* =========================================================== VISOR ==== */
  /* A foto ampliada, por cima do modal do projeto. Usa o arquivo @2x: a
     versao de 800px do carrossel nao tem detalhe para ocupar a tela.       */
  let vFotos = [], vIdx = 0, vVolta = null, vFoco = null;

  function visorAberto() {
    return $('#visor')?.classList.contains('is-open');
  }

  function visorPinta() {
    const f = vFotos[vIdx];
    const quadro = $('#visor-quadro');
    if (!f || !quadro) return;
    quadro.innerHTML = `
      <picture>
        <source type="image/webp" srcset="assets/img/${f.id}@2x.webp">
        <img class="visor__img" src="assets/img/${f.id}@2x.jpg" alt="${esc(f.alt)}" decoding="async">
      </picture>
      <figcaption class="visor__legenda">
        <span>${esc(f.alt)}</span>
        <span class="visor__conta">${vIdx + 1} / ${vFotos.length}</span>
      </figcaption>`;
  }

  function visorIr(i) {
    vIdx = (i + vFotos.length) % vFotos.length;
    visorPinta();
  }

  /* `aoFechar` devolve o indice final para quem abriu — o carrossel usa isso
     para parar na mesma foto. */
  function abrirVisor(fotos, i, aoFechar) {
    const visor = $('#visor');
    if (!visor || !fotos?.length) return;
    vFotos = fotos; vIdx = i; vVolta = aoFechar; vFoco = document.activeElement;
    visorPinta();
    visor.classList.add('is-open');
    visor.setAttribute('aria-hidden', 'false');
    $('.visor__fechar', visor)?.focus();
  }

  function fecharVisor() {
    const visor = $('#visor');
    if (!visor || !visor.classList.contains('is-open')) return;
    visor.classList.remove('is-open');
    visor.setAttribute('aria-hidden', 'true');
    $('#visor-quadro').innerHTML = '';   // solta a imagem grande da memoria
    vVolta?.(vIdx);
    vVolta = null;
    vFoco?.focus();
  }

  function visorSetup() {
    const visor = $('#visor');
    if (!visor) return;

    visor.addEventListener('click', (e) => {
      if (e.target.closest('[data-visor-close]')) { fecharVisor(); return; }
      if (e.target.closest('.visor__seta--ant')) visorIr(vIdx - 1);
      if (e.target.closest('.visor__seta--prox')) visorIr(vIdx + 1);
    });

    /* O foco fica preso aqui enquanto o visor esta' aberto: o modal atras
       continua no ar e, sem isso, o Tab cairia nele. */
    visor.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); visorIr(vIdx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); visorIr(vIdx + 1); }
      if (e.key !== 'Tab') return;
      const f = $$('button', visor).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const primeiro = f[0], ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    });
  }

  /* ========================================================== MODAL ===== */
  let lastFocus = null;

  function openModal(g, nomeCat) {
    const modal = $('#modal');
    const body = $('#modal-body');
    if (!modal || !body) return;
    lastFocus = document.activeElement;

    const linha = (k, v) => v
      ? `<div class="modal__row"><span class="modal__k">${k}</span><span>${esc(v)}</span></div>`
      : '';

    /* Foto do projeto: <picture> com webp e queda para jpg, igual ao resto do
       site. A primeira carrega logo; as outras so' quando chegam na vez. */
    /* O slide e' um botao: clicar abre a foto no visor. A descricao da cena
       fica no rotulo do botao, e a img entra vazia — senao o leitor de tela
       leria a mesma coisa duas vezes. */
    /* `retrato: true` na foto: a moldura do carrossel e' 3:2, e uma foto em pe'
       cortada nela viraria uma tira do meio. A marcacao troca o recorte por
       encaixe, deixando a foto inteira com tarja escura dos lados. */
    const foto = (f, i) => `
      <button class="carrossel__slide" type="button" data-i="${i}"
              aria-label="Ampliar foto: ${esc(f.alt)}">
        <picture>
          <source type="image/webp" srcset="assets/img/${f.id}.webp">
          <img class="carrossel__img${f.retrato ? ' carrossel__img--retrato' : ''}"
               src="assets/img/${f.id}.jpg" alt=""
               loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async">
        </picture>
      </button>`;

    /* Com fotos, o topo do modal e' o carrossel; sem, continua o quadro com o
       simbolo apagado. A pista rola de verdade — as setas so' empurram o
       scroll, entao arrastar no celular funciona sem codigo a mais. */
    const media = g.fotos?.length
      ? `<div class="carrossel" data-carrossel>
           <div class="carrossel__pista">${g.fotos.map(foto).join('')}</div>
           <button class="carrossel__seta carrossel__seta--ant" type="button" aria-label="Foto anterior">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
               <path d="M15 4 7 12l8 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
           </button>
           <button class="carrossel__seta carrossel__seta--prox" type="button" aria-label="Próxima foto">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
               <path d="m9 4 8 8-8 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
           </button>
           <p class="carrossel__conta" aria-live="polite">1 / ${g.fotos.length}</p>
         </div>`
      : `<div class="modal__media">
           ${g.img
             ? `<img src="${esc(g.img)}" alt="${esc(g.titulo)}" style="width:100%;height:100%;object-fit:cover">`
             : `<img class="ph" src="assets/logo/recads-c.svg" alt="" aria-hidden="true">`}
         </div>`;

    body.innerHTML = `
      ${media}
      <p class="eyebrow" style="margin-bottom:.75rem">${esc(nomeCat(g.cat))}</p>
      <h3 class="modal__t" id="modal-t">${esc(g.titulo)}</h3>
      ${g.descricao ? `<p style="color:var(--text-2)">${esc(g.descricao)}</p>` : ''}
      ${g.placeholder
        ? `<p style="color:var(--text-3);font-family:var(--font-mono);font-size:var(--fs-xs);margin-top:var(--sp-3)">
             Espaço reservado. Fotos, vídeos e descrição desta categoria entram aqui.
           </p>`
        : `<div class="modal__meta">
             ${linha('Marca', g.marca)}
             ${linha('Objetivo', g.objetivo)}
             ${linha('Resultado', g.resultado)}
           </div>`}`;

    carrossel(body, g.fotos);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    $('.modal__close', modal)?.focus();
  }

  function closeModal() {
    const modal = $('#modal');
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    lastFocus?.focus();
  }

  function modalSetup() {
    const modal = $('#modal');
    if (!modal) return;
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
    /* o Esc fecha uma camada por vez: primeiro o visor, depois o modal */
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (visorAberto()) fecharVisor(); else closeModal();
    });

    // mantem o foco dentro do painel enquanto aberto
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;
      const f = $$('a[href], button, [tabindex]:not([tabindex="-1"])', modal)
        .filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* =========================================================== BOOT ===== */
  function init() {
    $('#ano').textContent = new Date().getFullYear();

    // as fitas vem depois de team(): as linhas da equipe so' existem apos a
    // montagem, e fitas() precisa achar a pista ja' no DOM
    team();
    fitas();
    setasDeFita();
    channels();
    gallery();
    modalSetup();
    visorSetup();

    $$('[data-split]').forEach(split);

    header();
    menu();
    scrollspy();
    cardGlow();
    palcos();
    counters();
    observeReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
