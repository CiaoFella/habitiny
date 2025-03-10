import { gsap, SplitType } from '../../vendor.js'

let ctx

function init() {
  const wrappers = document.querySelectorAll('[anm-expandables=wrap]')

  if (wrappers.length === 0) return

  ctx = gsap.context(() => {
    wrappers.forEach(wrapper => {
      const items = wrapper.querySelectorAll('[anm-expandable=item]')

      items.forEach(item => {
        const text = item.querySelector('[anm-expandable=text]')
        const splitText = new SplitType(text, { types: 'lines' })

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
