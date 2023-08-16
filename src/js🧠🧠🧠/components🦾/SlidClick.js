
import {gsap,Power2} from 'gsap'
import SplitType from 'split-type'
export default class {
  constructor (element,isActive) {


    this.el = element
    this.elsleft = this.el.querySelectorAll('.left_el')
    this.elsright = this.el.querySelectorAll('.right_el')

    this.elsclick = this.el.querySelectorAll('.pgel')
    this.pos = -1
    this.length = this.elsright.length

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
    
    this.start()
    this.initEvents()
    
  }

  start(){

    this.change(0)
  }
  change(key){
    if(this.pos>-1){
      
      
      this.elsleft[this.pos].classList.remove('active')
      this.elsright[this.pos].classList.remove('active')
      this.elsclick[this.pos].classList.remove('act')
      this.tweens[this.pos].reverse()
    }

    this.pos = key
    
    
    

    this.elsleft[this.pos]?.classList.add('active')
    this.elsright[this.pos]?.classList.add('active')
    this.elsclick[this.pos]?.classList.add('act')
    setTimeout(()=>{

      this.tweens[this.pos].tweenTo('end')
    },600)
    
  }
  stop(){
    if(this.active == 0){
      return false
    }
    this.active = 0
    clearInterval(this.intervalSlide)
  }
  
  initEvents(){
    for(let [key,el] of this.elsclick.entries()){
      el.addEventListener('click',()=>this.change(key))
    }

  }
  removeEvents(){

  }
  
  
}
