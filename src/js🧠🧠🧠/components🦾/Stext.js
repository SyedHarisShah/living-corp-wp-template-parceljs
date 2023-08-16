
import Component from '/src/js🧠🧠🧠/defaults/Component'

import {gsap,Power3} from 'gsap'
import Prefix from 'prefix'


export default class extends Component {
  constructor (element) {
    super({
    })

    this.el = element
    this.real = element.querySelector('.Stext_real')
    this.fake = element.querySelector('.Stext_fake')

    this.active = 0
    this.speed = 1
    this.pos = 0
    this.control = {
      x:3
    }
    this.transform = Prefix('transform')
    
    this.create()
    this.initEvents()
    gsap.set(this.el.parentNode,{opacity:0,yPercent:50})
  }

  async create () {
    // this.real.appendChild(this.real.querySelector('.el').cloneNode(true));
    while(this.real.clientWidth < window.innerWidth){
      this.real.appendChild(this.real.querySelector('.el').cloneNode(true));
    }
    this.fake.innerHTML = this.real.innerHTML

  }

  start(){
    if(this.active == 1){
      setTimeout(()=>{
        this.active = 1
        this.animHover.play()
        
        gsap.to(this.el.parentNode,{opacity:1,yPercent:0,ease:Power3.easeInOut,duration:.6 })
      },600)
    }
    else{
      this.active = 1
      this.animHover.play()
      
      gsap.to(this.el.parentNode,{opacity:1,yPercent:0,ease:Power3.easeInOut,duration:.6 })
    }
    
  }

  stop(){

    this.animHover.pause()
    this.animHover.progress(0)
    this.active = 0
    // gsap.to(this.el.parentNode,{opacity:1,yPercent:0,ease:Power3.easeInOut,duration:.6,
    //   onComplete:()=>{
    //     this.animHover.pause()
    //     this.animHover.progress(0)
    //     this.active = 0
    //   } 
    // })
  }

  onResize(){

  }
  update(speed) {
    if(this.active == 1){
      this.speed = Math.abs(speed*.1)
      this.pos+=(this.speed+1.5) * this.control.x
      if(this.pos > this.real.clientWidth){
        this.pos=0;
      }
      this.el.style[this.transform] = `translate3d(-${this.pos}px,0, 0)`
      this.speed = 0
    }
  }
  destroy () {
    this.removeEventListeners()
  }
  initEvents(){
    this.animHover = gsap.timeline({paused:true})
    .to(this.control,{x:1,ease:Power3.easeInOut,duration:2})
      // this.animHover.play()
    this.mouseEnter = () =>{
      gsap.to(this.control,{x:0,duration:.6,ease:Power3.linear,
        
        onComplete:()=>{
        
        }
      })
    }
    this.el.addEventListener('mouseenter',this.mouseEnter)
    
    this.mouseLeave = () =>{
      // this.active = 1
      gsap.to(this.control,{x:1,duration:.6,ease:Power3.linear,
        
        onComplete:()=>{
        
        }
      })
    }
    this.el.addEventListener('mouseleave',this.mouseLeave)
  }
}
