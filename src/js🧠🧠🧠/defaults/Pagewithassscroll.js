import AutoBind from 'auto-bind'
import EventEmitter from 'events'
import NormalizeWheel from 'normalize-wheel'
import ASScroll from '@ashthornton/asscroll'
import Prefix from 'prefix'



export default class extends EventEmitter {
  constructor ({isScrollable}) {
    super()

    AutoBind(this)

    

    this.main = main
    this.isScrollable = isScrollable
    this.transformPrefix = Prefix('transform')
  }
  
  async create () {
    //Genera HTML
    if(this.generate){
      await this.generate()
    }
    //Genera elementos animaciones
    await this.createAnimations()

    //Si tiene scroll, añade asscroll
    
    await this.createScroll()
    //Muestra página
    await this.show()
  }
  //Scroll
  createScroll() {
    this.isScrolling = 0
    this.scroll = new ASScroll({
      containerElement: document.querySelector('#content'),
      scrollElements:document.querySelector('main'),
      
      ease:.3,
      touchEase: .75,
      disableRaf: true,
      disableResize: false,
      disableNativeScrollbar: true,
      limitLerpRate: true,
      
      
    })
    this.scroll.on('scroll',()=>{
      this.isScrolling = 1

    })
    this.scroll.on('scrollEnd',()=>{
      this.isScrolling = 0

    })

    this.callback = (entries,observer) =>{
      entries.forEach(entry=>{
        if(!entry.target.dataset.pos){
          return false
        }
        
        var pos = entry.target.dataset.pos
        // //  console.log(entry)
        if(!entry.isIntersecting){
          this.anims[pos].active = false
        }
        else if(entry.isIntersecting){
          this.anims[pos].active = true
          if(this.anims[pos].animated==1){
          
            this.makeAnim(this.anims[pos].el,(entry.boundingClientRect.y).toFixed(0),entry.intersectionRatio)
          }
          else{
            // //  console.log(entry.intersectionRatio)
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
      // //  console.log(1-(ratio/2))
    }
    else{
      // //  console.log(ratio/2)
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
    if(this.isHorizontal){

      this.scroll.enable({
        horizontalScroll:true
      })
    }
    else{

      this.scroll.enable()
    }
    return Promise.resolve()
  }

  hide (url) {
    this.isVisible = false
    this.scroll.disable()
    window.scrollTo(0,0)
    document.querySelector('#content').removeAttribute("style")
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

  }

  onTouchDown (event) {
    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onTouchMove (event) {

    const y = event.touches ? event.touches[0].clientY : event.clientY
    const distance = (this.start - y) * 3

    this.scroll.target = this.scroll.position + distance
  }

  onTouchUp (event) {

    this.isDown = false
  }

  onWheel (speed) {

  }

  /**
   * Frames.
   */
  update () {
    this.scroll.update()
    // if(this.anims && this.isScrolling){
    //   for(let obj of this.anims){
    //     if(obj.active == true && obj){
    //     }

    //   }
    // }
  }
}
