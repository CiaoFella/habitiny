import beforeAfter from './general/beforeAfter.js'
import footer from './general/footer.js'
import marquee from './general/marquee.js'
import navbar from './general/navbar.js'
import expandable from './general/expandable.js'
import hoverScale from './general/hoverScale.js'
import hero from './shared/hero.js'

function init() {
  hero.init()
  footer.init()
  navbar.init()
  hoverScale.init()
  marquee.init()
  beforeAfter.init()
  expandable.init()
}

function cleanup() {
  hero.cleanup()
  footer.cleanup()
  navbar.cleanup()
  hoverScale.cleanup()
  marquee.cleanup()
  beforeAfter.cleanup()
  expandable.cleanup()
}

export default {
  init,
  cleanup,
}
