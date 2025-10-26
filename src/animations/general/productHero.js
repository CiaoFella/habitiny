import { gsap } from '../../vendor.js'
import { isMobile } from '../../utilities/variables.js'

let ctx
let animation
let mm

function init() {
  const heroWrap = document.querySelector('[data-anm-hero="product"]')

  if (!heroWrap) return

  mm = gsap.matchMedia()

  ctx = gsap.context(() => {
    const imgWrap = heroWrap.querySelector('[data-anm-hero="img-wrap"]')
    const imgTrack = heroWrap.querySelector('[data-anm-hero="img-track"]')

    if (!imgWrap || !imgTrack) return

    const originalImages = Array.from(imgTrack.querySelectorAll('.g_visual_wrap'))

    if (originalImages.length === 0) return

    // Store initial track height before duplication (for desktop)
    const initialTrackHeight = imgTrack.offsetHeight

    // Duplicate all images to create seamless loop
    originalImages.forEach(img => {
      const clone = img.cloneNode(true)
      imgTrack.appendChild(clone)
    })

    // Get all images (original + clones)
    const allImages = Array.from(imgTrack.querySelectorAll('.g_visual_wrap'))

    // Set flex: 1 on all images
    gsap.set(allImages, {
      flex: 1,
    })

    // Set overflow hidden on wrapper
    gsap.set(imgWrap, {
      overflow: 'hidden',
    })

    // Animation speed (pixels per second)
    const speed = 150

    // Mobile: Horizontal scroll with portrait ratio
    mm.add(isMobile, () => {
      // Swap ratio classes to portrait
      allImages.forEach(img => {
        img.classList.remove('u-ratio-16-9')
        img.classList.add('u-ratio-9-16')
      })

      // Calculate width of one set of images (4 original images)
      // We need to measure after ratio change
      let totalWidth = 0
      const originalCount = originalImages.length
      for (let i = 0; i < originalCount; i++) {
        totalWidth += allImages[i].offsetWidth
      }

      const duration = totalWidth / speed

      // Use simple seamless loop (same as desktop but horizontal)
      animation = gsap.fromTo(
        imgTrack,
        {
          x: 0,
        },
        {
          x: -totalWidth,
          duration: duration,
          ease: 'none',
          repeat: -1,
        }
      )
    })

    // Desktop/Tablet: Vertical scroll with landscape ratio
    mm.add(`(not ${isMobile})`, () => {
      // Ensure landscape ratio
      allImages.forEach(img => {
        img.classList.remove('u-ratio-9-16')
        img.classList.add('u-ratio-16-9')
      })

      const totalHeight = initialTrackHeight
      const duration = totalHeight / speed

      // Use simple seamless loop for desktop (works perfectly)
      animation = gsap.fromTo(
        imgTrack,
        {
          y: 0,
        },
        {
          y: -totalHeight,
          duration: duration,
          ease: 'none',
          repeat: -1,
        }
      )
    })
  }, heroWrap)
}

function cleanup() {
  if (animation) {
    animation.kill()
    animation = null
  }
  if (mm) {
    mm.revert()
    mm = null
  }
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
