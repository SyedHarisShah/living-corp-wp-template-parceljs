import Page from '../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import File from '/src/js🧠🧠🧠/defaults/File.js'
import Form from './Form.js'

//COMPS

import * as Eta from 'eta'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }
  async generate(content) {
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    // //  console.log(data)
    var html = Eta.render(template,{global:this.main,data:data.acf,footer:this.footer})
    // //  console.log(html)
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')
      

    }
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    
    this.DOM.modal = document.documentElement.querySelector('.contactal')
    // //  console.log(this.DOM.modal)
    // //  console.log(this.DOM.modal.parentNode)
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    this.form = new Form(this.DOM.el.querySelector('.form'),this.main)
    this.DOM.tooltipclick = this.DOM.el.querySelector('.tooltip')
    this.DOM.tooltipmsg = this.DOM.el.querySelector('.tooltipmsg')
    this.DOM.tooltipclick.onclick = () =>{
      if(this.DOM.tooltipclick.classList.contains('act')){
        this.DOM.tooltipclick.classList.remove('act')
        this.DOM.tooltipmsg.classList.remove('act')
        this.DOM.tooltipmsg.style.height =''
      }
      else{
        this.DOM.tooltipclick.classList.add('act')
        this.DOM.tooltipmsg.classList.add('act')
        this.DOM.tooltipmsg.style.height = this.DOM.tooltipmsg.querySelector('.cover').clientHeight+'px'
      }
      setTimeout(()=>{
        this.resizeLimit()
      },610)
    }

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
    if(this.DOM.modal.classList.contains('contactal-act')){
      this.DOM.modal.classList.remove('contactal-act')
      await this.timeout(610)
      document.querySelector('.contactal').remove()
    }
    else{

      document.querySelector('.contactal').remove()
    }

    return super.hide()
  }
}
