import { gsap } from '../../vendor.js'

let ctx

function init() {
  const logo = document.querySelector('[anm-nav=logo]')
  const logoWidth = logo.getBoundingClientRect().width
  const logoHeight = logo.getBoundingClientRect().height

  ctx = gsap.to(logo, {
    width: logoWidth * 0.8,
    height: logoHeight * 0.8,
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
