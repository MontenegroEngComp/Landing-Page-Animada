import './styles/main.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { prefersReducedMotion } from './js/utils.js';
import { initSmoothScroll, initAnchorLinks } from './js/smooth-scroll.js';
import { playIntro } from './js/intro.js';
import { initWordRotator } from './js/word-rotator.js';
import { initHero } from './js/hero.js';
import { initMarquee } from './js/marquee.js';
import { initScrollReveal } from './js/scroll-reveal.js';
import { initHeader } from './js/header.js';
import { initMagnetic } from './js/magnetic.js';
import { initCart } from './js/cart.js';

gsap.registerPlugin(ScrollTrigger);

// Sempre começa no topo, para a animação de entrada fazer sentido
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const reducedMotion = prefersReducedMotion;

// Interações que funcionam com ou sem movimento reduzido
initHeader();
initCart({ reducedMotion });
initWordRotator({ reducedMotion });

if (reducedMotion) {
  // Sem rolagem suave, sem parallax e sem animações decorativas
  initAnchorLinks(null);
} else {
  const lenis = initSmoothScroll();
  initAnchorLinks(lenis);

  initMarquee();
  initScrollReveal();
  initMagnetic();

  playIntro().eventCallback('onComplete', initHero);
}

// Recalcula as posições quando as imagens e fontes terminam de carregar
window.addEventListener('load', () => ScrollTrigger.refresh());
