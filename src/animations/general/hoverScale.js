import { gsap } from '../../vendor.js'

let ctx

function init() {
  const items = document.querySelectorAll('[anm-hover-scale=wrap]')

  if (items.length === 0) return

  ctx = gsap.context(() => {
    items.forEach(item => {
      const visual = item.querySelector('[anm-visual=wrap]')
      const tl = gsap.timeline({ defaults: { duration: 0.5 }, paused: true })

      tl.to(visual, { width: '115%', height: '115%' })

      item.addEventListener('mouseenter', () => {
        tl.play()
      })

      item.addEventListener('mouseleave', () => {
        tl.reverse()
      })
    })
  })
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
