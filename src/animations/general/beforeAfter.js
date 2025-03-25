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

      gsap.set(after, {
        clipPath: `inset(50% 0 0 0)`,
      })

      visual.addEventListener('mousemove', e => {
        handleInteraction(e, visual, after, 'mouse')
      })

      visual.addEventListener('touchmove', e => {
        handleInteraction(e, visual, after, 'touch')
      })

      visual.addEventListener('mouseleave', () => {
        resetClipPath(after)
      })

      visual.addEventListener('touchend', () => {
        resetClipPath(after)
      })
    })
  })
}

function handleInteraction(e, visual, after, eventType) {
  if (eventType === 'touch') {
    e.preventDefault()
  }

  const bounds = visual.getBoundingClientRect()

  const clientY = eventType === 'mouse' ? e.clientY : e.touches[0].clientY
  const y = clientY - bounds.top
  const percentY = (y / bounds.height) * 100

  gsap.to(after, {
    clipPath: `inset(${percentY}% 0 0 0)`,
    duration: 0.5,
    ease: 'power2.out',
  })
}

function resetClipPath(element) {
  gsap.killTweensOf(element)
  gsap.to(element, {
    clipPath: 'inset(50% 0 0 0)',
    duration: 1,
    ease: 'expo.out',
  })
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
