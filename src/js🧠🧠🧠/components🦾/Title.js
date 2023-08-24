import SplitType from 'split-type'
import { gsap,Power2 } from 'gsap'

// const wrapLines = (arr, wrapType, wrapClass) => {
//   arr.forEach(el => {
//       const wrapEl = document.createElement(wrapType)
//       wrapEl.classList = wrapClass
//       el.parentNode.appendChild(wrapEl)
//       wrapEl.appendChild(el)
//   });
// }


export default class {
    constructor(element) {
        this.DOM = {
            el: element
        };

        this.SplitTypeInstance = new SplitType(this.DOM.el, { types: 'lines,words' })
        // wrapLines(this.SplitTypeInstance.lines, 'div', 'lhold')

        // //  console.log(this.SplitTypeInstance)
        this.start()
        this.initEvents()
    }

    start() {
      this.isVisible = true
    
      gsap.killTweensOf(this.SplitTypeInstance.words)
    // //  console.log(this.SplitTypeInstance)
      this.inTimeline = gsap.timeline({paused:true})
      for(let [index,s] of this.SplitTypeInstance.words.entries()){
        this.inTimeline.set(s,{yPercent:120},'start')
        this.inTimeline.to(s,{yPercent:0,duration:.6,delay:index*.1,ease:Power2.easeInOut},'anim')
      }
      this.inTimeline.play()
    }

    stop() {
        this.isVisible = false

    }
    initEvents() {
        window.addEventListener('resize', () => {
            this.SplitTypeInstance.split()

            // wrapLines(this.SplitTypeInstance.lines, 'div', 'oh')
                
            if ( !this.isVisible ) {

            }
        })
    }
    removeEvents(){

    }
}