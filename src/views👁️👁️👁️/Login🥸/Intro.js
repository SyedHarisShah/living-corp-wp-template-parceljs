
import {gsap,Power2} from 'gsap'
import SplitType from 'split-type'
export default class {
  constructor (element,isActive) {


    this.el = element
    this.elsleft = this.el.querySelectorAll('.right_tabs_el')
    this.elsimages = this.el.querySelectorAll('.left_el')
    this.selectors = this.el.querySelectorAll('.tabselector')

    this.pos = -1
    this.length = this.elsimages.length-1
    this.borders = this.el.querySelectorAll('.border')
    this.bgs = this.el.querySelectorAll('.bgop')

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
    console.log(isActive)
    if(isActive==2){
      this.active = 2
    }
    this.initEvents()
    
  }

  start(){
    if(this.active == 1){
      return false
    }
    if(this.pos==-1){
      if(this.active!=0){
        this.change(this.active)
        setTimeout(()=>{
          this.el.classList.add('delayed')
        },3000)

      }
      else{
        this.change()
        setTimeout(()=>{
          this.el.classList.add('delayed')
        },3000)

      }
    }
    this.active = 1



    // this.intervalSlide = setInterval(()=>{
      
    //   gsap.set(this.total,{width:0+'%',opacity:1,
        
    //     onComplete:()=>{

          
    //       if(this.poscontroler.querySelector('.out')){
    //         this.poscontroler.querySelector('.out').remove()
    //       }
    //     }
    //   })
    //   this.change()
    // }, 5600)
    this.changeTab =(i)=>{
      this.change(i)
    }

    for(let [index,el] of this.selectors.entries()){
      el.addEventListener('click',()=>this.changeTab(index))
    }

  }
  change(num=null){
    if(this.pos>-1){
      
      gsap.to(this.borders[this.pos],{width:'0%',height:'0%',duration:.6,delay:.6,ease:'bounceNew'})
      gsap.to(this.elsimages[this.pos],{"clip-path": "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",duration:.6,delay:.6,ease:'bounceNew'})
      this.elsleft[this.pos].classList.remove('active')
      this.elsimages[this.pos].classList.remove('active')
      this.borders[this.pos].classList.remove('active')
      this.bgs[this.pos].classList.remove('active')
      this.selectors[this.pos].classList.remove('act')
      this.tweens[this.pos].reverse()
    }
    if(num==null){
      if(this.pos < this.length){
        this.pos++
      }
      else{
        this.pos = 0
      }
    }
    else{
      this.pos=num
    }
    console.log(this.pos+'asa')

    this.elsleft[this.pos].classList.add('active')
    this.elsimages[this.pos].classList.add('active')
    this.borders[this.pos].classList.add('active')
    this.bgs[this.pos].classList.add('active')
    this.selectors[this.pos].classList.add('act')
    setTimeout(()=>{

      this.tweens[this.pos].tweenTo('end')
    },600)
    gsap.to(this.borders[this.pos],{width:'80%',height:'80%',duration:1.4,delay:.3,ease:'bounceNew'})
    gsap.to(this.elsimages[this.pos],{"clip-path": "polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)",duration:1.4,delay:.3,ease:'bounceNew'})
    
  }
  stop(){
    if(this.active == 0){
      return false
    }
    this.active = 0
  }
  
  initEvents(){
    // window.addEventListener('blur',this.stop)
    // window.addEventListener('focus',this.start)
    


  }
  removeEvents(){

  }
  
  
}
