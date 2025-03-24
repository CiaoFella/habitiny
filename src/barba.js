import { closeMenu } from './utilities/helper.js'
import { proxy } from './utilities/pageReadyListener.js'
import locomotiveScroll from './utilities/smoothScroll.js'
import { gsap, barba, ScrollTrigger } from './vendor.js'

gsap.registerPlugin(ScrollTrigger)

const mm = gsap.matchMedia()

barba.hooks.before(data => {
  data.next.container.classList.add('is-animating')
})

barba.hooks.after(data => {
  data.next.container.classList.remove('is-animating')
})

barba.init({
  preventRunning: true,
  transitions: [
    {
      name: 'default-transition',
      sync: true,
      debug: true,
      leave(data) {
        const done = this.async()

        closeMenu()

        const overlay = document.querySelector('[anm-overlay=transition]')

        const tl = gsap.timeline({
          onStart: () => {
            locomotiveScroll.stop()
            gsap.set(overlay, { display: 'block' })
          },
          onComplete: () => {
            locomotiveScroll.start()
            locomotiveScroll.scrollTo(0, { immediate: true })
          },
          defaults: { duration: 1, ease: 'back.inOut' },
        })

        proxy.pageReady = false

        tl.fromTo(data.current.container, { scaleX: 1 }, { scaleX: 0.95, y: '-5%' })
          .fromTo(overlay, { opacity: 0 }, { opacity: 0.75 }, '<')
          .call(() => done(), [], '>')
      },
      enter(data) {
        const overlay = document.querySelector('[anm-overlay=transition]')

        const done = this.async()

        const tl = gsap.timeline({
          defaults: { duration: 0.5, delay: 0.25, ease: 'power3.out' },
          onStart: () => {
            locomotiveScroll.scrollTo(0, { immediate: true })
          },
        })
        const currentWindowHeight = window.innerHeight
        // prettier-ignore
        tl.fromTo( data.next.container, {
            clipPath: `polygon(0px ${currentWindowHeight}px, 100% ${currentWindowHeight}px, 100% ${currentWindowHeight}px, 0px ${currentWindowHeight}px)`,
          },
          {
            clipPath: `polygon(0px 0px, 100% 0px, 100% ${currentWindowHeight}px, 0px ${currentWindowHeight}px)`,
            ease: 'expo.out',
            duration: 0.75,
            onComplete: () => {
              gsap.set(data.next.container, { clearProps: true })
              gsap.set(overlay, { display: 'none' })
              done()
            },
          }
        )
      },
      before(data) {
        data.next.container.classList.add('is-animating')
      },
      after(data) {
        data.next.container.classList.remove('is-animating')
      },
    },
  ],
  views: [
    {
      namespace: 'home',
      beforeEnter({ next }) {
        // Additional logic for home page before entering
      },
    },
    {
      namespace: 'about',
      beforeEnter({ next }) {
        // Additional logic for about page before entering
      },
    },
    {
      namespace: 'contact',
      beforeEnter({ next }) {
        // Additional logic for contact page before entering
      },
    },
  ],
})

export default barba
