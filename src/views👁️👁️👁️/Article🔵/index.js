import Page from '../../js🧠🧠🧠/defaults/Page'
import template from 'bundle-text:./template.eta'
import {gsap,Power2} from 'gsap'
import { clamp, lerp } from '/src/js🧠🧠🧠/basic/math.js'
import art from 'bundle-text:/src/views👁️👁️👁️/ETA/art.eta'
import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'

import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
//COMPS
// import Timer from '/src/js🧠🧠🧠/components🦾/Timer.js'

import * as Eta from 'eta'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    const response = await fetch(this.main.acf.base+'/wp-json/wp/v2/posts/'+content.dataset.id+'?acf_format=standard')
    const data = await response.json()
    // //  console.log('data', data)

    let Difference_In_Time = new Date(data.date).getTime() - new Date().getTime()
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)
    let html =''

    // hide content behind login if older than 56 days / 8 weeks
    // (number should be negative)
    const numDayLimit = -56;

    let load = true;

    if(this?.main?.user && (data?.acf?.add_to_collective || data?.parent_data?.add_to_collective) && !this?.main?.user?.acf?.is_content_hub_user){
      html = Eta.render(noaccess,{global:this.main,data:data,footer:this.footer})
      load = false;
    } else if(Difference_In_Days < numDayLimit && !this.main.user){
      html = Eta.render(notlogged,{global:this.main,data:data,footer:this.footer})

    }
    else{

      const responsetags = await fetch(this.main.acf.base+'/wp-json/wp/v2/gettags/?post='+content.dataset.id)
      const datatags = await responsetags.json()
      // //  console.log(datatags)
      html = Eta.render(template,{global:this.main,tags:datatags,data:data,footer:this.footer})
      // //  console.log(html)
    }
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')

    }
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)

    this.DOM.el.querySelectorAll('.tag-add-btn').forEach((el) => {
      el.addEventListener("click", () => this.setInterest(el));
    });
   

    await this.loadImages()
    await this.createAnimations()
    if(Difference_In_Days < -14  && !this.main.user){

    }
    else{
      await this.getRandom('post',content.dataset.id,2)

    }

    

  //  this.slidrag = new Slidrag(this.DOM.el.querySelector('.swiper'))
  //  this.slidclick = new SlidClick(this.DOM.el.querySelector('.m-slidnum'))

  }

  async setInterest(el){
    if(el.dataset.tag_set === "true"){
      this.removeInterest(el);
    }
    else{
      this.addInterest(el);
    }
  }

  async addInterest(el){
    const userid = this.main.user.user.ID;
    const tag = el.dataset.tag;
    const url = this.main.acf.base+'/wp-json/csskiller/v1/add-interest/';

    await fetch(url, {
      method: 'POST',
      body: new URLSearchParams({userid, tag})
    });

    el.dataset.tag_set = true;
    el.innerHTML = "X";
  }

  async removeInterest(el){
    const userid = this.main.user.user.ID;
    const tag = el.dataset.tag;
    const url = this.main.acf.base+'/wp-json/csskiller/v1/add-interest/';

    await fetch(url, {
      method: 'POST',
      body: new URLSearchParams({userid, tag, remove: true})
    });

    el.dataset.tag_set = false;
    el.innerHTML = "+";
  }

  async loadImages(){
    const paths = this.DOM.el.querySelectorAll('img')
    const promises = []

    for(let path of paths){
      if(path.dataset.src){
        await this.loadImage(path)
      }

    }

  


  }
  async loadImage(elem) {
    return new Promise((resolve, reject) => {
      let url = elem.dataset.src
        elem.src = url
        // //  console.log('eeee')
        elem.onload = () => {
          if(elem.naturalWidth < elem.naturalHeight){
            elem.parentNode.classList.add('portrait')
            let el = document.createElement('div')
            el.classList.add('bigger')
            el.style.display = 'none'
            elem.parentNode.appendChild(el)
          }
          resolve(elem)
        }
        elem.onerror = reject
      
    })
  }


  async getJson(url){
    const posts = await fetch(url)
    const datap = await posts.json()


    this.html = Eta.render(art,{global:this.main,posts:datap.posts})
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

  async getRandom(type,notin,postperpage){
    this.DOM.holder = this.DOM.el.querySelector('.hPosts')
    Promise.all([
      this.timeout(600),
      this.getJson(this.main.acf.base+'/wp-json/wp/v2/getrandom?type='+type+'&notin='+notin+'&perpage='+postperpage)
      
    ]).then(() => {
      this.DOM.holder.innerHTML = this.html
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
