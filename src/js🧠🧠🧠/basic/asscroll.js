import ASScroll from '@ashthornton/asscroll'



export default class {
  constructor () {
    
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
  }

  resetScroll(){
    this.scroll.resize()
    const main = document.querySelector('main')
    if(main.dataset.hor){
      this.scroll.enable({
        horizontalScroll:true,
        reset:true,
        newScrollElements:document.querySelector('main')
      })
    }
    else{

      this.scroll.enable({
        reset:true,
        newScrollElements:document.querySelector('main')
      })
      
    }
  }
  onResize(){

    this.scroll.resize()
  }
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
