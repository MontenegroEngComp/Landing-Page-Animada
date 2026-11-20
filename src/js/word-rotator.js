import { gsap } from 'gsap';
import { debounce } from './utils.js';

const HOLD = 1.8; // segundos que cada palavra fica parada
const SLIDE = 0.8; // duração da troca

/**
 * Troca a palavra destacada do título (radical → divertida → saudável).
 * A primeira palavra é clonada no fim da lista para o loop não "pular",
 * e a largura do container acompanha a palavra atual para o texto
 * ao redor se ajustar com suavidade.
 */
export function initWordRotator({ reducedMotion = false } = {}) {
  const rotator = document.querySelector('[data-word-rotator]');
  if (!rotator) return;

  const track = rotator.querySelector('.word-rotator__track');
  track.append(track.firstElementChild.cloneNode(true));

  const words = [...track.children];
  const step = 100 / words.length;
  let timeline;

  function build() {
    const progress = timeline?.progress() ?? 0;
    timeline?.kill();

    const widths = words.map((word) => word.offsetWidth);
    gsap.set(rotator, { width: widths[0] });
    gsap.set(track, { yPercent: 0 });

    timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'expo.inOut' } });

    words.slice(1).forEach((_, index) => {
      const i = index + 1;
      const duration = reducedMotion ? 0 : SLIDE;

      timeline
        .to(track, { yPercent: -step * i, duration }, `+=${HOLD}`)
        .to(rotator, { width: widths[i], duration }, '<');
    });

    timeline.progress(progress);
  }

  // Espera as fontes carregarem para medir a largura real das palavras
  document.fonts.ready.then(() => {
    build();
    window.addEventListener('resize', debounce(build, 200));
  });
}
