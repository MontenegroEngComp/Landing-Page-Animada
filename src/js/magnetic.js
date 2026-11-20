import { gsap } from 'gsap';
import { hasFinePointer } from './utils.js';

const STRENGTH = 0.3;

/**
 * Botões "magnéticos": seguem levemente o cursor enquanto ele está
 * sobre o elemento e voltam com efeito elástico quando ele sai.
 * Só é ativado em dispositivos com mouse.
 */
export function initMagnetic() {
  if (!hasFinePointer) return;

  document.querySelectorAll('[data-magnetic]').forEach((element) => {
    const moveX = gsap.quickTo(element, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3.out' });

    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * STRENGTH);
      moveY((event.clientY - (rect.top + rect.height / 2)) * STRENGTH);
    });

    element.addEventListener('pointerleave', () => {
      gsap.to(element, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
    });
  });
}
