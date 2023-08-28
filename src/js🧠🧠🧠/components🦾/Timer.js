
import {gsap,Power2} from 'gsap'
import SplitType from 'split-type'
export default class {
  constructor (element,isActive) {


    this.el = element
    this.elsleft = this.el.querySelectorAll('.left_el')
    this.elsright = this.el.querySelectorAll('.right_el')

    this.total = this.el.querySelector('.total')
    this.poscontroler = this.el.querySelector('.timer_s')
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
    this.isworking=0
    if(isActive==true){
      // this.start()
    }
    this.initEvents()
    
  }

  start(num){
    // //  console.log('start'+num)
    if(num==1){
      this.isworking=1
    }
    if(num==null && this.isworking==0){
      return false
    }
    if(this.active == 1){
      return false
    }
    if(this.pos==-1){
        
      this.change()
      setTimeout(()=>{
        this.el.classList.add('delayed')
      },3000)
    }
    else{
      gsap.set(this.total,{width:0+'%',opacity:1})
      gsap.to(this.total,{opacity:0,duration:.5,delay:5,ease:Power2.linear})
      gsap.to(this.total,{width:100+'%',duration:5.5,ease:Power2.linear})

    }
    this.active = 1
    this.intervalSlide = setInterval(()=>{
      
      gsap.set(this.total,{width:0+'%',opacity:1,
        
        onComplete:()=>{

          
          if(this.poscontroler.querySelector('.out')){
            this.poscontroler.querySelector('.out').remove()
          }
        }
      })
      this.change()
    }, 5600)
  }
  change(){
    gsap.to(this.total,{opacity:0,duration:.5,delay:5,ease:Power2.linear})
    gsap.to(this.total,{width:100+'%',duration:5.5,ease:Power2.linear})
    if(this.pos>-1){
      
      this.poscontroler.querySelector('.active').classList.add('out')
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
    let num = this.pos+1
    if(num<10){
      num = '0'+num
    }
    const span = document.createElement('span')
    span.innerHTML = num
    this.poscontroler.appendChild(span)
    setTimeout(()=>{
      if(this.poscontroler.querySelector('span:not(.out)')){
        this.poscontroler.querySelector('span:not(.out)').classList.add('active')
      }
    },60)
    
    

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
    gsap.set(this.total,{width:0+'%',opacity:1})
    clearInterval(this.intervalSlide)
  }
  
  initEvents(){
    // window.addEventListener('blur',this.stop)
    // window.addEventListener('focus',this.start)
    this.checkVis = () =>{
      if(document.hidden) {
        this.stop()
      }
      else{
        this.start()
      }
    }

    document.addEventListener('visibilitychange',this.checkVis)

  }
  removeEvents(){

  }
  
  
}
