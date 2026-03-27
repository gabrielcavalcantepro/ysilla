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