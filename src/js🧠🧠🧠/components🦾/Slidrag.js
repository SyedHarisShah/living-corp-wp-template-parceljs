import { gsap,Power2 } from 'gsap'
import { Swiper } from 'swiper'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'

export default class {
    constructor(element) {
        this.el = element
        this.swiper = new Swiper (this.el, {
            // Optional parameters
        loop: false,
        speed:640,
				touchRatio:.8,
        slidesPerView:'auto',
        allowTouchMove:true,
        
        
        
        })
        this.isMov = false
        this.move = {
            current:0,
            target:0,
            ease:1,
            first:0
        }
				this.speed = {
					x:0
				}
				this.update = this.update.bind(this)
        this.initEvents()
    }

    start() {
      this.isVisible = true
    
    }

    stop() {
        this.isVisible = false

    }
    initEvents() {
      // console.log('asasa')
      // this.swiper.on('drag',()=>{
      //   console.log('a')
      //   document.documentElement.classList.add('mouse-down')
      // })
      // this.swiper.on('dragEnd',()=>{
      //   document.documentElement.classList.remove('mouse-down')
      // })

			document.documentElement.style.setProperty("--app-speed", (0)+"deg")
        this.swiper.on('touchStart',(sw,ev)=>{
          document.documentElement.classList.add('mouse-down')
					sw.el.classList.add('swiper-drag')
					this.isMov = true
					this.move.first = this.swiper.progress
					this.update()
        })
				// this.swiper.on('progress',(sw)=>{
				// 	console.log(sw.progress)
        // })
        this.swiper.on('touchEnd',(sw,ev)=>{
          document.documentElement.classList.remove('mouse-down')
					sw.el.classList.remove('swiper-drag')
					this.isMov = false
					gsap.to(this.speed,{x:0,ease:Power2.easeInOut,onUpdate:()=>{

						document.documentElement.style.setProperty("--app-speed", (this.speed.x)+"deg")
					}
					})
					window.cancelAnimationFrame(this.request)
        })

    }
    removeEvents(){

    }
    update(){
      this.move.target = this.swiper.progress
      this.move.current = lerp(this.move.current, this.move.target, 0.8)
			this.speed.x = (this.move.first - this.move.current)*-80
			this.speed.x = (clamp(-25, 25, this.speed.x))
			document.documentElement.style.setProperty("--app-speed", (this.speed.x)+"deg")
			this.request = requestAnimationFrame(this.update)
    }
}