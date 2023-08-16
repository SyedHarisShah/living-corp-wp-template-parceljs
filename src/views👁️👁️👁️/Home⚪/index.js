import Page from '../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import templatelog from 'bundle-text:./templatelog.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'

//COMPS
import Timer from '/src/js🧠🧠🧠/components🦾/Timer.js'
import Title from '/src/js🧠🧠🧠/components🦾/Title.js'
import Slidrag from '/src/js🧠🧠🧠/components🦾/Slidrag.js'
import SlidClick from '/src/js🧠🧠🧠/components🦾/SlidClick.js'
import Tabs from './Tabs.js'

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
    this.childscrolling = false;

    console.log(this.main)
    if(!this.main.user){
      
      const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
      const data = await response.json()
      console.log(data)
      html = Eta.render(template,{global:this.main,data:data,footer:this.footer})
      // console.log(html)
      document.querySelector('#content').innerHTML += html
      this.DOM = {
        el:document.querySelector('main:not(.old)')
  
      }

      const el = this.DOM.el ? this.DOM.el.querySelector('.home_intro:not(:has(.home_intro_grid))') : undefined;
      if(el) this.intro = new Timer(el, true)
      if(this.DOM.el.querySelector('.swiper')){
        this.slidrag = new Slidrag(this.DOM.el.querySelector('.swiper'))
      }
      if(this.DOM.el.querySelector('.m-slidnum')){
        this.slidclick = new SlidClick(this.DOM.el.querySelector('.m-slidnum'))
      }
      
      this.indexlist = 0
      this.DOM.listimg = this.DOM.el.querySelectorAll('.homeposts .image')
      this.DOM.listel = this.DOM.el.querySelectorAll('.homeposts .el')
    }
    else{
      const responsep = await fetch(this.main.acf.base + '/wp-json/wp/v2/gettopics/?topics=' + this.main.user.acf.topics)
      const datap = await responsep.json()
      const response = await fetch(this.main.acf.base + '/wp-json/wp/v2/pages/' + content.dataset.id + '?acf_format=standard')
      const data = await response.json()
      console.log(data);
      html = Eta.render(templatelog,{global:this.main,data:data,datap:datap,footer:this.footer})
      document.querySelector('#content').innerHTML += html
      this.DOM = {
        el:document.querySelector('main:not(.old)')
  
      }
      const el = this.DOM.el ? this.DOM.el.querySelector('.home_intro:not(:has(.home_intro_grid))') : undefined;
      if(el) this.intro = new Timer(el, true)
      this.tabscont = new Tabs(this.DOM.el.querySelector('.m-tabposts'))
      this.tabscont.on('resize',()=>{
        this.resizeLimit()
      })
    }

    this.DOM.intro = document.querySelector('.home_intro');
    this.DOM.image_grid = document.querySelector('.home_intro_grid');
    this.DOM.image_grid_overlay = document.querySelector('.home_intro_overlay');

    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)



    await this.loadImages()
    await this.createAnimations()
  }

  resizeLimit(){
      if(!this.scroll){
        return false
      }
      if(!this.avoidScroll){
        
        
        for(let anim of this.anims){
          if(anim.stick!=null){
            if(anim.stick.parent.classList.contains('homeposts_main')){
  
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

        // console.log(this.indexlist)
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

  addImageGridScroll() {
    let scrollTimer;
    let startY;
    const intro = this.DOM.intro;
    const image_grid = this.DOM.image_grid;
    const image_grid_overlay = this.DOM.image_grid_overlay;

    let scrollEndTimeout;

    const scroll = (e) => {
      if (scrollTimer) clearTimeout(scrollTimer);

      const scrollEnd = () => {
        if(!scrollEndTimeout){
          scrollEndTimeout = setTimeout(() => this.childscrolling = false, 1000);
          scrollEndTimeout = null;
        }
      };

      // if element isnt fully visible dont scroll (while scrolling back up the page)
      const rect = intro.getBoundingClientRect();
      let progress = parseFloat(image_grid.dataset.progress || 100)
      
      if(rect.top < -10 && progress <= 0) {
        scrollEnd();
        return;
      }

      document.documentElement.classList.remove('is-scrolling')
            
      // progress starts from 100 and goes to 0
      // prevent negative movement overflow || prevent positive movement overflow
      if((e.deltaY < 0 && progress >= 100) || (e.deltaY > 0 && progress <= 0)){
        scrollEnd();
        return;
      }

      progress -= (e.deltaY * 0.10);
      progress = progress < 0 ? 0 : progress;
      progress = progress > 100 ? 100 : progress;
      image_grid.dataset.progress = progress;

      image_grid.style.transform = `scale(${(2.3 * (progress/100)) + 1})`;
      image_grid_overlay.style.opacity = progress/100;

      this.childscrolling = true;

      scrollTimer = setTimeout(() => this.childscrolling = false, 500); 
    }

    const onTouchStart= (e) => {
      let progress = parseFloat(image_grid.dataset.progress || 100);
      
      if(progress > 0 && progress < 100){
        e.preventDefault();
      }

      startY = e.touches[0].clientY;
    }
    
    const onTouchMove = (e) => {
      const deltaY = startY - e.touches[0].clientY;
      startY = e.touches[0].clientY;
    
      e.deltaY = deltaY * 5;

      const rect = intro.getBoundingClientRect();
      let progress = parseFloat(image_grid.dataset.progress || 100)
      
      if(!((rect.top < 0 && progress <= 0) || (e.deltaY < 0 && progress >= 100) || (e.deltaY > 0 && progress <= 0))) e.preventDefault();

      scroll(e);
    }
    
    const onTouchEnd = () => startY = null;

    image_grid?.removeEventListener('wheel', scroll, {passive: true});
    image_grid?.removeEventListener('touchstart', onTouchStart);
    image_grid?.removeEventListener('touchmove', onTouchMove);
    image_grid?.removeEventListener('touchend', onTouchEnd, {passive: true});  

    image_grid?.addEventListener('wheel', scroll, {passive: true});
    image_grid?.addEventListener('touchstart', onTouchStart);
    image_grid?.addEventListener('touchmove', onTouchMove);
    image_grid?.addEventListener('touchend', onTouchEnd, {passive: true});  
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
              console.log('stahp')
              this.intro?.stop()
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
              console.log('start')
              this.intro?.start()
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
        // console.log(entry.isIntersecting+' '+entry.target.dataset.el)
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
    if(this.childscrolling) super.smoothScroll(1)
    else if(this.isVisible==1) super.smoothScroll()
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  async show () {
    await this.timeout(1)
    this.DOM.el?.classList.add('home-active')
    gsap.to('.home',{opacity:1,ease:Power2.easeInOut,duration:.6})

    this.addImageGridScroll();

    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0

    this.childscrolling = false;
    return super.hide()
  }
}
