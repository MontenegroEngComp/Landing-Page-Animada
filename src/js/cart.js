import { gsap } from 'gsap';

/**
 * "Comprar agora": uma miniatura do patins voa do hero até o carrinho
 * em arco, o ícone do carrinho balança, o contador sobe e um aviso
 * confirma a ação (também anunciado para leitores de tela).
 */
export function initCart({ reducedMotion = false } = {}) {
  const addButton = document.querySelector('[data-add-to-cart]');
  const cart = document.querySelector('[data-cart]');
  const counter = document.querySelector('[data-cart-count]');
  const toast = document.querySelector('[data-toast]');
  const product = document.querySelector('.hero__patins');
  if (!addButton || !cart || !counter) return;

  let count = Number(counter.textContent) || 0;
  let toastTimeline;

  gsap.set(toast, { xPercent: -50, y: 24 });

  function updateCount() {
    count += 1;
    counter.textContent = count;
    cart.setAttribute('aria-label', `Carrinho: ${count} ${count === 1 ? 'item' : 'itens'}`);

    if (reducedMotion) return;

    gsap
      .timeline()
      .fromTo(counter, { scale: 1.6 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      .fromTo(
        cart,
        { rotation: -14 },
        { rotation: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.3)' },
        0,
      );
  }

  function showToast(message) {
    toast.textContent = message;
    toastTimeline?.kill();

    toastTimeline = gsap
      .timeline()
      .to(toast, { autoAlpha: 1, y: 0, duration: reducedMotion ? 0 : 0.5, ease: 'back.out(1.6)' })
      .to(toast, { autoAlpha: 0, y: 24, duration: reducedMotion ? 0 : 0.4, ease: 'power2.in' }, '+=2.2');
  }

  function flyToCart(onArrive) {
    const from = product.getBoundingClientRect();
    const to = cart.getBoundingClientRect();

    const clone = product.cloneNode();
    clone.className = 'fly-item';
    clone.alt = '';
    document.body.append(clone);

    const size = 72;
    const startX = from.left + from.width / 2 - size / 2;
    const startY = from.top + from.height / 2 - size / 2;
    const endX = to.left + to.width / 2 - size / 2;
    const endY = to.top + to.height / 2 - size / 2;

    gsap.set(clone, { x: startX, y: startY, scale: 2.2, rotation: -10 });

    gsap
      .timeline({
        onComplete: () => {
          clone.remove();
          onArrive();
        },
      })
      .to(clone, { x: endX, duration: 0.9, ease: 'power1.inOut' }, 0)
      .to(clone, { y: endY, duration: 0.9, ease: 'back.in(1.4)' }, 0)
      .to(clone, { scale: 0.3, rotation: 20, duration: 0.9, ease: 'power2.in' }, 0)
      .to(clone, { autoAlpha: 0, duration: 0.15 }, 0.8);
  }

  addButton.addEventListener('click', () => {
    // Garante que o carrinho fique visível mesmo com o header escondido
    document.querySelector('[data-header]')?.classList.remove('is-hidden');

    if (reducedMotion || !product) {
      updateCount();
    } else {
      flyToCart(updateCount);
    }

    showToast('Patins adicionado ao carrinho!');
  });
}
