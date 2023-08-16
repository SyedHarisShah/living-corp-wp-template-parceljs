import Page from '../../js🧠🧠🧠/defaults/Page'
import dad from 'bundle-text:./templatedad.eta'
import child from 'bundle-text:./templatechild.eta'
import icons from "../../js🧠🧠🧠/basic/icons🔰";
import learnlist from 'bundle-text:/src/views👁️👁️👁️/ETA/learnlist.eta'
import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
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
    //${"http://165.227.64.123:8126/"}/wp-json/wp/v2/learn/40?acf_format=standard
    // const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/pages/'+content.dataset.id+'?acf_format=standard')
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/learn/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    console.log(data)
    let html = ''
    if(data.parent==0){
      
      
      html = Eta.render(dad,{global:this.main,data:data,footer:this.footer})
      
    }
    else{
      if(!this.main.user){
        html = Eta.render(notlogged,{global:this.main,data:data,footer:this.footer})

      }
      else{
        html = Eta.render(child,{global:this.main,data:data,footer:this.footer, icons})
      }
    }

    // const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/login?username=&password=')
    
    
    
    // let formdata = new FormData()
    // formdata.set('username','')
    // formdata.set('password',encodeURIComponent(''))
    // const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/login',{
      
    //   method: 'post',
    //   body: formdata
    // })
    // const datalog = await logtest.json()
    // console.log(datalog)
    

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
    if(data.parent==0){
      this.DOM.holder = this.DOM.el.querySelector('.hPosts')
      this.DOM.pages = this.DOM.el.querySelector('.pPosts')
      await this.getPosts(true,'learn',data.id,8,1)
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
            console.log(this.sticks)
            this.DOM.clicktext.classList.add('act')
            this.timeline = gsap.timeline(({paused:true}))
            // .to(this.sticks[0].stick.son,{duration:.6,y:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight)+'px'},'a')
            // .to(this.sticks[0].stick,{duration:.6,current:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight),target:'+='+(this.DOM.holdtext.clientHeight - this.DOM.hidetext.clientHeight)},'a')
            .to(this.DOM.hidetext,{height:this.DOM.holdtext.clientHeight+'px',duration:.6,
              onUpdate:()=>{
                console.log(this.sticks)
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

  async getJson(url,isNew){
    const posts = await fetch(url)
    const datap = await posts.json()


    this.html = Eta.render(learnlist,{global:this.main,posts:datap.posts})
    this.DOM.holder.innerHTML = this.html
    // this.ajaxImages()
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
        console.log(this.max)
        this.DOM.pages.innerHTML = '<div class="simp inact prev"><span>Prev</span></div>'
        for(let i = 1;i<=this.max;i++){
          if(i == page){
            this.DOM.pages.innerHTML += '<div class="pgel mouseHover act"><div class="pgel_t">'+i+'</div></div>'
  
          }
          else{
            this.DOM.pages.innerHTML += '<div class="pgel mouseHover"><div class="pgel_t">'+i+'</div></div>'
  
          }
        }
        if(this.max>2){
          this.DOM.pages.innerHTML += '<div class="simp next"><span>Next</span></div>'
        }
        else{
          this.DOM.pages.innerHTML += '<div class="simp inact next"><span>Next</span></div>'
          
        }
        this.DOM.pagsel = this.DOM.pages.querySelectorAll('.pgel')
        this.checkPages(0)
        
        for(let [index,el] of this.DOM.pagsel.entries()){
          el.onclick = async (event) =>{
            if(!this.main.isTouch){
              this.scroll.target += this.DOM.el.querySelector('.m-tabposts').getBoundingClientRect().y
              
            }
            else{
              document.body.scroll({
                top: this.DOM.el.querySelector('.m-tabposts'), 
                left: 0, 
                behavior: 'smooth'
              })
            }
            await this.timeout(600)
            this.getPosts(false,type,id,postperpage,index+1)
            this.checkPages(index)
          }
        }
        if(this.DOM.el.querySelector('.m-tabposts_pags .prev')){
          this.DOM.el.querySelector('.m-tabposts_pags .prev').onclick = async () => {
            if(!this.main.isTouch){
              this.scroll.target += this.DOM.el.querySelector('.m-tabposts').getBoundingClientRect().y
              
            }
            else{
              document.body.scroll({
                top: this.DOM.el.querySelector('.m-tabposts'), 
                left: 0, 
                behavior: 'smooth'
              })
            }

              await this.timeout(600)
              this.getPosts(false,type,id,postperpage,this.actualpage-1)
              this.checkPages(this.actualpage-1)
          }
        }

        if(this.DOM.el.querySelector('.m-tabposts_pags .next')){
          console.log(this.DOM.el.querySelector('.m-tabposts_pags .next'))
          this.DOM.el.querySelector('.m-tabposts_pags .next').onclick = async () => {
            if(!this.main.isTouch){
              this.scroll.target += this.DOM.el.querySelector('.m-tabposts').getBoundingClientRect().y
              
            }
            else{
              document.body.scroll({
                top: this.DOM.el.querySelector('.m-tabposts'), 
                left: 0, 
                behavior: 'smooth'
              })
            }

              await this.timeout(600)
              this.getPosts(false,type,id,postperpage,this.actualpage+1)
              this.checkPages(this.actualpage+1)
          }
        }

        if(this.DOM.pagsel.length == 1){
          this.DOM.pages.classList.add('hide')
        }
        if(this.DOM.el.querySelector('.sPosts')){
          for(let el of this.DOM.el.querySelectorAll('.sPosts .blockClick')){
            el.onclick = ev =>{
              console.log(el)
              this.DOM.el.querySelector('.blockClick.act').classList.remove('act')
              el.classList.add('act')
              this.blocksClick(el.dataset.type)
            }

          }

        }
      }
      else{
        this.DOM.pagsel[this.actualpage-1].classList.remove('act')
        this.actualpage = page
        this.DOM.pagsel[this.actualpage-1].classList.add('act')
        if(this.actualpage==1){
          this.DOM.el.querySelector('.m-tabposts_pags .prev').classList.add('inact')
        }
        else{
          this.DOM.el.querySelector('.m-tabposts_pags .prev').classList.remove('inact')

        }
        console.log(this.actualpage+' '+this.max)
        if(this.actualpage<this.max){
          this.DOM.el.querySelector('.m-tabposts_pags .next').classList.remove('inact')

        }
        else{
          this.DOM.el.querySelector('.m-tabposts_pags .next').classList.add('inact')

        }
      }
      this.emit('linkseventlisteners')
      this.emit('mousereset')
      this.resizeLimit()
    })
    
    


  }
  checkPages(page){
    if(this.DOM.el.querySelector('.deleter')){
      for(let el of this.DOM.el.querySelectorAll('.deleter')){
        console.log(el)
        el.remove()
      }
    }
    if(this.DOM.pagsel.length > 7){
      let control = 0
      let length = this.DOM.pagsel.length-1
      if(page < 2){
        control = 0
      }
      else if(page > (length-2)){
        control = 2
      }
      else{
        control = 1
      }
      for(let [i,pag] of this.DOM.pagsel.entries()){
        if(control==0){
          if(i==2){
            let newElement = document.createElement("div")
            newElement.innerHTML = '...'
            newElement.classList.add('points','deleter')
            pag.parentNode.insertBefore(newElement, pag.nextSibling)
          }
          if(i<3){
            pag.classList.remove('pgel-hide')
            
          }
          else{
            if(i==length){
              pag.classList.remove('pgel-hide')

            }
            else{
              pag.classList.add('pgel-hide')

            }
          }
        }
        else if(control==1){
          if(i==page-1){
            if(page!=2){
              let newElement = document.createElement("div")
              newElement.innerHTML = '...'
              newElement.classList.add('points','deleter','delete-before')
              pag.parentNode.insertBefore(newElement, pag)
            }
          }
          if(i==page+1){

            if(page!=length-2){
            let newElement = document.createElement("div")
            newElement.classList.add('points','deleter','delete-after')
            newElement.innerHTML = '...'

            pag.parentNode.insertBefore(newElement, pag.nextSibling)
            }
          }
          if(i==0){
            pag.classList.remove('pgel-hide')

          }
          else if(i == page-1 || i == page || i==page+1){
            pag.classList.remove('pgel-hide')
          }
          else if(i == length){
            pag.classList.remove('pgel-hide')

          }
          else{

            pag.classList.add('pgel-hide')
          }


        }
        else{
          if(i==length-2){
            let newElement = document.createElement("div")
            newElement.innerHTML = '...'
            newElement.classList.add('points','deleter')
            pag.parentNode.insertBefore(newElement, pag)
            
          }
          if(i>length-3){
            pag.classList.remove('pgel-hide')

          }
          else{
            if(i==0){
              pag.classList.remove('pgel-hide')

            }
            else{
              pag.classList.add('pgel-hide')

            }
          }
        }
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
            vid.play()
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
