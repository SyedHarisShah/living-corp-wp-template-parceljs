import Component from '/src/js🧠🧠🧠/defaults/Component'
import template from 'bundle-text:./template.eta'
import audio from '/src/js🧠🧠🧠/defaults/Audio'


import * as Eta from 'eta'

export default class extends Component {
  constructor (main) {
    super({
    })

    this.main = main
    this.create()
  }

  async create () {
    const string = Eta.render(template,{global:this.main})
    document.querySelector('body').insertAdjacentHTML('afterbegin',string)
    
    this.DOM = {
      el:document.querySelector('.player'),
      
      
    }
    this.audio = new audio(this.DOM.el)
  }
  async start(el){
    this.DOM.el.classList.add('act')
    this.audio.reset(el)

  }
}