import Page from '../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import Register from './Register.js'

//COMPS

import * as Eta from 'eta'
import Register from './Register'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    // const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
    // const data = await response.json()
    // //  console.log(data)
    this.job = content
    // //  console.log(this.job)
    var html = Eta.render(template,{global:this.main,data:this.id,footer:this.footer})
    // //  console.log(html)
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')
      

    }
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    
    this.DOM.modal = document.documentElement.querySelector('.applyal')
    this.form = new Register(this.DOM.el.querySelector('.apply_form'),this.main,this.job)
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    

    this.DOM.back = this.DOM.el.querySelector('.btnBack')
    this.backToJob =()=>{
      this.emit('toJob',content)
      // //  console.log('asasas')
    }
    this.DOM.back.addEventListener('click',this.backToJob)

  }

  async loadImages(){
    


  }
  
  callBacks(){
   
  }

  createAnimations () {
    
  }
  makeAnim(anim,y,ratio){

  }
  onResize(){
    
    return super.onResize()
  }
  
  
  smoothScroll(){
    if(this.isVisible==1){
      super.smoothScroll()
    }
    
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  async show () {
    await this.timeout(1)
    
    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0

    if(this.DOM.modal.classList.contains('applyal-act')){
      this.DOM.modal.classList.remove('applyal-act')
      await this.timeout(610)
      document.querySelector('.applyal').remove()
    }
    else{

      document.querySelector('.applyal').remove()
    }
    return super.hide()
  }
}
