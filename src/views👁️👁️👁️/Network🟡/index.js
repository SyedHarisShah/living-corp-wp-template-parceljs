import Page from '../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import dad from 'bundle-text:./templatedad.eta'
import child from 'bundle-text:./templatechild.eta'
import podcastlist from 'bundle-text:/src/views👁️👁️👁️/ETA/podcastlist.eta'
import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'

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
    //${"http://165.227.64.123:8126/"}/wp-json/wp/v2/podcast/40?acf_format=standard
    // const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
    // console.log(this.main.acf.base+'/wp-json/wp/v2/network/'+content.dataset.id+'?acf_format=standard')
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/network/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    // console.log(data)
    // console.log(this.main)
    let html = ''

    let load = true;

    if(this?.main?.user && (data?.acf?.add_to_collective || data?.parent_data?.add_to_collective) && !this?.main?.user?.acf?.is_content_hub_user){
      html = Eta.render(noaccess,{global:this.main,data:data,footer:this.footer})
      load = false;
    } else if(data.parent==0){
      
      
      html = Eta.render(dad,{global:this.main,data:data,footer:this.footer})
      
    }
    else{
      let Difference_In_Time = new Date(data.date).getTime() - new Date().getTime()
      this.Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)

      // hide content behind login if older than 56 days / 8 weeks
      // (number should be negative)
      const numDayLimit = -56;

      if(this.Difference_In_Days < numDayLimit && !this.main.user){
        html = Eta.render(notlogged,{global:this.main,data:data,footer:this.footer})
      }
      else{
        html = Eta.render(child,{global:this.main,data:data,footer:this.footer})
        
      }
      
    }
    // console.log(data)
    // console.log(html)
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')

    }
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    

    

    await this.loadImages()
    await this.createAnimations()


    if(this.DOM.el.querySelector('.m-dualintro')){
    this.slide = new Dualintro(this.DOM.el.querySelector('.m-dualintro'))
    }
    if(data.parent==0 && load){
      this.DOM.holder = this.DOM.el.querySelector('.hPosts')
      this.DOM.pages = this.DOM.el.querySelector('.pPosts')
      await this.getPosts(true,'network',data.id,-1,1)
    }
    else{

      if(this.Difference_In_Days < -14  && !this.main.user){

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
              // console.log(this.sticks)
              this.DOM.clicktext.classList.add('act')
              this.timeline = gsap.timeline(({paused:true}))
              // .to(this.sticks[0].stick.son,{duration:.6,y:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight)+'px'},'a')
              // .to(this.sticks[0].stick,{duration:.6,current:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight),target:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight)},'a')
              .to(this.DOM.hidetext,{height:this.DOM.holdtext.clientHeight+'px',duration:.6,
                onUpdate:()=>{
                  // console.log(this.sticks)
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
  }

  async getJson(url,isNew){
    const posts = await fetch(url)
    const datap = await posts.json()

    this.html = Eta.render(podcastlist,{global:this.main,posts:datap.posts})
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
        // console.log(this.max)
        // for(let i = 1;i<=this.max;i++){
        //   if(i == page){
        //     this.DOM.pages.innerHTML += '<div class="pgel act"><div class="pgel_t">'+i+'</div></div>'
  
        //   }
        //   else{
        //     this.DOM.pages.innerHTML += '<div class="pgel"><div class="pgel_t">'+i+'</div></div>'
  
        //   }
        // }
        // this.DOM.pagsel = this.DOM.pages.querySelectorAll('.pgel')
        // for(let [index,el] of this.DOM.pagsel.entries()){
        //   el.onclick = event =>{
            
        //     this.getPosts(false,type,id,postperpage,index+1)
          
        //   }
        // }
        // if(this.DOM.el.querySelector('.sPosts')){
        //   for(let el of this.DOM.el.querySelectorAll('.sPosts .blockClick')){
        //     el.onclick = ev =>{
        //       console.log(el)
        //       this.DOM.el.querySelector('.blockClick.act').classList.remove('act')
        //       el.classList.add('act')
        //       this.blocksClick(el.dataset.type)
        //     }

        //   }

        // }
      }
      else{
        this.DOM.pagsel[this.actualpage-1].classList.remove('act')
        this.actualpage = page
        this.DOM.pagsel[this.actualpage-1].classList.add('act')

      }

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
    }
    
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  async show () {
    await this.timeout(1)
    // this.DOM.el.classList.add('home-active')
    // gsap.to('.home',{opacity:1,ease:Power2.easeInOut,duration:.6})
    // await this.animScroll.play()
    return super.show()
  }

  async hide () {
    this.isVisible = 0
    return super.hide()
  }
}
