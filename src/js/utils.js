/** Usuário pediu ao sistema para reduzir animações. */
export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Dispositivo com mouse (hover real e ponteiro preciso). */
export const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Executa `fn` só depois que os eventos param de chegar por `wait` ms. */
export function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
