import Component from '/src/js🧠🧠🧠/defaults/Component'
import template from 'bundle-text:./template.eta'
import Field from './Field.js'
import {gsap,Power2} from 'gsap'


import * as Eta from 'eta'

export default class extends Component {
  constructor (main) {
    super({
    })

    this.main = main
    this.isOpen = 0
    this.isSearch = 0
    this.speed = 0
    
  }

  async generate () {
    let url_href = window.location.href;
		const is_shared_player = url_href.includes("shared-player");

    if(is_shared_player) {
      document.documentElement.classList.add('is_shared')
    }

    const string = Eta.render(template,{global:this.main})
    document.querySelector('body').insertAdjacentHTML('afterbegin',string)
    this.DOM = {
      el:document.querySelector('.nav')
      
      
    }
    this.DOM.burger = this.DOM.el.querySelector('.nav_burger')
    this.DOM.searchopen = this.DOM.el.querySelector('.actSearch')
    this.DOM.searchclose = this.DOM.el.querySelector('.closeSearch')
    this.DOM.searchbg = document.querySelector('.searchbg')
    this.DOM.els = this.DOM.el.querySelectorAll('.nav_menu_el')
    this.DOM.bgs = this.DOM.el.querySelectorAll('.nav_menu_bg')
    this.field = new Field(this.DOM.el.querySelector('.fieldsearch'))


    
    this.keyFn = (e)=>{ 
      
      // this.field.DOM.npt.value = this.field.DOM.npt.value + e.keyCode + e.keyCode
      // this.field.DOM.npt.value = e.keyCode + e.key
      if(e.key=='Enter' || e.keyCode == 9 ||e.keyCode == 13){
        this.emit('search')
      }
    }

    this.focusFn = ()=>{
      this.field.DOM.el.classList.remove("err")
      this.field.DOM.el.classList.add("foc")

      if(this.main.isTouch){
        // this.field.DOM.npt.style.backgroundColor='red'
        this.field.DOM.npt.addEventListener("keydown", (e)=> this.keyFn(e))

      }
      else{
        this.field.DOM.npt.addEventListener("keydown", (e)=> this.keyFn(e))
        
      }
    }
    this.focusoutFn = ()=>{
        this.field.DOM.el.classList.remove("foc")
        this.field.DOM.el.classList.remove("err")
        if(this.main.isTouch){
          // this.field.DOM.npt.style.backgroundColor='yellow'
          // if(this.field.DOM.npt.value!=''){
          //   this.emit('search')
          // }
          this.field.DOM.npt.removeEventListener("keydown", (e)=> this.keyFn(e))
        }
        else{
          this.field.DOM.npt.removeEventListener("keydown", (e)=> this.keyFn(e))
          
        }
        
    }
    this.field.DOM.npt.addEventListener("focusin", this.focusFn)
    this.field.DOM.npt.addEventListener("focusout", ()=>this.focusoutFn())
    

    await this.loadImages()
    this.initEvents()
  }
  async create(){

    gsap.to('.nav',{y:0,ease:Power2.easeInOut,duration:.6})
  }
  async loadImages(){
    let paths = Array.from(this.DOM.el.querySelectorAll('img'))
    const promises = []
    paths.forEach((path) => {
      promises.push(new Promise((resolve, reject) => {
          const img = new Image();

          img.onload = ()=>resolve(path)
          img.onerror = ()=>reject(path)
          
          img.src = path.src
      }))
    })
    let videos = Array.from(this.DOM.el.querySelectorAll('video'))
    if(videos){
      Promise.all(videos).then(values => {
        
      });
    }



  }

  async openMenu(){
  }
  async closeMenu(){
    this.isOpen = 0
    document.documentElement.classList.remove('menu-active')
  }

  
  initEvents(){

    this.showFn = (i) =>{
      if(this.DOM.bgs[i].querySelector('video')){
        this.DOM.bgs[i].querySelector('video').play()
      }
      this.DOM.bgs[i].classList.add('show')
      let r1 = gsap.utils.random(30, 70)
      let r2 = gsap.utils.random(30, 70)

      this.DOM.bgs[i].dataset.x = r1
      this.DOM.bgs[i].dataset.y = r2

      gsap.killTweensOf(this.DOM.bgs[i])
      gsap.set(this.DOM.bgs[i],{"clip-path": "circle(0% at "+r1+"% "+r2+"%)"})
      gsap.to(this.DOM.bgs[i],{"clip-path": "circle(100% at "+r1+"% "+r2+"%)",duration:3,ease:'bounceNew'})
      
    }
    this.hideFn = (i) =>{
      this.DOM.bgs[i].classList.remove('show')
      let r1 = this.DOM.bgs[i].dataset.x
      let r2 = this.DOM.bgs[i].dataset.y
      gsap.killTweensOf(this.DOM.bgs[i])
      gsap.to(this.DOM.bgs[i],{"clip-path": "circle(0% at "+r1+"% "+r2+"%)",duration:2,ease:'bounceNew'})
      if(this.DOM.bgs[i].querySelector('video')){
        setTimeout(()=>{
          this.DOM.bgs[i].querySelector('video').pause()

        },600)
      }
    }

    for(let [index,el] of this.DOM.els.entries()){
      el.addEventListener('mouseenter',()=>this.showFn(index));
      el.addEventListener('mouseleave',()=>this.hideFn(index));
    }

    this.DOM.burger.onclick = event =>{
      if(this.isOpen){

        this.isOpen = 0
        document.documentElement.classList.remove('menu-active')
      }
      else{
        this.isOpen = 1
        document.documentElement.classList.add('menu-active')
      }
    }


    this.DOM.searchopen.onclick = event =>{
      
      this.isSearch = 1
      document.documentElement.classList.add('search-active')
      this.field.DOM.npt.focus()

    }

    this.closeSearchFn = ()=>{
      this.isSearch = 0
      document.documentElement.classList.remove('search-active')
      this.field.clear()
    }

    this.DOM.searchclose.addEventListener('click',this.closeSearchFn)
    this.DOM.searchbg.addEventListener('click',this.closeSearchFn)

  }


}