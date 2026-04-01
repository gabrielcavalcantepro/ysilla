gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ==============================
// ANIMAÇÕES DE ENTRADA
// ==============================

function animateEntry(selector, initialProps) {
  document.querySelectorAll(selector).forEach(el => {

    gsap.fromTo(
      el,
      {
        ...initialProps,
        autoAlpha: 0,
        scale: 0.98
      },
      {
        x: 0,
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
          invalidateOnRefresh: true
        }
      }
    );

  });
}

animateEntry(".blur-up", { y: 60 });
animateEntry(".blur-down", { y: -60 });
animateEntry(".blur-left", { x: 60 });
animateEntry(".blur-right", { x: -60 });


ScrollSmoother.create({
  smooth: 1,
  effects: true,
  smoothTouch: 0.1
});


// ==============================
// SCROLL SUAVE
// ==============================


const smoother = ScrollSmoother.get();

document.querySelectorAll(".link").forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    smoother.scrollTo("#valor", true);
  });
});





const btns = document.querySelectorAll('.bottom');

btns.forEach(btn => {
    let isBlue = false;
    btn.classList.add('hover-blue');

    btn.addEventListener('mouseenter', () => {
        btn.classList.remove('hover-blue', 'hover-pink');
        btn.classList.add(isBlue ? 'hover-pink' : 'hover-blue');
        isBlue = !isBlue;
    });
});





// 1. Quebra o h2 em spans por palavra
const h2 = document.querySelector('.secao-4 .content h2');
const palavras = h2.innerText.trim().split(/\s+/);
h2.innerHTML = palavras.map(p => `<span class="palavra">${p}</span>`).join(' ');
const spans = document.querySelectorAll('.secao-4 .content h2 .palavra');
const total = spans.length;

// 2. Pin + animação das palavras
ScrollTrigger.create({
  trigger: '.secao-4',
  start: 'top top',
  end: '+=200%',        // quanto scroll "falso" você quer — aumente para ficar mais lento
  pin: true,            // GSAP faz o "sticky" compatível com ScrollSmoother
  scrub: true,
  onUpdate: (self) => {
    const palavrasAtivas = Math.round(self.progress * total);
    spans.forEach((span, i) => {
      span.classList.toggle('ativa', i < palavrasAtivas);
    });
  }
});


// SOMA DE VALORES
document.addEventListener("DOMContentLoaded", function () {

    const span = document.querySelector(".secao-11 .content h4 span");

    let counter = { value: 500 };

    gsap.to(counter, {
        value: 1135,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".secao-7",
            start: "top 80%", 
            toggleActions: "play none none none"
        },
        onUpdate: function () {
            span.textContent = "R$" + Math.floor(counter.value).toLocaleString("pt-BR");
        }
    });

});




// CARROSSEL SEÇÃO 1


(function () {
    const ul = document.querySelector('.secao-5 .carrossel ul');
    const btnEsquerda = document.querySelector('.secao-5 .seta:first-child');
    const btnDireita  = document.querySelector('.secao-5 .seta:last-child');

    const itemWidth  = 250; // largura do card
    const itemGap    = 20;  // gap entre cards
    const passo      = itemWidth + itemGap; // 270px por clique

    let posicaoAtual = 0;

    function getMaxScroll() {
        const totalItens      = ul.children.length;
        const larguraVisivel  = ul.parentElement.offsetWidth;
        const larguraTotal    = totalItens * passo - itemGap;
        return Math.max(0, larguraTotal - larguraVisivel);
    }

    function atualizar() {
        ul.style.transform = `translateX(-${posicaoAtual}px)`;
    }

    btnDireita.addEventListener('click', () => {
        const max = getMaxScroll();
        posicaoAtual = Math.min(posicaoAtual + passo, max);
        atualizar();
    });

    btnEsquerda.addEventListener('click', () => {
        posicaoAtual = Math.max(posicaoAtual - passo, 0);
        atualizar();
    });
})();





// CARROSSEL SEÇÃO 8

(function () {
    const trilho = document.querySelector('.secao-8 .depoimentos');
    const ul = trilho.querySelector('ul');

    // 1. Duplica os itens para criar o loop infinito
    const itensOriginais = Array.from(ul.children);
    itensOriginais.forEach(item => {
        ul.appendChild(item.cloneNode(true));
    });

    const GAP = 20;
    const totalOriginais = itensOriginais.length;

    function getLarguraItem() {
        return itensOriginais[0].offsetWidth + GAP;
    }

    function getLarguraBloco() {
        return getLarguraItem() * totalOriginais;
    }

    let posicao = 0;
    let velocidade = 0.5; // px por frame — ajuste para mais rápido/lento
    let animando = true;
    let rafId = null;
    let timerRetorno = null;

    // Drag state
    let arrastando = false;
    let inicioX = 0;
    let posicaoAoIniciar = 0;

    function loop() {
        if (animando) {
            posicao += velocidade;
        }

        // Loop infinito: quando passa o bloco original, volta ao início
        const bloco = getLarguraBloco();
        if (posicao >= bloco) {
            posicao -= bloco;
        } else if (posicao < 0) {
            posicao += bloco;
        }

        ul.style.transform = `translateX(-${posicao}px)`;
        rafId = requestAnimationFrame(loop);
    }

    function pausar() {
        animando = false;
        clearTimeout(timerRetorno);
        timerRetorno = setTimeout(() => {
            animando = true;
        }, 2000); // retoma após 2s sem interação
    }

    // ── Mouse ──
    trilho.addEventListener('mousedown', (e) => {
        arrastando = true;
        inicioX = e.clientX;
        posicaoAoIniciar = posicao;
        trilho.classList.add('arrastando');
        pausar();
    });

    window.addEventListener('mousemove', (e) => {
        if (!arrastando) return;
        const delta = inicioX - e.clientX;
        posicao = posicaoAoIniciar + delta;
    });

    window.addEventListener('mouseup', () => {
        if (!arrastando) return;
        arrastando = false;
        trilho.classList.remove('arrastando');
        pausar(); // reinicia o timer de retorno
    });

    // ── Touch ──
    trilho.addEventListener('touchstart', (e) => {
        inicioX = e.touches[0].clientX;
        posicaoAoIniciar = posicao;
        pausar();
    }, { passive: true });

    trilho.addEventListener('touchmove', (e) => {
        const delta = inicioX - e.touches[0].clientX;
        posicao = posicaoAoIniciar + delta;
    }, { passive: true });

    trilho.addEventListener('touchend', () => {
        pausar();
    });

    // Inicia o loop
    rafId = requestAnimationFrame(loop);
})();