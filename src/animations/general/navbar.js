import { gsap } from '../../vendor.js'

let ctx

function init() {
  const logo = document.querySelector('[anm-nav=logo]')

  ctx = gsap.to(logo, {
    width: '4rem',
    height: '4rem',
    duration: 0.75,
    ease: 'back.inOut(3)',
    scrollTrigger: {
      trigger: 'body',
      start: 'top -100px',
      end: 'top -200px',
      toggleActions: 'play none none reverse',
    },
  })
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
