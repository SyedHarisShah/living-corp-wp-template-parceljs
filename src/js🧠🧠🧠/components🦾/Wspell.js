
import Component from '/src/js🧠🧠🧠/defaults/Component'

import {gsap,Power3,Power0} from 'gsap'


export default class {
  constructor (element,isDelay = false,plusDelay = 0) {


    this.el = element
    if(isActive==false){

    }
    else{

    }
    this.active = 0
    this.isDelay = isDelay
    this.plusDelay = plusDelay
    this.create()
    
    this.initEvents()
  }

  async create () {
    var msg = this.el.textContent
    msg = msg.substring(0,msg.length)
    // to char array
    msg = msg.split('')

    this.el.innerHTML = "<span>" + msg.join("</span><span>") + "</span>"

    if(this.isDelay==true){
      let ran = 0
      for(let s of this.el.querySelectorAll('span') ){
        ran = Math.floor(Math.random() * (40 - 10)) + 10
        s.style.transition='.6s opacity '+((ran*0.01)+this.plusDelay)+'s ease'
      }
    }
    else{
      this.makeRandom()
    }
    
    if(this.el.parentNode.querySelector('.line_fake')){
      this.el.parentNode.querySelector('.line_fake').innerHTML = "<span>" + msg.join("</span><span>") + "</span>"
      for(let s of this.el.parentNode.querySelectorAll('.line_fake span')){
        if(s.innerHTML==' '){
          s.innerHTML='&nbsp;'
        }
      }
    }
  }
  makeRandom(){
    let isVocal = ''
    let count = 0
      for(let s of this.el.querySelectorAll('span') ){
        isVocal = s.innerHTML
        if(isVocal.match(/[aeiouáéíóú]/gi) != null ){
          s.classList.add('voc')
          if(count <2){
            gsap.set(s,{opacity:1,yPercent:100})
            count++
          }
          else{
            count=0
            gsap.set(s,{opacity:1,yPercent:100})

          }
        }
        else if(isVocal==' '){
          s.innerHTML='&nbsp;'
        }
        else{
            gsap.set(s,{opacity:1,yPercent:100})

        }
      }
  }
  start(){
    let ran = 0
    let isVocal =''
      for(let s of this.el.querySelectorAll('span') ){
        ran = Math.floor(Math.random() * (40 - 20)) + 20
        isVocal = s.innerHTML
        if(isVocal.match(/[aeiouáéíóú]/gi) != null ){
          // ran+=4
          gsap.to(s,{duration:.6,delay:((ran)*.01)+.3,yPercent:0,ease:Power3.easeInOut})
        }
        else{

          gsap.to(s,{opacity:1,yPercent:0,duration:.6,ease:Power3.easeInOut})
        }
      }
      setTimeout(()=>{
        this.el.parentNode.parentNode.parentNode.classList.add('isOk')

      },1200)
      if(this.el.classList.contains('spell-hover')){
        setTimeout(()=>{
          this.el.parentNode.parentNode.parentNode.classList.add('isHover')

        },1200)
      }

  }
  stop(){
    let ran = 0
    for(let s of this.el.querySelectorAll('span') ){
      ran = Math.floor(Math.random() * (40 - 10)) + 10
      gsap.to(s,{delay:ran*0.01,opacity:0,ease:Power3.easeIn,
        onComplete:()=>{
          this.makeRandom()
        }
      })
    }
    if(this.el.classList.contains('spell-hover')){
      this.el.parentNode.parentNode.parentNode.classList.add('isHover')
    }
  }
  

  
  initEvents(){
    if(this.el.classList.contains('spell-hover')){
      this.el.addEventListener('mouseenter',()=>{
      })
      this.el.addEventListener('mouseleave',()=>{
        
      })
    }
  
  }
}
