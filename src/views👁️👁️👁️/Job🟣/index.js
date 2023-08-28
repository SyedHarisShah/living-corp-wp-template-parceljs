import Page from '../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'

//COMPS

import * as Eta from 'eta'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/job/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    // //  console.log(data)
    this.job = {
      id:content.dataset.id,
      template:'job',
      content:content,
      url:window.location.href
    }
    var html = Eta.render(template,{global:this.main,data:data,footer:this.footer})
    // //  console.log(html)
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')
      

    }


    if(this.main.user!=false){
      
      this.DOM.el.querySelector('.btnfull').addEventListener('click',()=>{
        this.emit('toApply',this.job)

      })
    }


    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
      
    this.DOM.hidetext = this.DOM.el.querySelector('.hidetext')
    this.DOM.clicktext = this.DOM.el.querySelector('.hidetext_click')
    this.DOM.holdtext = this.DOM.el.querySelector('.hidetext_hold')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    
    


    if(this.DOM.hidetext.clientHeight+40 > this.DOM.holdtext.clientHeight){
      this.DOM.clicktext.classList.add('act')
      gsap.to(this.DOM.hidetext,{height:this.DOM.holdtext.clientHeight+'px',duration:.6,
      onComplete:()=>{
        this.DOM.hidetext.classList.add('act')
        this.DOM.hidetext.style.height = ''
        this.resizeLimit()
      }
      })

    }
    else{
      this.textExpand = () =>{
        this.isVisible = 0
        // //  console.log(this.sticks)
        this.DOM.clicktext.classList.add('act')
        this.timeline = gsap.timeline(({paused:true}))
        // .to(this.sticks[0].stick.son,{duration:.6,y:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight)+'px'},'a')
        // .to(this.sticks[0].stick,{duration:.6,current:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight),target:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight)},'a')
        .to(this.DOM.hidetext,{height:this.DOM.holdtext.clientHeight+'px',duration:.6,
          onUpdate:()=>{
            // //  console.log(this.sticks)
          },
          onComplete:()=>{
            this.isVisible = 1
            this.DOM.hidetext.classList.add('act')
            this.DOM.hidetext.style.height = ''
            this.resizeLimit()
          }
        },'a')
        this.timeline.play()
      }
      this.DOM.clicktext.addEventListener('click',this.textExpand)
    }

    await this.loadImages()
    await this.createAnimations()



  //  this.slidrag = new Slidrag(this.DOM.el.querySelector('.swiper'))
  //  this.slidclick = new SlidClick(this.DOM.el.querySelector('.m-slidnum'))

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
              let goto = 0
              if( this.anims[pos].stick.son){
                if(entry.boundingClientRect.y<0){
                  goto= this.anims[pos].stick.limit
                }
                 this.anims[pos].stick.target = goto
                 this.anims[pos].stick.current =  goto
                 this.anims[pos].stick.son.style[this.transform] = `translate3d(-${goto}px,0, 0)`
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
    // await this.animScroll.play()
    setTimeout(()=>{
      this.DOM.el.querySelector('.btnfull').classList.add('show')
    },2000)
    return super.show()
  }

  async hide () {
    this.isVisible = 0
    return super.hide()
  }
}
