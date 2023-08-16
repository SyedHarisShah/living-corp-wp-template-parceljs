import Page from '../../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import Field from './Field.js'
import searchlist from 'bundle-text:/src/views👁️👁️👁️/ETA/art.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
import { getLoadingWheel } from '../../Login🥸/LinkedinLogin/Dialog'

import * as Eta from 'eta'
import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    let html = ''
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    console.log(data)

    if(this?.main?.user){
      if (!this?.main?.user?.acf?.is_content_hub_user) {
        html = Eta.render(noaccess,{global:this.main,footer:this.footer})
        document.querySelector('#content').innerHTML += html;
        this.DOM = {el: document.querySelector('main:not(.old)')};
        return;
      }
    } else {
      html = Eta.render(notlogged,{global:this.main,footer:this.footer})
      document.querySelector('#content').innerHTML += html;
      this.DOM = {el: document.querySelector('main:not(.old)')};
      return;
    }
    
    html = Eta.render(template,{data,global:this.main,footer:this.footer})
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')

    }
    this.DOM.total = this.DOM.el.querySelector('.totalSearch')
    this.DOM.holder = this.DOM.el.querySelector('.hPosts')
    this.DOM.cats = this.DOM.el.querySelectorAll('.catEl')

    this.field = new Field(this.DOM.el.querySelector('.field'))

    this.field.DOM.npt.addEventListener("input", ()=>{
      

      this.getPosts(this.field.DOM.npt.value)
      
    })
    
    this.field.DOM.npt.value = ''
    this.field.checkField()

    this.cat = ''

    await this.getPosts('')
    
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    
    for(let a of this.DOM.cats){
      a.addEventListener('click',()=>this.blocksClick(a))
    }
    
    await this.loadImages()
    await this.createAnimations()


  }

  changeHeader() {
    const el = document.querySelector(".m-simpleintro");
    const rect = el?.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const navmenu = document.querySelector('.nav_box');
    const navlogo = document.querySelector('.nav_logo');

    if (rect?.bottom < 100 || rect?.top >= viewportHeight) {
      navmenu.classList.add('nav_box--ch');
      // navlogo.href = '/content-hub';
    } else {
      navmenu.classList.remove('nav_box--ch');
      navlogo.href = '/';
    }
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

  async blocksClick (el){
    this.DOM.el.querySelector('.catEl.act').classList.remove('act')
    const type = el.dataset.post
    el.classList.add('act')

    this.cat = type
    if(this.cat != ''){
      for(let el of this.DOM.el.querySelectorAll('.result')){
        if(this.cat==el.dataset.post){
          el.classList.remove('hide')
        }
        else{
          el.classList.add('hide')
        }
      }
    }
    else{
      for(let el of this.DOM.el.querySelectorAll('.result')){
        el.classList.remove('hide')
      }
    }

    this.post_type = type;

    this.getPosts(this.field.DOM.npt.value)
  }


  async getJson(url){
    this.DOM.holder.innerHTML = getLoadingWheel();

    const posts = await fetch(url)
    const datap = await posts.json()

    this.html = Eta.render(searchlist,{global:this.main,type:this.cat,posts:datap.post})
    
    this.DOM.holder.innerHTML = this.html
    
    if(this.DOM.el.querySelectorAll('.art:not(.hide)').length==1){

      this.DOM.total.innerHTML = this.DOM.el.querySelectorAll('.art:not(.hide)').length+' result'
    }
    else{

      this.DOM.total.innerHTML = this.DOM.el.querySelectorAll('.art:not(.hide)').length+' results'
    }

    await this.ajaxImages()
  }

  async getPosts(search){
    this.DOM.holder.classList.add('load')

    const params = new URLSearchParams();

    params.set('search', search);
    if (this.post_type) params.set('post_type', this.post_type);

    Promise.all([
      this.timeout(600),
      this.getJson(`${this.main.acf.base}/wp-json/sdv/content-hub/v1/get-media?${params}`)
      
    ]).then(() => {
      this.DOM.holder.classList.remove('load')
      
      this.emit('linkseventlisteners')
      this.emit('mousereset')
     
      this.resizeLimit()
    })
    
    


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
        const id = this.anims[pos].id.substring(0, 1);
        if(id=='l'){

        }
        if(!entry.isIntersecting){
          if(this.anims[pos].active==true && this.anims[pos].animated==1){
            if(id=='s'){
              // console.log(this.anims[pos])
              this.anims[pos].stick.active = 0
              this.movestick = null
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
            if(id=='e'){
              this.anims[pos].classel.start()
              this.slidetext = this.anims[pos]
            }
            else if(id=='v'){
              this.clockStart(this.anims[pos].el.parentNode.querySelector('.time'))
            }
            else if(id=='s'){
              this.anims[pos].stick.active = 1
              this.movestick = this.anims[pos]
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
      this.changeHeader();
    }
    
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  async show () {
    this.timeout(1)
    // gsap.to('.home',{opacity:1,ease:Power2.easeInOut,duration:.6})
    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0
    return super.hide()
  }
}
