import Page from '../../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import Swiper, { Navigation } from 'swiper';
import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'

Swiper.use([Navigation]);

import * as Eta from 'eta'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    var html = ''   

    // //  console.log(this.main)
    
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    // //  console.log(data)

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

    html = Eta.render(template,{global:this.main,data:data,footer:this.footer})
    // //  console.log(html)
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)'),
      btnmore:document.querySelector('.ch-home_intro .btnmore')

    }

    const btnmore = this.DOM.btnmore;

    if (btnmore && btnmore?.href?.includes('#purpose')) {
      const purpose = document.querySelector(".ch-home_purpose");
      const navmenu = document.querySelector('.nav_box');

      btnmore.addEventListener('click', (e) => {
        e.preventDefault();
        let scrollPos = purpose.offsetTop - navmenu.offsetHeight;
        scrollPos = scrollPos >= 0 ? scrollPos : 0;

        const slowScroll = setInterval(() => {
          this.scroll.target += 75;

          if (this.scroll.target > scrollPos) {
            this.scroll.target = scrollPos;
            clearInterval(slowScroll);
          }
        }, 10);

      });
    }


    this.swiper = new Swiper ('.swiper', {
      slidesPerView: 1,
      spaceBetween: 25,
      // autoHeight: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })

    
    this.indexlist = 0
    this.DOM.listimg = this.DOM.el.querySelectorAll('.ch-homeposts .image')
    this.DOM.listel = this.DOM.el.querySelectorAll('.ch-homeposts .el')

    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)


    this.addEvents();
    await this.loadImages()
    await this.createAnimations()
  }

  changeHeader() {
    const el = document.querySelector(".ch-home_intro");
    const rect = el?.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const navmenu = document.querySelector('.nav_box');
    const navlogo = document.querySelector('.nav_logo');

    if (rect?.bottom < 500 || rect?.top >= viewportHeight) {
      navmenu.classList.add('nav_box--ch');
      // navlogo.href = '/content-hub';
    } else {
      navmenu.classList.remove('nav_box--ch');
      navlogo.href = '/';
    }
  }

  addEvents(){
    this.regChildScrollWithBar(document.querySelector(".ch-home_purpose"));
    this.regChildScroll(document.querySelector(".ch-home_actions"));
    this.regChildScrollWithBar(document.querySelector(".ch-home_media"));
    this.regChildScroll(document.querySelector(".ch-home_resources"));
    this.regChildScrollWithBar(document.querySelector(".ch-home_latest"));
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

  regChildScrollWithBar(elem){
    if(!elem) return;

    const list = elem.querySelector('#ch-list');
    const bar = elem.querySelector('#ch-bar');
    let scrollTimer;

    list?.addEventListener('scroll', () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }

      this.childscrolling = true;
      const winScroll = list.scrollTop || list.scrollTop;
      const height = list.scrollHeight - list.clientHeight;
      const scrolled = (winScroll / height) * 100;
      bar.style.height = scrolled + "%";
    
      scrollTimer = setTimeout(() => this.childscrolling = false, 150); 
    });

  }

  regChildScroll(elem){
    if(!elem) return;
    
    const postlist = elem.querySelector('.ch-homeposts_main');

    let scrollTimer;

    postlist?.addEventListener('scroll', () => {
      if (scrollTimer) clearTimeout(scrollTimer);

      this.childscrolling = true;

      scrollTimer = setTimeout(() => this.childscrolling = false, 150); 
    });

  }

  resizeLimit(){
      if(!this.scroll){
        return false
      }
      if(!this.avoidScroll){
        
        
        for(let anim of this.anims){
          if(anim.stick!=null){
            if(anim.stick.parent.classList.contains('ch-homeposts_main')){
  
              anim.stick.limit=anim.stick.parent.clientHeight-100
              
            }
            
            
          }
        }
        
          this.size = this.DOM.el.clientHeight - window.innerHeight
        
          
          this.scroll.limit = this.size
          // this.content.style.height = this.scroll.limit+'px'
      }
  }

  slideList(index){
    if(this.indexlist != index){
      
      if(this.indexlist!=-1){
        this.DOM.listimg[this.indexlist].classList.remove('act')
        this.DOM.listel[this.indexlist].classList.remove('act')
      }
      this.indexlist = index
      if(index!=-1){

        // //  console.log(this.indexlist)
        this.DOM.listimg[this.indexlist].classList.add('act')
        this.DOM.listel[this.indexlist].classList.add('act')
      }
    }
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

              this.anims[pos].stick.active = 0
              let index = this.sticks.indexOf(this.anims[pos])
              if (index > -1) {
                this.sticks.splice(index, 1)
              }

            }
            else if(id=='v'){
              // //  console.log('stahp')
              // this.intro.stop()
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
              // //  console.log('start')
              // this.intro.start()
            }
            else if(id=='s'){
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
      }
      this.optionsobo = {
        root:document.body,
        threshold:[0,1]
      }
    }
    else{
      this.optionsob = {
        root:null,
        threshold:this.buildThresholdList(500)
      }
      this.optionso = {
        root:null,
        threshold:[1]
      }
    }
    this.observer = new IntersectionObserver(this.callback,this.optionsob)
    if(this.DOM.watchers){
      this.DOM.watchers.forEach((el)=>{
        this.observer.observe(el)
      })
    }

    this.callbacko = (entries,observer) =>{
      entries.forEach(entry=>{
        if(this.isVisible == 0){
          return false
        }
        // //  console.log(entry.isIntersecting+' '+entry.target.dataset.el)
        if(entry.boundingClientRect.y > 100){
          this.slideList(entry.target.dataset.el)
        }
        
      })
    }

    this.observero = new IntersectionObserver(this.callbacko,this.optionso)
    if(this.DOM.el.querySelectorAll('.cOel')){
      this.DOM.el.querySelectorAll('.cOel').forEach((el)=>{
        this.observero.observe(el)
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
        else if(anim.classList.contains('iO-slidetime')){
          
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

    if(this.isVisible==1 && !this.childscrolling) {
      super.smoothScroll();
      this.changeHeader();
    }
    else super.smoothScroll(true)    
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  async show () {
    await this.timeout(1)
    this.DOM.el.classList.add('ch-home-active')
    gsap.to('.ch-home',{opacity:1,ease:Power2.easeInOut,duration:.6})
    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0
    return super.hide()
  }
}
