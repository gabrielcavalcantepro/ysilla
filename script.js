gsap.registerPlugin(ScrollTrigger);

// ==============================
// ANIMAÇÕES DE ENTRADA
// ==============================

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
      }
    });
  });
}

animateEntry(".blur-up");
animateEntry(".blur-down");
animateEntry(".blur-left");
animateEntry(".blur-right");


// ==============================
// SCROLL SUAVE — LINKS
// Substitui o smoother.scrollTo() pelo scrollIntoView nativo
// Só intercepta âncoras internas (#), links externos como o da Kiwify seguem normalmente
// ==============================

document.querySelectorAll('.link[href^="#"]').forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#valor")?.scrollIntoView({ behavior: "smooth" });
  });
});


// ==============================
// REFRESH ÚNICO AO FINAL
// ==============================

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});



//ANIMAÇÕES DE ENTRADA
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // não repete
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));