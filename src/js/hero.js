import { gsap } from 'gsap';
import { hasFinePointer } from './utils.js';

/**
 * Animações contínuas do hero, iniciadas depois da entrada:
 * - o patins flutua levemente;
 * - as estrelas piscam;
 * - com o mouse, as camadas se movem em profundidades diferentes (parallax);
 * - ao rolar a página, o patins "sai rodando" para a direita.
 */
export function initHero() {
  const image = document.querySelector('[data-hero-image]');
  if (!image) return;

  const patinsWrapper = image.querySelector('[data-patins]');
  const patins = image.querySelector('.hero__patins');
  const ellipse = image.querySelector('.hero__ellipse');
  const stars = image.querySelectorAll('.hero__stars');

  // Flutuação
  gsap.to(patinsWrapper, {
    y: -14,
    duration: 2.2,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });

  // Estrelas piscando
  stars.forEach((star, i) => {
    gsap.to(star, {
      scale: 0.75,
      rotation: i % 2 ? 18 : -18,
      opacity: 0.6,
      duration: 1.1 + i * 0.35,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: i * 0.4,
    });
  });

  // Saída com a rolagem
  gsap.to(image, {
    x: () => window.innerWidth * 0.12,
    rotation: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  if (!hasFinePointer) return;

  // Parallax com o mouse: cada camada tem uma profundidade
  const layers = [
    { el: ellipse, depth: 10 },
    { el: patins, depth: 26, tilt: 6 },
    ...[...stars].map((el) => ({ el, depth: 40 })),
  ].map((layer) => ({
    ...layer,
    x: gsap.quickTo(layer.el, 'x', { duration: 0.8, ease: 'power3.out' }),
    y: gsap.quickTo(layer.el, 'y', { duration: 0.8, ease: 'power3.out' }),
    r: layer.tilt ? gsap.quickTo(layer.el, 'rotation', { duration: 0.8, ease: 'power3.out' }) : null,
  }));

  const hero = document.querySelector('.hero');

  hero.addEventListener('pointermove', (event) => {
    const relX = event.clientX / window.innerWidth - 0.5;
    const relY = event.clientY / window.innerHeight - 0.5;

    layers.forEach(({ x, y, r, depth, tilt }) => {
      x(relX * depth);
      y(relY * depth);
      r?.(relX * tilt);
    });
  });

  hero.addEventListener('pointerleave', () => {
    layers.forEach(({ x, y, r }) => {
      x(0);
      y(0);
      r?.(0);
    });
  });
}
