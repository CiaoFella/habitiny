import { gsap } from '../../vendor.js'

let ctx

function init() {
  const houses = document.querySelectorAll('.unser_ansatz_visual_svg')

  houses.forEach(house => {
    const outerCircle = document.querySelector('.unser_ansatz_visual_outer')
    const outerCircleItems = outerCircle.children
    const letters = house.querySelectorAll('path:not(#housePath, #mouth)')
    const mouth = house.querySelector('#mouth')

    if (!house || !letters || !mouth) return

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        repeat: -1,
        yoyo: true,
      })

      tl.from(letters, {
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: 'back.inOut(5)',
        transformOrigin: 'center',
        stagger: 0.05,
      })

      gsap.set(mouth, {
        scale: 0,
        opacity: 1,
        transformOrigin: 'center center',
      })

      tl.to(
        mouth,
        {
          scale: 0.95,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          transformOrigin: 'center center',
        },
        '<+0.25'
      )

      gsap.to(outerCircle, {
        rotate: 360,
        duration: 20,
        ease: 'linear',
        repeat: -1,
      })

      gsap.to(outerCircleItems, {
        rotate: -360,
        duration: 20,
        ease: 'linear',
        repeat: -1,
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
