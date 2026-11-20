import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const HIDE_AFTER = 240; // px rolados antes de o header poder sumir

/**
 * Header que some ao rolar para baixo e volta ao rolar para cima,
 * ganhando uma borda sutil quando a página não está no topo.
 * Também controla a barra de progresso da rolagem.
 */
export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const scrolled = self.scroll();
      header.classList.toggle('is-scrolled', scrolled > 8);
      header.classList.toggle('is-hidden', self.direction === 1 && scrolled > HIDE_AFTER);
    },
  });

  // Mostra o header quando algum elemento dele recebe foco pelo teclado
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      start: 0,
      end: 'max',
      scrub: 0.3,
    },
  });
}
