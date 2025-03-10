import { gsap } from '../../vendor.js'

let ctx

function init() {
  const visuals = document.querySelectorAll('[anm-before-after=visuals]')

  if (visuals.length === 0) return

  ctx = gsap.context(() => {
    visuals.forEach(visual => {
      const innerVisuals = visual.children
      const before = innerVisuals[0]
      const after = innerVisuals[1]

      // Set initial clip path to show bottom half of the after element
      gsap.set(after, {
        clipPath: `inset(50% 0 0 0)`,
      })

      // Create event listeners for mouse interaction
      visual.addEventListener('mousemove', e => {
        const bounds = visual.getBoundingClientRect()
        const y = e.clientY - bounds.top // mouse position relative to container
        const percentY = (y / bounds.height) * 100

        // Update clip path based on mouse position
        gsap.to(after, {
          clipPath: `inset(${percentY}% 0 0 0)`,
          duration: 0.5,
          ease: 'power2.out',
        })
      })

      visual.addEventListener('mouseleave', () => {
        gsap.killTweensOf(after)
        gsap.to(after, {
          clipPath: 'inset(50% 0 0 0)',
          duration: 1,
          ease: 'expo.out',
        })
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
