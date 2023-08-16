import AutoBind from 'auto-bind'
import EventEmitter from 'events'


import Prefix from 'prefix'
import {gsap} from 'gsap'
import { clamp, lerp } from '../basic/math.js'



export default class extends EventEmitter {
  constructor (main,footer) {
    super()

    AutoBind(this)

    this.content = document.querySelector("#content"),
    this.main = main
    this.footer = footer
    this.speed = 0
    this.isVisible = 0
    this.isScrollable = 1

    this.sticks = []
    this.anims = []
    
    this.isAutoScroll = 0
    this.transform = Prefix('transform')
  }
  
  timeout(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async create (content,main) {
    //Genera HTML
    this.sticks = []
    this.anims = []
    this.main=main
    if(this.generate){
      await this.generate(content)
      if(!this.main.isTouch){
        gsap.set(this.DOM.el,{y:window.innerHeight+'px'})

      }
      else{
        gsap.set(this.DOM.el,{position:'fixed',left:0,top:0,width:'100%',y:window.innerHeight+'px'})

      }
    }
    //Genera elementos animaciones

    //Si tiene scroll, añade asscroll
    // await this.timeout(400)
    
    if(!this.main.isTouch){
      await this.createScroll()
    }
    else{
      this.avoidScroll = 1
      this.scroll = {
        ease: 0.1,
        position: 0,
        current: 0,
        target: 0
      }

      await this.callBacks()
    }

  }
  //Scroll
  buildThresholdList(numSteps) {
    var thresholds = [];
  
    for (var i=1.0; i<=numSteps; i++) {
      var ratio = i/numSteps;
      thresholds.push(ratio);
    }
  
    thresholds.push(0);
    return thresholds;
  }

  createScroll() {
    if (this.isScrollable) {
        this.size = this.DOM.el.clientHeight - window.innerHeight
        
        this.scroll = {
          ease: 0.32,
          position: 0,
          current: 0,
          target: 0,
          limit: this.size
        }
    }

    this.callBacks()
  }


  resetGlobal(){
    this.emit('globalchange')

  }

  callBacks(){
    this.callback = (entries,observer) =>{
      entries.forEach(entry=>{
        if(!entry.target.dataset.pos){
          return false
        }
        const pos = entry.target.dataset.pos
        const id = this.anims[pos].id.substring(0, 1);
        
        if(!entry.isIntersecting){
          if(this.anims[pos].active==true && this.anims[pos].animated==1){
            if(id=='s'){

              this.anims[pos].stick.active = 0
              let index = this.sticks.indexOf(this.anims[pos])
              if (index > -1) {
                this.sticks.splice(index, 1)
              }

            }
          }
          this.anims[pos].active = false
        }
        else if(entry.isIntersecting){
          if(this.anims[pos].active==false && this.anims[pos].animated==1){
            if(id=='s'){
              this.anims[pos].stick.active = 1
              this.sticks.push(this.anims[pos])
            }
          }
          else if(this.anims[pos].active==false && this.anims[pos].animated==2){

          }
          this.anims[pos].active = true
          if(this.anims[pos].animated==2){
            this.makeAnim(this.anims[pos],(entry.boundingClientRect.y).toFixed(0),entry.intersectionRatio)
          }
          else if(this.anims[pos].animated==0){
            if(entry.intersectionRatio > 0.8){
              entry.target.classList.add('inview')
              if(this.anims[pos].classel!=null){
                this.anims[pos].classel.start()
              }
              this.observer.unobserve(entry.target)
            }
          }
        }
      })
    }
    
    if(this.main.isTouch){
      this.optionsob = {
        root:document.body,
        threshold:this.buildThresholdList(500)
      };
    }
    else{
      this.optionsob = {
        root:null,
        threshold:this.buildThresholdList(500)
      };
    }
    this.observer = new IntersectionObserver(this.callback,this.optionsob)
    if(this.DOM.watchers){
      this.DOM.watchers.forEach((el)=>{
        this.observer.observe(el)
      })
    }
  }


  /**
   * Animations.
   */
  
   makeAnim(anim,y,ratio){
    const id = anim.id.substring(0, 1);
    let prog = 0
    //HAY que hacer algo con esto, que si no tiene el tamaño de la pantalla,peta
    if(y < 0){
      prog = 1-(ratio/2)
    }
    else{
      prog = (ratio/2)
    }
    
  }

  createAnimations () {
    if(this.DOM.watchers){
      for(let[index,anim] of this.DOM.watchers.entries()){
        let vocal = ''
        let animated = 0
        let stick = null
        let classel = null
        let gsapanim = null
        let delay = 0
        if(anim.classList.contains('iO-stck')){
          animated = 1
          stick = {
            parent:this.DOM.el.querySelector('#stck'+anim.dataset.stck),
            son:this.DOM.el.querySelector('#stck'+anim.dataset.stck+' .stck_main'),
            active:0,
            current:0,
            target:0,
            pos:0,
            prog:0,
            limit:0
          }
          
          vocal ='s'+index
          
        }
        else if(anim.classList.contains('iO-time')){
          
          vocal ='v'+index
          animated = 1
        }
        else{

          vocal ='n'+index
        }
        anim.dataset.pos = index
        let animobj = {
          el: anim,
          pos: index,
          stick: stick,
          id: vocal+'s',
          animated:animated,
          gsapanim:gsapanim,
          classel:classel,
          active: false
        };
        this.anims.push(animobj)
        
      }
    }
  }

  /**
   * Animations.
   */

   svgTrans(a){
    for(let b of a.querySelectorAll('svg')){
      if(b.getAttribute('width') && !b.getAttribute('viewBox')){
        let txt = '0 0 '+b.getAttribute('width')+' '+b.getAttribute('height')
        console.log(txt)
        b.setAttribute('viewBox',txt)
      }
    }
  }

  async show() {
    
    this.onResize()
    if(this.DOM.el.querySelector('.m-social')){
      for(let a of this.DOM.el.querySelectorAll('.m-social')){
        this.svgTrans(a)
      }
    }
    if(this.DOM.el.querySelectorAll('.social')){
      for(let a of this.DOM.el.querySelectorAll('.social')){
        this.svgTrans(a)
      }
    }
    // await this.timeout(420)
    if(this.DOM.el.querySelector('p:empty')){
      for(let p of this.DOM.el.querySelectorAll('p:empty')){
        p.remove()
      }
    }
    if(!this.main.isTouch){
      await gsap.to(this.DOM.el,{y:0,ease:'bounceTrans',duration:1.6})
    }
    else{
      await gsap.to(this.DOM.el,{y:0,ease:'bounceTrans',duration:1.6,
        onComplete:()=>{
          this.DOM.el.style.position='relative'
          this.DOM.el.style.left='auto'
          this.DOM.el.style.top='auto'
        }
      })

    }
    this.resizeLimit()
    if(this.intro){
      this.intro.start(1)
    }
    this.isVisible = 1
    if(this.avoidScroll){
      document.documentElement.classList.add('scroll-ready')
    }

    if(document.querySelector('.Tab')){
      this.tabFn = (el) =>{
        if(el.classList.contains('act')){
          el.classList.remove('act')
          gsap.to(el.querySelector('.tabHold'),{height:0,onComplete:()=>{
            if(this.main.isTouch){
              this.resizeLimit()
            }
          }
          })
        }
        else{
          el.classList.add('act')
          gsap.to(el.querySelector('.tabHold'),{height:el.querySelector('.tabBox').clientHeight+'px',onComplete:()=>{
            if(this.main.isTouch){
              this.resizeLimit()
            }
          }
          })
          
        }
      }
      for(let p of this.DOM.el.querySelectorAll('.Tab')){
        p.querySelector('.tabClick').addEventListener('click',()=>this.tabFn(p))
      }

    }

    return Promise.resolve()
  }

  hide() {
    this.isVisible = 0

    if(this.avoidScroll){
      document.documentElement.classList.remove('scroll-ready')
    }
    return Promise.resolve()
  }
  //Images
  loadImages(){
    
    return Promise.resolve()
  }
  /**
   * Events.
   */
  onResize () {
    window.requestAnimationFrame(_ => {
      this.h = window.innerHeight
      this.resizeLimit()
      
    })

  }
  resizeLimit(){
    if(!this.scroll){
      return false
    }
    if(!this.avoidScroll){
      
      
      for(let anim of this.anims){
        if(anim.stick!=null){
          if(anim.stick.type){

            anim.stick.limit=anim.stick.parent.querySelector('.stck_control').clientHeight + (anim.stick.son.clientHeight/2)
            
          }
          else{
            // anim.stick.limit=anim.stick.parent.clientHeight
            anim.stick.limit = anim.stick.parent.querySelector('.stck_control').clientHeight
            console.log(anim.stick.limit)
          }
          
        }
      }
      if(this.isHorizontal){
        this.size = this.DOM.el.querySelector('.sizer').clientWidth - window.innerWidth
      }
      else{
        this.size = this.DOM.el.clientHeight - window.innerHeight
      }
        
        this.scroll.limit = this.size
        // this.content.style.height = this.scroll.limit+'px'
    }
  }

  onScroll (t){
    this.scroll.target = document.body.scrollTop
    this.mobileScroll()
      if (document.body.scrollTop == 0) {
        document.documentElement.classList.remove('scrolled')
      }
      else{
        document.documentElement.classList.add('scrolled')
  
      }
  }

  onTouchDown (event) {
    this.isDown = true
    
    
    
  }

  onTouchMove (event) {
    if (!this.isDown) return
    
  }

  onTouchUp (event) {

    this.isDown = false
  }

  onWheel () {
    if(this.isVisible==0){
      return
    }
   
  }

  /**
   * Frames.
   */
  smoothScroll(x){
    if(x) {
      this.scroll.target = this.scroll.last ?? 0;
      return;
    }

    if(this.isAutoScroll==0){
      this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target) ?? this.scroll.target
      this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease) ?? this.scroll.current
      // this.scroll.current = Math.floor(this.scroll.current)
    
      if (this.scroll.current < 0.1) {
        this.scroll.current = 0
        document.documentElement.classList.remove('scrolled')
      }
      else{
        document.documentElement.classList.add('scrolled')

      }
      
      if(this.isHorizontal){
        this.DOM.el.style[this.transform] = `translate3d(-${this.scroll.current}px,0, 0)`

      }
      else{
        this.DOM.el.style[this.transform] = `translate3d(0, -${this.scroll.current}px, 0)`

      }
    }
    this.scroll.last = this.scroll.current
    for(let st of this.sticks){
      st.stick.target = this.h - st.el.getBoundingClientRect().y
      // console.log(st.stick.pos+'pos')
      st.stick.current = clamp(0, st.stick.limit, st.stick.target)
      // st.stick.current = lerp(st.stick.current, st.stick.target,this.scroll.ease)
      // st.stick.current = Math.floor(st.stick.target)
      // st.stick.current = st.stick.target

      st.stick.prog = st.stick.current / st.stick.limit
      if (st.stick.current < 0.1) {
        st.stick.current = 0
      }
      // console.log(st.stick.prog)
      // console.log(st.stick.current+'currentaf')
      st.stick.son.style[this.transform] = `translate3d(0,${st.stick.current}px, 0)`
    }
  }
  
  mobileScroll(){

  }

  update (speed) {
    if(this.isVisible == 0){
      return false
    }
    this.speed = speed
    if(!this.avoidScroll){
        this.smoothScroll()
        if(this.speed >0.001 || this.speed < -0.001){
          if(this.scroll){
            this.scroll.target += this.speed
          }
          for(let st of this.sticks){
            st.stick.target+= this.speed
          }
          if(this.movestick!=null){
            this.movestick.stick.target+= this.speed
          }
          if(this.movetext!=null){
            this.movetext.stick.target+= this.speed
          }
        }
    }
    else{

      // this.mobileScroll()
      // if (document.body.scrollTop == 0) {
      //   document.documentElement.classList.remove('scrolled')
      // }
      // else{
      //   document.documentElement.classList.add('scrolled')
  
      // }
    }

  }
}
