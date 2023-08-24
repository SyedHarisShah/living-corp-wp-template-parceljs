import Page from '../../js🧠🧠🧠/defaults/Page'
import tag from 'bundle-text:./tag.eta'
import networklist from 'bundle-text:/src/views👁️👁️👁️/ETA/network.eta'
import podcastlist from 'bundle-text:/src/views👁️👁️👁️/ETA/podcast.eta'
import taglist from 'bundle-text:/src/views👁️👁️👁️/ETA/tag.eta'
import showlist from 'bundle-text:/src/views👁️👁️👁️/ETA/show.eta'

import * as Eta from 'eta'
import { getLoadingWheel } from '../Login🥸/LinkedinLogin/Dialog'


export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  /**
   * Animations.
   */
  async generate(content) {
    let html = ''
    this.template = content.dataset.template
    this.main.title = content.dataset.title;
    this.tag_id = content.dataset.id;

    html = Eta.render(tag,{global:this.main,footer:this.footer})
    document.querySelector('#content').innerHTML += html
    this.DOM = {
      el:document.querySelector('main:not(.old)')

    }
    this.DOM.holder = this.DOM.el.querySelector('.hPosts')
    this.DOM.pages = this.DOM.el.querySelector('.pPosts')
    await this.getPosts(true,0,8,1)

    // console.log(data)
    // console.log(html)
    
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    
    this.DOM.addTagBtn = this.DOM.el.querySelector('.tag-add-btn');
    this.DOM?.addTagBtn?.addEventListener("click", () => this.setInterest(this.DOM.addTagBtn));
    
    await this.loadImages()
    await this.createAnimations()


  }

  async setInterest(el){
    el.innerHTML = getLoadingWheel();

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
    el.innerHTML = "Remove from interests";
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
    el.innerHTML = "Add to interests";
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


  async getJson(url,isNew){
    // console.log(url)
    const posts = await fetch(url)
    const datap = await posts.json()

    this.html = Eta.render(taglist,{global:this.main,posts:datap.posts})

    this.DOM.holder.innerHTML = this.html
    // this.ajaxImages()
    if(isNew==true){
      this.actualpage = 1
      this.max = datap.maxpages <= 8 ? datap.maxpages : 8
    }
    await this.ajaxImages()
  }

  async getPosts(isNew,id,postperpage,page){
    this.DOM.holder.classList.add('load')
    Promise.all([
      this.timeout(600),
      this.getJson(`${this.main.acf.base}/wp-json/wp/v2/getposts?type=${this.template}&tag_id=${this.tag_id}&parent=${id}&page=${page}&perpage=${postperpage}`,isNew)
      
    ]).then(() => {
      this.DOM.holder.classList.remove('load')
      if(isNew == true && this.DOM.pages){
        // console.log(this.max)
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
            
            this.getPosts(false,id,postperpage,index+1)
          
          }
        }
        if(this.DOM.el.querySelector('.sPosts')){
          for(let el of this.DOM.el.querySelectorAll('.sPosts .blockClick')){
            el.onclick = ev =>{
              this.DOM.el.querySelector('.blockClick.act').classList.remove('act')
              el.classList.add('act')
              this.blocksClick(el.dataset.type)
            }

          }

        }
      }
      else{
        if(this.DOM.pages){
          this.DOM.pagsel[this.actualpage-1].classList.remove('act')
          this.actualpage = page
          this.DOM.pagsel[this.actualpage-1].classList.add('act')
        }

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
