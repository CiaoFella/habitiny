import { gsap, SplitType } from '../../vendor.js'

let ctx

function init() {
  const wrappers = document.querySelectorAll('[anm-expandables=wrap]')

  if (wrappers.length === 0) return

  ctx = gsap.context(() => {
    wrappers.forEach(wrapper => {
      const items = wrapper.querySelectorAll('[anm-expandable=item]')
      const expandFirstValue = wrapper.getAttribute('anm-expand-first')
      const expandFirstByDefault = expandFirstValue === 'true'

      items.forEach((item, index) => {
        const text = item.querySelector('[anm-expandable=text]')

        if (expandFirstByDefault && index === 0) {
          item.classList.add('is-active')
        }

        item.addEventListener('click', () => {
          item.classList.toggle('is-active')
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
