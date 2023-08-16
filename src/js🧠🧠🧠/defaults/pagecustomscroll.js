import AutoBind from 'auto-bind'
import EventEmitter from 'events'


import Prefix from 'prefix'
import { clamp, lerp } from '../basic/math.js'

export default class extends EventEmitter {
  constructor (main,footer) {
    super()

    AutoBind(this)

    this.content = document.querySelector("#content"),
    this.main = main
    this.footer = footer

    this.scroll = {
      ease: 0.3,
      position: 0,
      current: 0,
      target: 0,
      limit: 0
    }
    this.isVisible = 0
    this.isScrollable = 1
    this.isHorizontal = 0

    this.transform = Prefix('transform')
  }
  
  timeout(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async create (id) {
    //Genera HTML
    if(this.generate){
      await this.generate(id)
    }
    //Genera elementos animaciones
    await this.createAnimations()

    //Si tiene scroll, añade asscroll
    await this.timeout(400)
    await this.createScroll()
    this.isVisible = 1
    //Muestra página
  }
  //Scroll
  createScroll() {
    if (this.isScrollable) {
        if(this.isHorizontal){

          this.size = this.DOM.el.querySelector('.sizer').clientWidth - window.innerWidth
        }
        else{
          this.size = this.DOM.el.clientHeight - window.innerHeight
        }
        this.scroll = {
          ease: 0.1,
          position: 0,
          current: 0,
          target: 0,
          limit: this.size
        }
        if(global.device!='desktop'){
          this.scroll.ease =  0.2
        }

      this.content.style.height = this.scroll.limit+'px'
    }

    this.callback = (entries,observer) =>{
      entries.forEach(entry=>{
        if(!entry.target.dataset.pos){
          return false
        }
        
        var pos = entry.target.dataset.pos
        if(!entry.isIntersecting){
          this.anims[pos].active = false
        }
        else if(entry.isIntersecting){
          this.anims[pos].active = true
          if(this.anims[pos].animated==1){
          
            this.makeAnim(this.anims[pos].el,(entry.boundingClientRect.y).toFixed(0),entry.intersectionRatio)
          }
          else{
            if(entry.intersectionRatio > 0.4){
              entry.target.classList.add('inview')
              this.observer.unobserve(entry.target)
          }
          }
        }
      })
    }
    
    this.observer = new IntersectionObserver(this.callback,this.options)
    this.DOM.watchers.forEach((el)=>{
      this.observer.observe(el)
    })
  }



  /**
   * Animations.
   */
  
   makeAnim(anim,y,ratio){
    if(y < 0){
      console.log(1-(ratio/2))
    }
    else{
      console.log(ratio/2)
    }
    
  }

  createAnimations () {
    this.anims = []
    this.DOM.watchers.forEach((anim,index)=>{
      var animated = 0
      if(anim.classList.contains('home_i')){
        var vocal ='u'+index
        animated = 1
      }
      else if(anim.classList.contains('colorChange')){
        var vocal ='c'+index

      }
      else{

        var vocal ='n'+index
      }
      anim.dataset.pos = index
      var animobj = {
        el: anim,
        pos: index,
        id: vocal+index+'s',
        animated:animated,
        active: false
      };
      this.anims.push(animobj)
    })
  }

  /**
   * Animations.
   */

  async show (url) {
    
    this.isVisible = true
    this.onResize()
    return Promise.resolve()
  }

  hide (url) {
    this.isVisible = false
    document.querySelector('#content').innerHTML = ''
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
      if(this.isHorizontal){
        this.size = this.DOM.el.querySelector('.sizer').clientWidth - window.innerWidth
      }
      else{
        this.size = this.DOM.el.clientHeight - window.innerHeight
      }
      this.scroll.limit = this.size
      this.content.style.height = this.scroll.limit+'px'
    })

  }
  onScroll (t){
    this.scroll.target = t
  }

  onTouchDown (event) {
    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
    
  }

  onTouchMove (event) {
    if (!this.isDown) return
    const y = event.touches ? event.touches[0].clientY : event.clientY
    const distance = (this.start - y) * 2

    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp (event) {

    this.isDown = false
    console.log('farso')
  }

  onWheel (speed) {
    this.scroll.target += speed
  }

  /**
   * Frames.
   */
  update () {
    this.scroll.target = clamp(0, this.scroll.limit, this.scroll.target)
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)
    this.scroll.current = Math.floor(this.scroll.current)

    if (this.scroll.current < 0.1) {
      this.scroll.current = 0
    }
    if(this.isHorizontal){
      this.DOM.el.style[this.transform] = `translate3d(-${this.scroll.current}px,0, 0)`

    }
    else{
      this.DOM.el.style[this.transform] = `translate3d(0, -${this.scroll.current}px, 0)`

    }

    this.scroll.last = this.scroll.current

  }
}
