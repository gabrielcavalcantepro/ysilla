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

animateEntry(".blur-up",   { y: 60 });
animateEntry(".blur-down", { y: -60 });
animateEntry(".blur-left", { x: 60 });
animateEntry(".blur-right",{ x: -60 });


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
  btn.addEventListener("click", function(e) {
    e.preventDefault();
    smoother.scrollTo("#valor", true);
  });
});


document.addEventListener("DOMContentLoaded", function () {

    const span = document.querySelector(".secao-7 .content h2 span");

    let counter = { value: 500 };

    gsap.to(counter, {
        value: 1438,
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


const delay = (18 * 60 + 20) * 1000;

  setTimeout(function() {
    document.querySelectorAll(".time").forEach(function(element) {
      element.style.opacity = "1";
      element.style.visibility = "visible";
    });
  }, delay);