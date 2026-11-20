import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Rolagem suave com Lenis, sincronizada com o ticker do GSAP para que
 * as animações do ScrollTrigger acompanhem exatamente a posição da página.
 */
export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Links internos (#ancora) rolam suavemente, descontando a altura do header.
 * Links vazios (#) não fazem a página pular para o topo.
 */
export function initAnchorLinks(lenis) {
  const header = document.querySelector('[data-header]');

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');

      if (hash === '#') {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      const destination = hash === '#topo' ? 0 : target;
      const offset = -(header?.offsetHeight ?? 0);

      if (lenis) {
        lenis.scrollTo(destination, { offset: destination === 0 ? 0 : offset });
      } else if (destination === 0) {
        window.scrollTo({ top: 0 });
      } else {
        target.scrollIntoView();
      }

      history.replaceState(null, '', hash);
    });
  });
}
