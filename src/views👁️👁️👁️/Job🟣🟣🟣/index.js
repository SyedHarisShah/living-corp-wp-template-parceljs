import Page from '../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import job from 'bundle-text:/src/views👁️👁️👁️/ETA/job.eta'

//COMPS

import * as Eta from 'eta'

import Timer from './intro.js'

export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    const response = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/job/')
    const data = await response.json()
    console.log(data)
    var html = Eta.render(template,{global:this.main,data:data,footer:this.footer})
    
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')
      

    }
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.DOM.checks = this.DOM.el.querySelectorAll('.chk_npt')
    this.DOM.closefilters = this.DOM.el.querySelector('.activeFilters')
    this.DOM.total = this.DOM.el.querySelector('.totalSearch')
    this.DOM.holdfilters = this.DOM.el.querySelector('.holdFilters')
    this.DOM.chekshold = this.DOM.el.querySelector('.bottom_checks')
    this.DOM.checksels = this.DOM.el.querySelectorAll('.bottom_checks_el')
    this.DOM.checksclick = this.DOM.el.querySelectorAll('.catEl')
    this.DOM.clear = this.DOM.el.querySelector('.btnClear')
    this.DOM.holder = this.DOM.el.querySelector('.jobs_main_results')

    gsap.set(this.DOM.clear.parentNode.parentNode,{height:0})
    gsap.set(this.DOM.chekshold,{height:this.DOM.checksels[0].clientHeight+'px'})
    this.DOM.checksclick[0].classList.add('act')
    this.DOM.checksels[0].classList.add('act')
    this.poscat = 0
    this.isloading = 0
    await this.loadImages()
    await this.createAnimations()
    this.clearChecks = () =>{
      this.isloading = 1
      console.log(this.isloading+'fi')
      for(let [index,o] of this.DOM.checks.entries()){
        o.checked = false
      }
      this.isloading = 0
      this.getPosts()
    }
    this.DOM.clear.addEventListener('click',this.clearChecks  )
    this.clicktypeFn = (i) =>{

      this.DOM.checksclick[this.poscat].classList.remove('act')
      this.DOM.checksels[this.poscat].classList.remove('act')
      this.poscat = i
      gsap.to(this.DOM.chekshold,{height:this.DOM.checksels[this.poscat].clientHeight+'px'})
      this.DOM.checksclick[this.poscat].classList.add('act')
      this.DOM.checksels[this.poscat].classList.add('act')
    }

    for(let [index,o] of this.DOM.checksclick.entries()){

      o.addEventListener('click',()=>this.clicktypeFn(index))
    }
   
    this.DOM.closefilters.onclick = (e)=>{
      if(!this.DOM.closefilters.classList.contains('closed')){
        this.DOM.closefilters.classList.add('closed')
        gsap.to(this.DOM.holdfilters,{height:0,ease:Power2.easeInOut})
      }
      else{
        this.DOM.closefilters.classList.remove('closed')
        let h = this.DOM.holdfilters.querySelector('.holdFilters_box').clientHeight
        gsap.to(this.DOM.holdfilters,{height:h,ease:Power2.easeInOut,
          onComplete:()=>{
            this.DOM.holdfilters.style.height=''
          }
        })

      }
    }
    for(let c of this.DOM.checks){
      c.onchange = ()=> { this.getPosts() }
    }
  //  this.slidrag = new Slidrag(this.DOM.el.querySelector('.swiper'))
   this.intro = new Timer(this.DOM.el.querySelector('.jobs_intro'))
   this.intro.start() 
   this.getPosts()
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
    let videos = Array.from(this.DOM.el.querySelectorAll('video.wait'))
    if(videos){
      Promise.all(videos).then(values => {
        for(let vid of values){
            vid.play();
        }
      });
    }
    return super.loadImages()



  }
  resizeLimit(){

    gsap.set(this.DOM.chekshold,{height:this.DOM.checksels[this.poscat].clientHeight+'px'})
    
    return super.resizeLimit()
  }
  async ajaxImages(){
    let newpage = document.createElement("template")
    newpage.innerHTML = this.html

    let paths = Array.from(newpage.content.querySelectorAll('img'))
    const promises = []
    paths.forEach((path) => {
      promises.push(new Promise((resolve, reject) => {
          const img = new Image();

          img.onload = ()=>resolve(path)
          img.onerror = ()=>reject(path)
          
          img.src = path.src
      }))
    })
    return Promise.resolve()



  }

  async getJson(url){
    const posts = await fetch(url)
    const datap = await posts.json()

    console.log(datap)
    if(datap.total==1){
      this.DOM.total.innerHTML = datap.total+' result'

    }
    else{

    this.DOM.total.innerHTML = datap.total+' results'
    }
    this.html = Eta.render(job,{global:this.main,posts:datap.posts})
    // this.ajaxImages()
    
    await this.ajaxImages()
  }


  async getPosts(){
    console.log('tri')
    if(this.isloading == 1){
      return false
    }
    console.log(this.isloading+'islad')
    this.isloading = 1
    this.DOM.holder.classList.add('load')
    let a = ''
    let b = ''
    for(let c of this.DOM.checksels[0].querySelectorAll('input')){
      if(c.checked==true){
        if(a==''){
          a=c.value
        }
        else{
          a+=','+c.value
        }
      }
    }
    for(let c of this.DOM.checksels[1].querySelectorAll('input')){
      if(c.checked==true){
        if(b==''){
          b=c.value
        }
        else{
          b+=','+c.value
        }
      }
    }
    if(a!='' || b!=''){
      let  h = this.DOM.clear.parentNode.clientHeight
      gsap.to(this.DOM.clear.parentNode.parentNode,{height:h+'px',ease:Power2.easeInOut})
    }
    else{

      gsap.to(this.DOM.clear.parentNode.parentNode,{height:0,ease:Power2.easeInOut})
    }

    Promise.all([
      this.timeout(600),
      this.getJson(this.main.acf.base+'/wp-json/wp/v2/getjobs?location='+a+'&industry='+b)
      
    ]).then(() => {
      this.DOM.holder.innerHTML = this.html
      this.DOM.holder.classList.remove('load')
      this.isloading = 0
      this.emit('linkseventlisteners')
      this.emit('mousereset')
      this.resizeLimit()
    })
  }
  
  callBacks(){
    this.sticks = []
    this.callback = (entries,observer) =>{
      entries.forEach(entry=>{
        if(!entry.target.dataset.pos){
          return false
        }
        const pos = entry.target.dataset.pos
        const id = this.anims[pos].id.substring(0, 1)
        if(id=='l'){

        }
        if(!entry.isIntersecting){
          if(this.anims[pos].active==true && this.anims[pos].animated==1){
            if(id=='s'){

              this.anims[pos].stick.active = 0
              let index = this.sticks.indexOf(this.anims[pos])
              if (index > -1) {
                this.sticks.splice(index, 1)
              }

            }
            else if(id=='v'){

              clearInterval(this.clockInt)
            }
            else if(id=="t"){
              
              this.anims[pos].stick.active = 0
              this.movetext = null
            }

            else if(id=='c'){
              document.documentElement.classList.remove('white-menu')
            }
            else if(id=='l'){
              document.documentElement.classList.remove('logohide-menu')
            }
            else if(id=='q'){
              document.documentElement.classList.remove('quick-menu')
            }
            else if(id=='e'){
              this.anims[pos].classel.stop()
              this.slidetext = null
              
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
            else if(id=='t'){
              this.anims[pos].stick.active = 1
              this.movetext = this.anims[pos]
            }
            
            else if(id=='c'){
              document.documentElement.classList.add('white-menu')
            }
            else if(id=='l'){
              document.documentElement.classList.add('logohide-menu')
            }
            else if(id=='q'){
              document.documentElement.classList.add('quick-menu')
            }
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
    if(id=='p' || id=='h' || id=='f'){
      anim.gsapanim.progress(prog)
    }
  }
  onResize(){
    
    return super.onResize()
  }
  
  
  smoothScroll(){
    if(this.isVisible==1){
      super.smoothScroll()
    }
    
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  async show () {
    await this.timeout(1)
    this.DOM.el.classList.add('home-active')
    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0
    return super.hide()
  }
}
