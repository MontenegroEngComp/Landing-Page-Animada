import { gsap } from 'gsap';

/**
 * Animação de entrada da página: header desce, o título sobe linha por linha,
 * o círculo cresce com efeito elástico, o patins "cai" no lugar e as estrelas
 * aparecem girando. Retorna a timeline para que outras animações possam
 * começar quando ela terminar.
 */
export function playIntro() {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('.hero');
  const lines = hero.querySelectorAll('.hero__line-inner');
  const actions = hero.querySelectorAll('.hero__actions > *');
  const ellipse = hero.querySelector('.hero__ellipse');
  const patins = hero.querySelector('[data-patins]');
  const stars = hero.querySelectorAll('.hero__stars');

  gsap.set([header, hero], { visibility: 'visible' });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 } });

  tl.from(header, { yPercent: -100, duration: 0.9 })
    .from(lines, { yPercent: 110, stagger: 0.12 }, 0.15)
    .from(actions, { y: 32, autoAlpha: 0, stagger: 0.1, clearProps: 'transform' }, 0.55)
    .from(ellipse, { scale: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, 0.25)
    .from(
      patins,
      { y: -160, rotation: -28, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)' },
      0.45,
    )
    .from(
      stars,
      { scale: 0, rotation: -120, autoAlpha: 0, stagger: 0.12, ease: 'back.out(2.5)', duration: 0.8 },
      0.95,
    );

  return tl;
}
