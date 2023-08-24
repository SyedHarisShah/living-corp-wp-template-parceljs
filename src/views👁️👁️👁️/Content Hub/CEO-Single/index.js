import Page from '../../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import dad from 'bundle-text:./templatedad.eta'
import show from 'bundle-text:/src/views👁️👁️👁️/ETA/showlist.eta'
import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'

//COMPS
import Dualintro from '/src/js🧠🧠🧠/components🦾/Dualintro.js'

import * as Eta from 'eta'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    //${process.env.PUBLIC_URL}/wp-json/wp/v2/podcast/40?acf_format=standard
    // const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/ceos/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    let ceo_link = '#';

    const ch_menu_links = this.main?.acf?.ch_menu_links || [];

    ch_menu_links.forEach(x => {
      const url = x.link.url;
      const title = x.link.title.toLowerCase();
      if(title.includes('ceo')) ceo_link = url;
    });

    let html

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

    html = Eta.render(dad,{global:this.main,data:data,footer:this.footer, ceo_link})
    
      
    // //  console.log(data)
    // //  console.log(html)
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')

    }
    if(this.DOM.el.querySelector('.showchild_main')){
      this.playFn = () =>{
        this.DOM.el.querySelector('.showchild_main').classList.add('act')
        let src = this.DOM.el.querySelector('.showchild_main .btnplay').dataset.video
        this.DOM.el.querySelector('.showchild_main iframe').setAttribute('src',src)
        
      }
      this.DOM.el.querySelector('.showchild_main .btnplay').addEventListener('click',this.playFn)
    }
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    

    

    await this.loadImages()
    await this.createAnimations()


    if(this.DOM.el.querySelector('.m-dualintro')){
    this.slide = new Dualintro(this.DOM.el.querySelector('.m-dualintro'))
    }
    if(data.parent==0){
      this.DOM.holder = this.DOM.el.querySelector('.hPosts')
      this.DOM.pages = this.DOM.el.querySelector('.pPosts')
      // //  console.log(this.DOM.holder)
      await this.getPosts(true,'show',data.id,8,1)
    }
    else{
      if(this.DOM.el.querySelector('.hidetext')){
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
      }
    }
  }

  changeHeader() {
    const el = document.querySelector(".m-dualintro");
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

  async getJson(url,isNew){
    const posts = await fetch(url)
    const datap = await posts.json()

    // //  console.log(datap)

    this.html = Eta.render(show,{global:this.main,posts:datap.posts})
    // this.ajaxImages()
    this.DOM.holder.innerHTML = this.html
    if(isNew==true){
      this.actualpage = 1
      this.max = datap.maxpages
    }
    await this.ajaxImages()
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

  async blocksClick (type){
    this.DOM.holder.classList.add('load')
    await this.timeout(600)
    if(type=='block'){
      this.DOM.holder.classList.add('blocks')
    }
    else{
      this.DOM.holder.classList.remove('blocks')

    }
    this.DOM.holder.classList.remove('load')
    this.resizeLimit()
  }


  async getPosts(isNew,type,id,postperpage,page){
    this.DOM.holder.classList.add('load')
    Promise.all([
      this.timeout(600),
      this.getJson(this.main.acf.base+'/wp-json/wp/v2/getposts?type='+type+'&parent='+id+'&page='+page+'&perpage='+postperpage,isNew)
      
    ]).then(() => {
      this.DOM.holder.classList.remove('load')
      if(isNew == true){
        // //  console.log(this.max)
        for(let i = 1;i<=this.max;i++){
          if(i == page){
            this.DOM.pages.innerHTML += '<div class="pgel mouseHover act"><div class="pgel_t">'+i+'</div></div>'
  
          }
          else{
            this.DOM.pages.innerHTML += '<div class="pgel mouseHover"><div class="pgel_t">'+i+'</div></div>'
  
          }
        }
        this.DOM.pagsel = this.DOM.pages.querySelectorAll('.pgel')
        if(this.DOM.pagsel.length == 1){
          this.DOM.pages.classList.add('hide')
        }
        for(let [index,el] of this.DOM.pagsel.entries()){
          el.onclick = event =>{
            
            this.getPosts(false,type,id,postperpage,index+1)
          
          }
        }
        
      }
      else{
        this.DOM.pagsel[this.actualpage-1].classList.remove('act')
        this.actualpage = page
        this.DOM.pagsel[this.actualpage-1].classList.add('act')

      }
      this.resizeLimit()
      this.emit('linkseventlisteners')
      this.emit('mousereset')
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
              // //  console.log(this.anims[pos])
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
    await this.timeout(1)
    // gsap.to('.home',{opacity:1,ease:Power2.easeInOut,duration:.6})
    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0
    return super.hide()
  }
}
