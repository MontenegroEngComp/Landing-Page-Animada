import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Animações disparadas pela rolagem:
 * - títulos com [data-reveal] sobem com fade;
 * - cada linha da galeria revela os cards vindos de lados opostos,
 *   com uma máscara (clip-path) que abre a partir do centro;
 * - as fotos têm parallax dentro do card;
 * - o rodapé entra em cascata.
 */
export function initScrollReveal() {
  // Títulos
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (elements) =>
      gsap.from(elements, {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
      }),
  });

  // Linhas da galeria
  document.querySelectorAll('[data-gallery-row]').forEach((row) => {
    const cards = row.querySelectorAll('.photo-card');

    gsap.from(cards, {
      x: (i) => (i === 0 ? -80 : 80),
      scale: 0.92,
      clipPath: 'inset(12% 12% 12% 12% round 40px)',
      autoAlpha: 0,
      duration: 1.3,
      stagger: 0.15,
      ease: 'expo.out',
      clearProps: 'clipPath',
      scrollTrigger: {
        trigger: row,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // Parallax das fotos dentro dos cards
  document.querySelectorAll('.photo-card__media').forEach((media) => {
    gsap.fromTo(
      media,
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: media.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });

  // Rodapé
  const footer = document.querySelector('[data-footer]');
  if (footer) {
    gsap.from(footer.children, {
      y: 30,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 95%',
        once: true,
      },
    });
  }
}
