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

  /* --- Equipe: nomes derivados dos arquivos de docs/img -----------------
     Os cargos ainda nao foram enviados: todos ficam "Lorem ipsum" ate la.
     Para preencher, trocar apenas o campo `cargo`.                        */
  const EQUIPE = [
    { id: 'allison',        nome: 'Allison',         cargo: 'Lorem ipsum' },
    { id: 'devanir',        nome: 'Devanir',         cargo: 'Lorem ipsum' },
    { id: 'edu-souza',      nome: 'Edu Souza',       cargo: 'Lorem ipsum' },
    { id: 'eduardo-duarte', nome: 'Eduardo Duarte',  cargo: 'Lorem ipsum' },
    { id: 'fer-dourado',    nome: 'Fer Dourado',     cargo: 'Lorem ipsum' },
    { id: 'guilherme',      nome: 'Guilherme',       cargo: 'Lorem ipsum' },
    { id: 'henrique',       nome: 'Henrique',        cargo: 'Lorem ipsum' },
    { id: 'lorena-pereira', nome: 'Lorena Pereira',  cargo: 'Lorem ipsum' },
    { id: 'maria-eduarda',  nome: 'Maria Eduarda',   cargo: 'Lorem ipsum' },
    { id: 'maria',          nome: 'Maria',           cargo: 'Lorem ipsum' },
    { id: 'nathalia',       nome: 'Nathalia',        cargo: 'Lorem ipsum' },
    { id: 'rafa',           nome: 'Rafa',            cargo: 'Lorem ipsum' },
    { id: 'rodrigo',        nome: 'Rodrigo',         cargo: 'Lorem ipsum' },
    { id: 'vinicius',       nome: 'Vinicius',        cargo: 'Lorem ipsum' },
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

  const GALERIA = [
    {
      titulo: 'Rodeo Country Bulls + FAJ',
      cat: 'patrocinio',
      marca: 'Grupo FAJ',
      descricao: 'Cobertura, stand, camarote, ativações, vídeos, carrosséis, mídia paga e conteúdo em tempo real.',
      objetivo: null,
      resultado: null,
      img: null,
      placeholder: false,
    },
    { titulo: 'Lançamentos imobiliários', cat: 'lancamentos',    placeholder: true },
    { titulo: 'Entregas de chaves',       cat: 'chaves',         placeholder: true },
    { titulo: 'Eventos de patrocínio',    cat: 'patrocinio',     placeholder: true },
    { titulo: 'Eventos corporativos',     cat: 'corporativos',   placeholder: true },
    { titulo: 'Campanhas institucionais', cat: 'institucionais', placeholder: true },
    { titulo: 'Produções audiovisuais',   cat: 'audiovisual',    placeholder: true },
    { titulo: 'Bastidores',               cat: 'bastidores',     placeholder: true },
  ];

  /* --- Canais ----------------------------------------------------------
     `url` fica null ate os links oficiais serem enviados; sem link o card
     e' renderizado como <div>, nao como <a> quebrado.                     */
  const CANAIS = [
    { nome: 'FAJ Empreendimentos', plataforma: 'Instagram', ico: 'instagram', url: null },
    { nome: 'FAJ Invest',          plataforma: 'Instagram', ico: 'instagram', url: null },
    { nome: 'Grupo FAJ',           plataforma: 'Instagram', ico: 'instagram', url: null },
    { nome: 'Utani',               plataforma: 'Instagram', ico: 'instagram', url: null },
    { nome: 'Energy Field',        plataforma: 'Instagram', ico: 'instagram', url: null },
    { nome: 'Grupo FAJ',           plataforma: 'YouTube',   ico: 'youtube',   url: null },
    { nome: 'Grupo FAJ',           plataforma: 'LinkedIn',  ico: 'linkedin',  url: null },
    { nome: 'FAJ Empreendimentos', plataforma: 'TikTok',    ico: 'tiktok',    url: null },
    { nome: 'Sites e landing pages', plataforma: 'Web',     ico: 'web',       url: null },
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

  /* ======================================================== PILARES ===== */
  /* A fita precisa de duas copias identicas para o translateX(-50%) emendar
     sem salto. A copia e' escondida de leitores de tela. Sem JS, o CSS deixa
     a pista rolavel na mao — nada some. */
  function pilares() {
    const caixa = $('#pilares');
    const pista = $('.pilares__pista', caixa || document);
    if (!caixa || !pista) return;

    const originais = [...pista.children];
    originais.forEach((card) => {
      const copia = card.cloneNode(true);
      copia.setAttribute('aria-hidden', 'true');
      // a copia nao deve ser lida nem indexada como conteudo novo
      copia.querySelectorAll('h3').forEach((h) => h.setAttribute('aria-hidden', 'true'));
      pista.appendChild(copia);
    });

    // duracao proporcional a largura: cards maiores nao passam mais rapido
    const largura = pista.scrollWidth / 2;
    caixa.style.setProperty('--vel', `${Math.round(largura / 34)}s`);
    caixa.classList.add('is-loop');
  }

  /* ========================================================= EQUIPE ===== */
  function team() {
    const wrap = $('#team');
    if (!wrap) return;
    wrap.innerHTML = EQUIPE.map((p, i) => `
      <article class="member" data-reveal style="--reveal-delay: ${(i % 5) * 80}ms">
        <div class="member__ph">
          <picture>
            <source type="image/webp"
                    srcset="assets/img/equipe/${p.id}.webp 1x, assets/img/equipe/${p.id}@2x.webp 2x">
            <img src="assets/img/equipe/${p.id}.jpg" alt="${esc(p.nome)}"
                 width="640" height="800" loading="lazy" decoding="async">
          </picture>
        </div>
        <div class="member__body">
          <h3 class="member__n">${esc(p.nome)}</h3>
          <p class="member__r">${esc(p.cargo)}</p>
        </div>
      </article>`).join('');
  }

  /* ========================================================= CANAIS ===== */
  function channels() {
    const wrap = $('#channels');
    if (!wrap) return;
    wrap.innerHTML = CANAIS.map((c) => {
      const inner = `
        <span class="channel__ico">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">${ICONES[c.ico] || ''}</svg>
        </span>
        <span>
          <span class="channel__n">${esc(c.nome)}</span>
          <span class="channel__p">${esc(c.plataforma)}</span>
        </span>`;
      return c.url
        ? `<a class="channel" href="${esc(c.url)}" target="_blank" rel="noopener">${inner}</a>`
        : `<div class="channel">${inner}</div>`;
    }).join('');
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

    grid.innerHTML = GALERIA.map((g, i) => `
      <button class="shot" data-cat="${g.cat}" data-i="${i}"
              aria-label="Abrir ${esc(g.titulo)}">
        ${g.img
          ? `<img class="shot__img" src="${esc(g.img)}" alt="${esc(g.titulo)}" loading="lazy" decoding="async">`
          : `<span class="shot__ph"><img src="assets/logo/recads-c.svg" alt="" aria-hidden="true"></span>`}
        ${g.placeholder ? '<span class="shot__tag">Em breve</span>' : ''}
        <span class="shot__body">
          <span class="shot__cat">${esc(nomeCat(g.cat))}</span>
          <span class="shot__t">${esc(g.titulo)}</span>
          ${g.descricao ? `<span class="shot__d">${esc(g.descricao)}</span>` : ''}
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

    body.innerHTML = `
      <div class="modal__media">
        ${g.img
          ? `<img src="${esc(g.img)}" alt="${esc(g.titulo)}" style="width:100%;height:100%;object-fit:cover">`
          : `<img class="ph" src="assets/logo/recads-c.svg" alt="" aria-hidden="true">`}
      </div>
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
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

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

    pilares();
    team();
    channels();
    gallery();
    modalSetup();

    $$('[data-split]').forEach(split);

    header();
    menu();
    scrollspy();
    cardGlow();
    counters();
    observeReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
