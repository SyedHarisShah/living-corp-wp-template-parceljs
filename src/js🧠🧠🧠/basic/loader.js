import gsap from 'gsap'

import Component from '../defaults/Component'

export default class extends Component {
  constructor () {
    super({
      element: document.documentElement,
    })

    this.counter = 0
    this.index = 0

    this.onComplete()
  }

  onComplete () {
    let string = '<div class="loader"></div>'
    document.querySelector('body').insertAdjacentHTML('afterbegin',string)
    this.emit('complete')
    
    // this.timeline = gsap.timeline()

    // this.timeline.to(this.element, {
    //   autoAlpha: 0,
    //   duration: 1
    // })

    // this.timeline.call(_ => {
    //   console.log('compit')
    //   this.emit('complete')
    // })
  }
}
