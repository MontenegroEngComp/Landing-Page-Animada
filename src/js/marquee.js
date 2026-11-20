import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from './utils.js';

const BASE_SPEED = 60; // px por segundo
const MAX_BOOST = 6;
const MAX_SKEW = 8; // graus

/**
 * Faixa infinita "Patins ✦ Patins ✦ ...".
 * O grupo de itens é clonado até cobrir a tela e o movimento é feito no
 * ticker do GSAP com `wrap`, então o loop nunca tem emenda visível.
 * A rolagem da página muda a direção da faixa, acelera de acordo com a
 * velocidade e inclina levemente os itens.
 */
export function initMarquee() {
  const track = document.querySelector('[data-marquee]');
  if (!track) return;

  const original = track.querySelector('.marquee__group');
  let groupWidth = 0;
  let wrap;

  function fill() {
    track.querySelectorAll('.marquee__group:not(:first-child)').forEach((clone) => clone.remove());
    groupWidth = original.offsetWidth;

    const copies = Math.ceil(window.innerWidth / groupWidth) + 1;
    for (let i = 0; i < copies; i++) {
      track.append(original.cloneNode(true));
    }

    wrap = gsap.utils.wrap(-groupWidth, 0);
  }

  fill();
  window.addEventListener('resize', debounce(fill, 200));

  const setX = gsap.quickSetter(track, 'x', 'px');
  const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4, ease: 'power3.out' });

  let x = 0;
  let direction = -1;
  let boost = 0;

  gsap.ticker.add((_, deltaTime) => {
    const speed = BASE_SPEED * (1 + boost);
    x = wrap(x + direction * speed * (deltaTime / 1000));
    setX(x);
    boost *= 0.92;
  });

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const velocity = self.getVelocity();
      direction = self.direction === 1 ? -1 : 1;
      boost = Math.min(Math.abs(velocity) / 250, MAX_BOOST);
      skewTo(gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, velocity / -300));
    },
  });

  // Volta a inclinação para zero quando a rolagem para
  ScrollTrigger.addEventListener('scrollEnd', () => skewTo(0));
}
