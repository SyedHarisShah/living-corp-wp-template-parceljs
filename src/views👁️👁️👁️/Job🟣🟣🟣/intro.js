
import {gsap,Power2} from 'gsap'
import SplitType from 'split-type'
export default class {
  constructor (element,isActive) {


    this.el = element
    this.elsleft = this.el.querySelectorAll('.left_el')
    this.elsright = this.el.querySelectorAll('.right_el')

    this.pos = -1
    this.length = this.elsright.length-1
    this.borders = this.el.querySelectorAll('.border')

    this.splits = []
    this.tweens = []
    let tw
    for(let [key,el] of this.el.querySelectorAll('.tit1').entries()){
      this.splits.push(new SplitType(el, { types: 'lines,words' }))
      tw = gsap.timeline({paused:true})
      for(let [index,s] of this.splits[key].words.entries()){
        gsap.set(s,{yPercent:120})
        tw.to(s,{yPercent:0,duration:.6,delay:index*.1,ease:Power2.easeInOut},'anim')
      }
      this.tweens.push(tw)
    }
    this.active = 0
    if(isActive==true){
      this.start()
    }
    this.initEvents()
    
  }

  start(){
    if(this.active == 1){
      return false
    }
    if(this.pos==-1){

      this.change()
      setTimeout(()=>{
        this.el.classList.add('delayed')
      },3000)
    }
    this.active = 1
  }
  change(){
    
    if(this.pos>-1){
      gsap.to(this.borders[this.pos],{width:'0%',height:'0%',duration:.6,delay:.6,ease:'bounceNew'})
      gsap.to(this.elsright[this.pos],{"clip-path": "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",duration:.6,delay:.6,ease:'bounceNew'})
      this.elsleft[this.pos].classList.remove('active')
      this.elsright[this.pos].classList.remove('active')
      this.borders[this.pos].classList.remove('active')
      this.tweens[this.pos].reverse()
    }

    if(this.pos < this.length){
      this.pos++
    }
    else{
      this.pos = 0
    }
    

    this.elsleft[this.pos].classList.add('active')
    this.elsright[this.pos].classList.add('active')
    this.borders[this.pos].classList.add('active')
    setTimeout(()=>{

      this.tweens[this.pos].tweenTo('end')
    },600)
    gsap.to(this.borders[this.pos],{width:'80%',height:'80%',duration:1.4,delay:.3,ease:'bounceNew'})
    gsap.to(this.elsright[this.pos],{"clip-path": "polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)",duration:1.4,delay:.3,ease:'bounceNew'})
    
  }
  stop(){
    if(this.active == 0){
      return false
    }
    this.active = 0
    clearInterval(this.intervalSlide)
  }
  
  initEvents(){
    // window.addEventListener('blur',this.stop)
    // window.addEventListener('focus',this.start)
    

  }
  removeEvents(){

  }
  
  
}
