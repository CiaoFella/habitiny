import locomotiveScroll from '../../utilities/smoothScroll.js'
import { gsap } from '../../vendor.js'

let ctx

function init() {
  const section = document.querySelector('[anm-nav=wrap]')

  if (section) {
    const trigger = section.querySelector('[anm-nav=menu-trigger]')
    const flyout = section.querySelector('[anm-nav=flyout]')
    const burgerLine1 = section.querySelector('[anm-nav=burger-line-1]')
    const burgerLine2 = section.querySelector('[anm-nav=burger-line-2]')
    const flyoutItems = flyout.children

    const flyoutHeight = window.getComputedStyle(flyout).height
    const flyoutPaddingTop = window.getComputedStyle(flyout).paddingTop
    const flyoutPaddingBottom = window.getComputedStyle(flyout).paddingBottom

    gsap.set(flyout, { height: '0px', paddingTop: '0px', paddingBottom: '0px', overflow: 'hidden' })

    let isAnimating = false

    // Create the timelines outside the click handler but don't populate them yet
    const openTl = gsap.timeline({
      defaults: { duration: 0.5, ease: 'power2.inOut' },
      paused: true,
      onComplete: () => {
        isAnimating = false
      },
    })

    const closeTl = gsap.timeline({
      defaults: { duration: 0.5, ease: 'power2.inOut' },
      paused: true,
      onComplete: () => {
        isAnimating = false
        gsap.set(flyout, { display: 'none' })
      },
    })

    // Build the open timeline
    openTl
      .to(flyout, { paddingTop: flyoutPaddingTop, paddingBottom: flyoutPaddingBottom })
      .to(flyout, { height: flyoutHeight }, '<')
      .from(flyoutItems, { x: '2.5rem', stagger: 0.05, ease: 'power2.out' }, '<+0.25')
      .from(flyoutItems, { opacity: 0, stagger: 0.05 }, '<')
      .to(burgerLine1, { y: '3px', duration: 0.25, transformOrigin: 'center' }, '0')
      .to(burgerLine2, { y: '-3px', duration: 0.25, transformOrigin: 'center' }, '0')
      .to(burgerLine1, { rotate: 45, duration: 0.25, delay: 0.25, transformOrigin: 'center' }, '0')
      .to(burgerLine2, { rotate: -45, duration: 0.25, delay: 0.25, transformOrigin: 'center' }, '0')

    // Build the close timeline
    closeTl
      .to(burgerLine1, { rotate: 0, duration: 0.25, transformOrigin: 'center' }, '0')
      .to(burgerLine2, { rotate: 0, duration: 0.25, transformOrigin: 'center' }, '0')
      .to(burgerLine1, { y: '0px', duration: 0.25, delay: 0.25, transformOrigin: 'center' }, '0')
      .to(burgerLine2, { y: '0px', duration: 0.25, delay: 0.25, transformOrigin: 'center' }, '0')
      .to(flyout, { height: '0px' }, '<')
      .to(flyout, { paddingTop: '0px', paddingBottom: '0px' }, '<+25%')

    trigger.addEventListener('click', () => {
      if (isAnimating) return

      isAnimating = true

      flyout.classList.toggle('is-active')

      if (flyout.classList.contains('is-active')) {
        openTl.progress(0)
        closeTl.pause()
        gsap.set(flyout, { display: 'flex' })
        openTl.play()
      } else {
        closeTl.progress(0)
        openTl.pause()
        closeTl.play()
      }
    })
  }
}

function cleanup() {
  if (ctx) {
    ctx.revert()
  }
}

export default {
  init,
  cleanup,
}
