
import {gsap,Power2} from 'gsap'
import SplitType from 'split-type'
export default class {
  constructor (element) {


    this.el = element
    this.left = this.el.querySelector('.left')
    this.right = this.el.querySelector('.right .right_el')

    this.pos = -1

    this.splits = []
    this.tweens = []
    if(this.el.querySelectorAll('.tit1')){
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
    }
    this.active = 0
    this.start()
    this.initEvents()
    
  }

  start(){
    if(this.pos==-1){

      this.change()
      setTimeout(()=>{
        this.el.classList.add('delayed')
      },3000)
    }
    this.active = 1
    
  }
  change(){
    

    this.left?.classList.add('active')
    this.right?.classList.add('active')
    if(this.tweens.length>0){
      setTimeout(()=>{
        this.tweens[0].tweenTo('end')
      },600)
    }
  }
  stop(){
    if(this.active == 0){
      return false
    }
    this.active = 0
  }
  
  initEvents(){
   
  }
  removeEvents(){

  }
  
  
}
