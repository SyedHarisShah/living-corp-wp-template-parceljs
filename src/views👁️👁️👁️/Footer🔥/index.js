import Component from '/src/js🧠🧠🧠/defaults/Component'
import template from 'bundle-text:./template.eta'
import {gsap,Power2} from 'gsap'


import * as Eta from 'eta'

export default class extends Component {
  constructor (main) {
    super({
    })
    this.main = main
    this.string = Eta.render(template,{global:this.main})
  }

  async create () {
    
  }
}