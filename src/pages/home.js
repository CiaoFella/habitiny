import tabSystem from '../animations/general/tabSystem.js'
import shared from '../animations/shared.js'
import { gsap } from '../vendor.js'

function init() {
  shared.init()
  tabSystem.init()
}

function cleanup() {
  shared.cleanup()
  tabSystem.cleanup()
}

export default {
  init,
  cleanup,
}
