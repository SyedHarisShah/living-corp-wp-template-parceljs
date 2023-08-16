import Page from '../../../js🧠🧠🧠/defaults/Page'
// import Modal from './modal.js'
import template from 'bundle-text:./template.eta'
// import modal from 'bundle-text:./modal.eta'
import list from 'bundle-text:/src/views👁️👁️👁️/ETA/resourcelist.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import { getLoadingWheel } from '../../Login🥸/LinkedinLogin/Dialog'
import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'

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
    let html = ''
    // const response = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/resources/')
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

    html = Eta.render(template,{data:data,global:this.main,footer:this.footer, loading: getLoadingWheel()})
    // this.modalhtml = Eta.render(modal,{global:this.main})
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')
      

    }
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.DOM.holder = this.DOM.el.querySelector('.hPosts')



    
    await this.loadImages()
    await this.createAnimations()
    await this.getPosts()


    
    // document.querySelector('#content').innerHTML += modalhtml
    // this.modal = new Modal(document.documentElement.querySelector('.modal'))

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
  
  async getJson(url){
    console.log(url)
    const posts = await fetch(url)
    const datap = await posts.json()
    console.log(datap)
    this.html = Eta.render(list,{global:this.main,posts:datap.posts})
    console.log(this.html)
    console.log(this.DOM.holder)
    this.DOM.holder.innerHTML = this.html
    

    await this.ajaxImages()
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
  async getPosts(){
    this.DOM.holder.classList.add('load')
    Promise.all([
      this.timeout(600),
      this.getJson(this.main.acf.base+'/wp-json/sdv/content-hub/v1/get-resources')
      
    ]).then(() => {
      this.DOM.holder.classList.remove('load')
      for(let el of this.DOM.holder.querySelectorAll('.list')){
        console.log(el)
        el.addEventListener('click',()=>this.modalFn(el))
      }
      this.emit('linkseventlisteners')
      this.emit('mousereset')
     
      this.resizeLimit()
    })
    
    


  }
  modalFn(el){
    // this.modal.create(el)
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
      this.changeHeader();
    }
    
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  async show () {
    await this.timeout(1)
    
    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0
    // this.modal.removeEvents()
    return super.hide()
  }
}
