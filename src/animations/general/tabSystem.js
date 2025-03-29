import { gsap } from '../../vendor.js'

let ctx

function init() {
  const wrappers = document.querySelectorAll('[data-tabs="wrapper"]')

  wrappers.forEach(wrapper => {
    const contentItems = wrapper.querySelectorAll('[data-tabs="content-item"]')
    const visualItems = wrapper.querySelectorAll('[data-tabs="visual-item"]')

    const autoplay = wrapper.dataset.tabsAutoplay === 'true'
    const autoplayDuration = parseInt(wrapper.dataset.tabsAutoplayDuration) || 5000
    const hoverDelay = parseInt(wrapper.dataset.tabsHoverDelay) || 0 // Reduced hover delay for better responsiveness

    let activeContent = null
    let activeVisual = null
    let autoplayTimeout = null
    let progressBarTween = null
    let hoverTimeout = null
    let isAnimating = false
    let pendingSwitchIndex = null
    let animationQueue = [] // New queue for tracking rapid tab switch requests

    function handleAutoplay(index) {
      clearTimeout(autoplayTimeout)
      if (!autoplay) return

      autoplayTimeout = setTimeout(() => {
        const nextIndex = (index + 1) % contentItems.length
        switchTab(nextIndex)
      }, autoplayDuration)
    }

    function updateProgressBar(index) {
      if (!autoplay) return

      if (progressBarTween) progressBarTween.kill()
      const bar = contentItems[index].querySelector('[data-tabs="item-progress"]')
      if (!bar) return

      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })
      progressBarTween = gsap.to(bar, {
        scaleX: 1,
        duration: autoplayDuration / 1000,
        ease: 'linear',
      })
    }

    function processNextInQueue() {
      // Process the most recent request in the queue
      if (animationQueue.length > 0) {
        const nextIndex = animationQueue.pop() // Get the most recent request
        animationQueue = [] // Clear any other queued items

        // Only switch if it's not the current tab
        if (contentItems[nextIndex] !== activeContent) {
          performTabSwitch(nextIndex)
        } else {
          isAnimating = false
        }
      } else {
        isAnimating = false
      }
    }

    function switchTab(index) {
      // Always add the requested tab to the queue
      if (!animationQueue.includes(index)) {
        animationQueue.push(index)
      }

      // If already animating, let the current animation finish
      if (isAnimating) {
        return
      }

      // Prevent switching to the same tab
      if (contentItems[index] === activeContent) return

      // Process this tab switch immediately
      performTabSwitch(index)
    }

    function performTabSwitch(index) {
      isAnimating = true

      // Remove this index from the queue
      animationQueue = animationQueue.filter(i => i !== index)

      // Kill any existing animations
      if (progressBarTween) progressBarTween.kill()
      gsap.killTweensOf(visualItems)
      gsap.killTweensOf(contentItems)

      const outgoingContent = activeContent
      const outgoingVisual = activeVisual
      const incomingContent = contentItems[index]
      const incomingVisual = visualItems[index]

      // Update active states
      outgoingContent?.classList.remove('active')
      outgoingVisual?.classList.remove('active')
      incomingContent.classList.add('active')
      incomingVisual.classList.add('active')

      // Set initial state for incoming visual
      gsap.set(incomingVisual, { autoAlpha: 0, xPercent: 2 })

      // Even faster animations for rapid switching
      const tl = gsap.timeline({
        defaults: { duration: 0.2, ease: 'power1.out' }, // Faster, simpler easing
        onComplete: () => {
          activeContent = incomingContent
          activeVisual = incomingVisual

          // Check if we need to process another tab in the queue
          if (animationQueue.length > 0) {
            processNextInQueue()
          } else {
            isAnimating = false
            updateProgressBar(index)
            handleAutoplay(index)
          }
        },
      })

      // Animate outgoing visual with faster timing
      if (outgoingVisual) {
        tl.to(
          outgoingVisual,
          {
            autoAlpha: 0,
            xPercent: -2,
            duration: 0.15, // Even faster fade out
          },
          0
        )
      }

      // Faster animation for incoming visual
      tl.to(
        incomingVisual,
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: 0.2,
        },
        0.05
      ) // Reduced delay
    }

    // Initialize hover events with improved handling for rapid movements
    let lastHoveredIndex = -1

    contentItems.forEach((item, i) => {
      item.addEventListener('mouseenter', () => {
        lastHoveredIndex = i
        clearTimeout(hoverTimeout)

        // Immediate switch for better responsiveness with very fast movements
        hoverTimeout = setTimeout(() => {
          if (i === lastHoveredIndex && item !== activeContent) {
            switchTab(i)
          }
        }, hoverDelay)
      })

      // Handle autoplay pause/resume on hover
      if (autoplay) {
        item.addEventListener('mouseenter', () => {
          if (progressBarTween) progressBarTween.pause()
          clearTimeout(autoplayTimeout)
        })

        item.addEventListener('mouseleave', () => {
          if (item === activeContent && progressBarTween) {
            progressBarTween.play()
          }
          handleAutoplay(Array.from(contentItems).indexOf(activeContent))
        })
      }
    })

    // Prevent accidental tab changes when moving mouse between tabs
    wrapper.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimeout)
      lastHoveredIndex = -1
    })

    // Initialize first tab - make sure visuals are properly set up initially
    visualItems.forEach((visual, i) => {
      gsap.set(visual, {
        autoAlpha: i === 0 ? 1 : 0,
        xPercent: i === 0 ? 0 : 2,
      })
    })
    switchTab(0)
  })
}

function cleanup() {
  ctx && ctx.revert()
}

export default {
  init,
  cleanup,
}
