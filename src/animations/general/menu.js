import { isMobile } from '../../utilities/variables.js'
import { gsap } from '../../vendor.js'

let ctx
let mm = gsap.matchMedia()

function init() {
  const section = document.querySelector('[anm-nav=wrap]')

  if (section) {
    const navbar = section.querySelector('[anm-nav=navbar]')
    const trigger = section.querySelector('[anm-nav=menu-trigger]')
    const flyout = section.querySelector('[anm-nav=flyout]')
    const burgerLine1 = section.querySelector('[anm-nav=burger-line-1]')
    const burgerLine2 = section.querySelector('[anm-nav=burger-line-2]')
    const flyoutItems = flyout.children

    const flyoutHeight = window.getComputedStyle(flyout).height
    const flyoutPaddingTop = window.getComputedStyle(flyout).paddingTop
    const flyoutPaddingBottom = window.getComputedStyle(flyout).paddingBottom

    gsap.set(flyout, { height: '0px', paddingTop: '0px', paddingBottom: '0px', overflow: 'hidden' })

    const navbarWidth = navbar.getBoundingClientRect().width

    let isAnimating = false

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
      },
    })

    mm.add(isMobile, () => {
      openTl.to(navbar, { width: '20rem', duration: 0.5, ease: 'back.inOut' }, 0)
    })
    openTl
      .to(
        flyout,
        {
          paddingTop: flyoutPaddingTop,
          paddingBottom: flyoutPaddingBottom,
          ease: 'back.out(1.2)',
          onStart: () => {
            gsap.set(flyout, { display: 'flex' })
          },
        },
        '>'
      )
      .to(flyout, { height: flyoutHeight, ease: 'back.out(1.2)' }, '<')
      .from(flyoutItems, { x: '2.5rem', stagger: 0.05, ease: 'back.out(1.5)' }, '<+0.25')
      .from(flyoutItems, { opacity: 0, stagger: 0.05 }, '<')
      .to(burgerLine1, { y: '3px', duration: 0.25, transformOrigin: 'center', ease: 'back.in(3)' }, '0')
      .to(burgerLine2, { y: '-3px', duration: 0.25, transformOrigin: 'center', ease: 'back.in(3)' }, '0')
      .to(burgerLine1, { rotate: 45, duration: 0.25, delay: 0.25, transformOrigin: 'center', ease: 'back.out(3)' }, '0')
      .to(
        burgerLine2,
        { rotate: -45, duration: 0.25, delay: 0.25, transformOrigin: 'center', ease: 'back.out(3)' },
        '0'
      )

    closeTl
      .to(burgerLine1, { rotate: 0, duration: 0.25, transformOrigin: 'center', ease: 'back.in(3)' }, '>')
      .to(burgerLine2, { rotate: 0, duration: 0.25, transformOrigin: 'center', ease: 'back.in(3)' }, '0')
      .to(burgerLine1, { y: '0px', duration: 0.25, delay: 0.25, transformOrigin: 'center', ease: 'back.out(3)' }, '0')
      .to(burgerLine2, { y: '0px', duration: 0.25, delay: 0.25, transformOrigin: 'center', ease: 'back.out(3)' }, '0')
      .to(flyout, { height: '0px', ease: 'back.in(1.2)' }, '<')
      .to(
        flyout,
        {
          paddingTop: '0px',
          paddingBottom: '0px',
          ease: 'back.in(1.2)',
          onComplete: () => {
            gsap.set(flyout, { display: 'none' })
          },
        },
        '<+10%'
      )
    mm.add(isMobile, () => {
      closeTl.to(navbar, { width: navbarWidth, duration: 0.5, ease: 'back.inOut' }, '>')
    })

    trigger.addEventListener('click', () => {
      if (isAnimating) return

      isAnimating = true

      flyout.classList.toggle('is-active')

      if (flyout.classList.contains('is-active')) {
        openTl.progress(0)
        closeTl.pause()
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
