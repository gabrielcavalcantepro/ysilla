gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ==============================
// SCROLL SMOOTHER PRIMEIRO
// Deve ser criado ANTES dos ScrollTriggers
// para evitar recálculos de layout
// ==============================


// ==============================
// SCROLL SUAVE — LINKS
// ==============================

document.querySelectorAll(".link").forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    smoother.scrollTo("#valor", true);
  });
});


// ==============================
// ANIMAÇÕES DE ENTRADA
// ==============================

// gsap.set() para todos os estados iniciais ANTES de criar qualquer ScrollTrigger
// Isso evita que o GSAP leia geometria durante a criação das animações
gsap.set(".blur-up, .blur-down, .blur-left, .blur-right", {
  autoAlpha: 0,
  scale: 0.98
});
gsap.set(".blur-up",    { y: 60 });
gsap.set(".blur-down",  { y: -60 });
gsap.set(".blur-left",  { x: 60 });
gsap.set(".blur-right", { x: -60 });

function animateEntry(selector) {
  document.querySelectorAll(selector).forEach(el => {
    gsap.to(el, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true
        // invalidateOnRefresh removido — evita releitura de layout a cada resize
      }
    });
  });
}

animateEntry(".blur-up");
animateEntry(".blur-down");
animateEntry(".blur-left");
animateEntry(".blur-right");


// ==============================
// HOVER BOTÕES
// ==============================

document.querySelectorAll('.bottom').forEach(btn => {
  let isBlue = false;
  btn.classList.add('hover-blue');

  btn.addEventListener('mouseenter', () => {
    btn.classList.remove('hover-blue', 'hover-pink');
    btn.classList.add(isBlue ? 'hover-pink' : 'hover-blue');
    isBlue = !isBlue;
  });
});


// ==============================
// ANIMAÇÃO DE PALAVRAS — SEÇÃO 4
// ==============================

const h2 = document.querySelector('.secao-4 .content h2');
const palavras = h2.textContent.trim().split(/\s+/);
h2.innerHTML = palavras.map(p => `<span class="palavra">${p}</span>`).join(' ');
const spans = document.querySelectorAll('.secao-4 .content h2 .palavra');
const total = spans.length;

// Agora o trigger é o WRAPPER (que tem 300vh)
// O sticky cuida do "grudar", o GSAP só lê o progresso do scroll
ScrollTrigger.create({
  trigger: '.secao-4-wrapper',
  start: 'top top',
  end: 'bottom bottom',
  scrub: 1,
  onUpdate: (self) => {
    const palavrasAtivas = Math.round(self.progress * total);
    spans.forEach((span, i) => {
      span.classList.toggle('ativa', i < palavrasAtivas);
    });
  }
});


// ==============================
// CONTADOR — SEÇÃO 11
// ==============================

const span = document.querySelector(".secao-11 .content h4 span");

if (span) {
  let counter = { value: 500 };

  gsap.to(counter, {
    value: 1135,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".secao-11",  // ← trigger correto
      start: "top 80%",      // dispara quando a seção entra 80% da tela
      toggleActions: "play none none none"
    },
    onUpdate: function () {
      span.textContent = "R$" + Math.floor(counter.value).toLocaleString("pt-BR");
    }
  });
}


// ==============================
// CARROSSEL — SEÇÃO 5
// ==============================

(function () {
  const ul = document.querySelector('.secao-5 .carrossel ul');
  const btnEsquerda = document.querySelector('.secao-5 .seta:first-child');
  const btnDireita  = document.querySelector('.secao-5 .seta:last-child');

  const itemWidth = 250;
  const itemGap   = 20;
  const passo     = itemWidth + itemGap;

  let posicaoAtual = 0;

  // Lê offsetWidth UMA vez e recalcula só no resize (via ResizeObserver)
  // evitando leitura de geometria a cada clique
  let larguraVisivel = ul.parentElement.offsetWidth;

  const ro = new ResizeObserver(entries => {
    larguraVisivel = entries[0].contentRect.width;
  });
  ro.observe(ul.parentElement);

  function getMaxScroll() {
    const totalItens  = ul.children.length;
    const larguraTotal = totalItens * passo - itemGap;
    return Math.max(0, larguraTotal - larguraVisivel);
  }

  function atualizar() {
    // transform não causa reflow — só composite
    ul.style.transform = `translateX(-${posicaoAtual}px)`;
  }

  btnDireita.addEventListener('click', () => {
    posicaoAtual = Math.min(posicaoAtual + passo, getMaxScroll());
    atualizar();
  });

  btnEsquerda.addEventListener('click', () => {
    posicaoAtual = Math.max(posicaoAtual - passo, 0);
    atualizar();
  });
})();


// ==============================
// CARROSSEL — SEÇÃO 8
// ==============================

(function () {
  const trilho = document.querySelector('.secao-8 .depoimentos');
  const ul = trilho.querySelector('ul');

  // Duplica itens para loop infinito
  const itensOriginais = Array.from(ul.children);
  itensOriginais.forEach(item => ul.appendChild(item.cloneNode(true)));

  const GAP = 20;
  const totalOriginais = itensOriginais.length;

  // Lê largura UMA vez — atualiza só no resize via ResizeObserver
  // Em vez de chamar offsetWidth a cada frame (causa reflow a cada tick!)
  let larguraItem = itensOriginais[0].offsetWidth + GAP;

  const ro = new ResizeObserver(() => {
    larguraItem = itensOriginais[0].offsetWidth + GAP;
  });
  ro.observe(itensOriginais[0]);

  function getLarguraBloco() {
    return larguraItem * totalOriginais;
  }

  let posicao     = 0;
  let velocidade  = 0.5;
  let animando    = true;
  let timerRetorno = null;

  // Drag state
  let arrastando      = false;
  let inicioX         = 0;
  let posicaoAoIniciar = 0;

  function loop() {
    if (animando) posicao += velocidade;

    const bloco = getLarguraBloco();
    if (posicao >= bloco)  posicao -= bloco;
    else if (posicao < 0)  posicao += bloco;

    // translateX não provoca reflow — opera só na camada de composição
    ul.style.transform = `translateX(-${posicao}px)`;
    requestAnimationFrame(loop);
  }

  function pausar() {
    animando = false;
    clearTimeout(timerRetorno);
    timerRetorno = setTimeout(() => { animando = true; }, 2000);
  }

  // Mouse
  trilho.addEventListener('mousedown', (e) => {
    arrastando = true;
    inicioX = e.clientX;
    posicaoAoIniciar = posicao;
    trilho.classList.add('arrastando');
    pausar();
  });

  window.addEventListener('mousemove', (e) => {
    if (!arrastando) return;
    posicao = posicaoAoIniciar + (inicioX - e.clientX);
  });

  window.addEventListener('mouseup', () => {
    if (!arrastando) return;
    arrastando = false;
    trilho.classList.remove('arrastando');
    pausar();
  });

  // Touch
  trilho.addEventListener('touchstart', (e) => {
    inicioX = e.touches[0].clientX;
    posicaoAoIniciar = posicao;
    pausar();
  }, { passive: true });

  trilho.addEventListener('touchmove', (e) => {
    posicao = posicaoAoIniciar + (inicioX - e.touches[0].clientX);
  }, { passive: true });

  trilho.addEventListener('touchend', pausar);

  requestAnimationFrame(loop);
})();


// ==============================
// REFRESH ÚNICO AO FINAL
// Chama ScrollTrigger.refresh() uma única vez
// depois que tudo está carregado e pintado
// ==============================

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});