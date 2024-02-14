import Page from '../../js🧠🧠🧠/defaults/Page'
import Intro from './Intro.js'
import Login from './Login.js'
import Forget from './Forget.js'
import Register from './Register.js'
import Reset from './Reset.js'
import Pass from './Pass.js'
import Edit from './Edit.js'
import Delete from './Delete.js'
import ConnectLI from './ConnectLI.js'
import user from 'bundle-text:./user.eta'
import login from 'bundle-text:./login.eta'
import job from 'bundle-text:/src/views👁️👁️👁️/ETA/job.eta'
import li_dialog from 'bundle-text:./LinkedinLogin/dialog.eta'
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
  async generate() {
    let html = ''
    Eta.templates.define("li_dialog", Eta.compile(li_dialog))

    if(document.documentElement.classList.contains('logged')){
      // console.log('login-main: ', this.main);
      if(this.main.gotoplayer) {
        window.location.href = '/learn';
        return;
      }
      const response = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/topic/')
      const data = await response.json()
      if(this.main.user.acf.topics){
      let selectedids = this.main.user.acf.topics.split(',')
        for(let [key,el] of data.topics.entries()){
          for(let id of selectedids){
            if(id==el.id){
              data.topics[key].selected = true
            }
          }
        }
      }
      // //  console.log(this.main.user.acf.jobs)
      if(this.main.user.acf.jobs!=''){
      const responsejobs = await fetch(this.main.acf.base+'/wp-json/wp/v2/getjobs?jobsids='+this.main.user.acf.jobs)
      const datajobs = await responsejobs.json()
      // //  console.log(datajobs)
      this.jobshtml = Eta.render(job,{global:this.main,posts:datajobs.posts})
      }
      else{
        this.jobshtml = ''
      }

      html = Eta.render(user,{global:this.main,data:data.topics,jobs:this.jobshtml})
      document.querySelector('#content').innerHTML += html
      // document.querySelector('#content').innerHTML += '<main>###</main>'
      this.DOM = {
        el:document.querySelector('main:not(.old)')
        

      }

      //Los sections ( los tabs principales)
      this.sections = this.DOM.el.querySelectorAll('section')
      this.sectionpos = 0
      // el primero, el de config
      this.sections[this.sectionpos].style.display = 'flex'
      this.sections[this.sectionpos].classList.remove('activeSect')
      this.timeout(12)
      this.sections[0].classList.add('activeSect')
      //El segundo, el de edición
      this.edit = new Edit(this.DOM.el.querySelector('.datap'),this.main)
      this.edit.on('resetuser',()=>{
        this.main.user = this.pass.main.user
        this.emit('globalchange')
      })
      
      this.pass = new Pass(this.DOM.el.querySelector('.datap'),this.main)
      this.pass.on('resetuser',()=>{
        this.main.user = this.pass.main.user
        this.emit('globalchange')
      })
            
      this.pass = new Delete(this.DOM.el.querySelector('.datap'),this.main)
      this.pass.on('resetuser',()=>{
        this.main.user = false
        this.emit('globalchange')
        this.emit('gotohome')
      })

      this.pass = new ConnectLI(this.DOM.el.querySelector('.datap'),this.main)
      // this.pass.on('resetuser',()=>{
      //   this.main.user = false
      //   this.emit('globalchange')
      //   this.emit('gotohome')
      // })


      this.sectionselector = this.DOM.el.parentNode.querySelectorAll('.usercontrols_top .simp')

      this.sectionFn = async (index,el) =>{
        // //  console.log(index)
        if(index==0){
          if(this.pos==4){
            this.opholderFn(0)
          }
          
          this.sectionselector[this.sectionpos].classList.remove('act')
          this.DOM.bottomops.classList.add('actBottom')
          this.sections[this.sectionpos].classList.remove('activeSect')
          await this.timeout(610)
          if(!this.main.isTouch){
            this.scroll.current = 0
            this.scroll.target = 0
            this.DOM.el.style[this.transform] = `translate3d(0, 0px, 0)`
          }
          this.sections[this.sectionpos].style.display='none'
          this.sectionpos = index
          this.sections[this.sectionpos].style.display='flex'
          await this.timeout(12)
          this.sectionselector[this.sectionpos].classList.add('act')
          this.sections[this.sectionpos].classList.add('activeSect')
        }
        else if(index==3){
          
          const response = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/logout/')
          this.main.user = false;
          document.documentElement.classList.remove('logged')
          document.documentElement.classList.remove('is_shared')
          this.emit('globalchange')
          this.emit('gotohome')
        }
        else{
          this.DOM.bottomops.classList.remove('actBottom')
          this.sectionselector[this.sectionpos].classList.remove('act')
          this.sections[this.sectionpos].classList.remove('activeSect')
          await this.timeout(610)
          if(!this.main.isTouch){
            this.scroll.current = 0
            this.scroll.target = 0
            this.DOM.el.style[this.transform] = `translate3d(0, 0px, 0)`
          }
          this.sections[this.sectionpos].style.display='none'
          this.sectionpos = index
          this.sections[this.sectionpos].style.display='flex'
          await this.timeout(12)
          this.sectionselector[this.sectionpos].classList.add('act')
          this.sections[this.sectionpos].classList.add('activeSect')
        }
        this.resizeLimit()
      }

      for(let [index,el] of this.sectionselector.entries()){
        el.addEventListener('click',()=>this.sectionFn(index,el))
      }


      // Las ops de abajo 
      this.DOM.bottomops = this.DOM.el.parentNode.querySelector('.usercontrols_bottom')
      if(this.main.user.acf.info_selected!=true){
        setTimeout(()=>{
          this.DOM.bottomops.classList.add('actBottom')

        },1600)
      }

     //LOS RADS
      this.clickRadFn = (el,key,dad) =>{
        // //  console.log(el)
        if(el.classList.contains('act')){
          // for(let other of this.ops[key]){
          //   other.classList.remove('act')
          // }

        }
        else{
          this.DOM.btnnext.classList.remove('inact')
          for(let other of this.ops[dad]){
            other.classList.remove('act')
          }
          el.classList.add('act')
          this.pags[dad+1].classList.remove('dis')
          if(this.DOM.el.querySelector('.userp_form_'+(dad+1)) && dad!=2){
            if(this.DOM.el.querySelector('.userp_form_'+(dad+1)+' .userp_form_ops.activeOp')){

            this.DOM.el.querySelector('.userp_form_'+(dad+1)+' .userp_form_ops.activeOp').classList.remove('activeOp')
            }
            this.DOM.el.querySelectorAll('.userp_form_'+(dad+1)+' .userp_form_ops')[key].classList.add('activeOp')
          
          }
          if(dad==0 && this.DOM.el.querySelector('.userp_form_1 .rad.act')){
            this.DOM.el.querySelector('.userp_form_1 .rad.act').classList.remove('act')
            // this.pags[1].classList.add('dis')
            this.pags[2].classList.add('dis')
          }
          if((dad==0 || dad==1) && this.DOM.el.querySelector('.userp_form_2 .rad.act')){
            this.DOM.el.querySelector('.userp_form_2 .rad.act').classList.remove('act')
            
            // this.pags[3].classList.add('dis')
          }
        }




      }
      

      this.ops =[]
      this.ops.push(this.DOM.el.querySelectorAll('.userp_form_0 .rad'))
      this.ops.push(this.DOM.el.querySelectorAll('.userp_form_1 .rad'))
      this.ops.push(this.DOM.el.querySelectorAll('.userp_form_2 .rad'))
      


      for(let [key,el] of this.ops[0].entries()){
        el.addEventListener('click',()=>this.clickRadFn(el,key,0))
      }

      for(let [key,el] of this.ops[1].entries()){
        el.addEventListener('click',()=>this.clickRadFn(el,key,1))
      }

      for(let [key,el] of this.ops[2].entries()){
        el.addEventListener('click',()=>this.clickRadFn(el,key,2))
      }

      //LOS CHECKS
      this.clickCheckFn = (el) =>{
        if(el.classList.contains('act')){
          el.classList.remove('act')

        }
        else{
          el.classList.add('act')
        }
        if(this.DOM.el.querySelector('.userp_form_3 .check.act')){
          this.DOM.btnnext.classList.remove('inact')
        }
        else{
          this.DOM.btnnext.classList.add('inact')

        }
      }


      this.ops.push(this.DOM.el.querySelectorAll('.userp_form_3 .check'))
      for(let [key,el] of this.ops[3].entries()){
        el.addEventListener('click',()=>this.clickCheckFn(el))
      }

      this.pos = 0
      //Los ops son los articles, que son los elementos para la modificación del perfil
      this.opholder = this.sections[0].querySelectorAll('article')

      

      this.opholderFn = async (num=null) =>{
        this.pags[this.pos].classList.remove('act')
        this.opholder[this.pos].classList.remove('activeArt')
        if(num!=4 && num!=null){
          this.DOM.bottomops.classList.add('actBottom')
        }
        await this.timeout(610)
        this.opholder[this.pos].style.display='none'
        const oldnum = this.pos
        if(num!=null){
          this.pos=num
        }
        else{
          this.pos++
        }
        if(this.pos==3){
          this.DOM.btnnext.classList.add('btn-last')

        }
        else{
          this.DOM.btnnext.classList.remove('btn-last')
        }
        this.opholder[this.pos].style.display='flex'
        await this.timeout(10)
        this.opholder[this.pos].classList.add('activeArt')
        this.resizeLimit()
        this.pags[this.pos].classList.remove('dis')
        this.pags[this.pos].classList.add('act')
        // //  console.log(this.opholder[this.pos])
        if(!this.opholder[this.pos].querySelector('.rad.act') && !this.opholder[this.pos].querySelector('.check.act')){
          
          this.DOM.btnnext.classList.add('inact')
            
          
          
        }
        else{
          
          this.DOM.btnnext.classList.remove('inact')
        }
        // if(!this.opholder[this.pos].querySelector('.check.act')){
        //   this.DOM.btnnext.classList.add('inact')
        // }
        // else{
        //   this.DOM.btnnext.classList.remove('inact')
        // }
        this.opholder[this.pos].classList.add('activeArt')
       
      }

      this.pags = this.DOM.el.parentNode.querySelectorAll('.pgel')

      this.backs = this.DOM.el.querySelectorAll('.btnBack')
      for(let[i,el] of this.backs.entries()){

        el.addEventListener('click',()=>this.opholderFn(i))
      }
      this.pags = this.DOM.el.parentNode.querySelectorAll('.pgel')
      for(let[i,el] of this.pags.entries()){

        el.addEventListener('click',()=>this.opholderFn(i))
      }
      this.DOM.btnnext = this.DOM.el.parentNode.querySelector('.btnNext')
      this.clickNext = async () =>{
        if(this.pos==3){
          this.opholder[this.pos].classList.remove('activeArt')
          this.pags[this.pos].classList.remove('act')
          let formdata = new FormData()
          if(this.DOM.el.querySelector('.userp_form_0 .rad.act')){
            formdata.set('option_0',this.DOM.el.querySelector('.userp_form_0 .rad.act').dataset.value)

          }
          if(this.DOM.el.querySelector('.userp_form_1 .rad.act')){
            formdata.set('option_1',this.DOM.el.querySelector('.userp_form_1 .rad.act').dataset.value)
            
          }
          if(this.DOM.el.querySelector('.userp_form_2 .rad.act')){
            formdata.set('option_2',this.DOM.el.querySelector('.userp_form_2 .rad.act').dataset.value)
            
          }
          if(this.DOM.el.querySelector('.userp_form_3 .check.act')){
            const checks = this.DOM.el.querySelectorAll('.userp_form_3 .check.act')
            let checksid =''
            let cont = 0
            for(let [key,el] of checks.entries()){
              if(key==0){
                checksid+=el.dataset.id
              }
              else{
                checksid+=','+el.dataset.id

              }
            }
            formdata.set('topics',checksid)
          }
          formdata.set('userid',this.main.user.user.ID)
          // //  console.log(formdata.get('userid'))
          const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/preferences',{
            method: 'post',
            body: formdata,
            'Content-Type': 'application/json',
            'X-WP-Nonce': this.main.user.nonce // here you used the wrong name
            
          })
          const datalog = await logtest.json()
          // //  console.log(datalog)
          await this.timeout(610)
          this.opholder[this.pos].style.display='none'
          this.pos=4
          this.opholder[this.pos].style.display='flex'
          await this.timeout(10)
          this.opholder[this.pos].classList.add('activeArt')

          this.DOM.bottomops.classList.remove('actBottom')
          
        }
        else{
          this.opholderFn()

        }

      }
      this.DOM.btnnext.addEventListener('click',this.clickNext)
      

      this.opholder[this.pos].style.display='flex'
      await this.timeout(1)
      this.opholder[this.pos].classList.add('activeArt')

      if(this.main.user.acf.info_selected==true){
        this.opholderFn(4)
      }
      else{
        this.sectionselector[0].classList.add('act')
      }

      this.DOM.btnstart = this.DOM.el.querySelector('.btnToStart')
      this.clickStart = () =>{
        this.opholderFn(0)
        this.sectionselector[0].classList.add('act')
      }
      this.DOM.btnstart.addEventListener('click',this.clickStart)
      this.DOM.btnnext.addEventListener('click',this.clickNext)


    }
    else{
      const urlParams = new URLSearchParams(window.location.search)
      const loginpar = urlParams.get('login')

      document.documentElement.classList.remove('is_shared')
      
      // const response = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/list/')
      // const data = await response.json()
      
      if(loginpar!='expired' && loginpar!=null){

        html = Eta.render(login,{global:this.main,recover:true})
      }
      else{
        html = Eta.render(login,{global:this.main,recover:false})

      }
      document.querySelector('#content').innerHTML += html
      this.DOM = {
        el:document.querySelector('main:not(.old)')
        
  
      }

      this.login = new Login(this.DOM.el.querySelector('.logintab'),this.main)
      this.register = new Register(this.DOM.el.querySelector('.signuptab'),this.main)
      this.forget = new Forget(this.DOM.el.querySelector('.forgettab'),this.main)
      this.reset = new Reset(this.DOM.el.querySelector('.resettab'),this.main)

      this.reset.on('login',()=>{
        document.documentElement.classList.add('logged')
        // //  console.log('reset and emit login main reset')
        this.main.user = this.register.main.user
        this.emit('globalchange')
        this.emit('reset')
      })
      this.login.on('login',()=>{
        document.documentElement.classList.add('logged')
        // //  console.log(' emit login -> globalchange -> main reset')
        this.main.user = this.login.main.user
        // //  console.log(this.main)
        this.emit('globalchange')
        this.emit('reset')
      })
  
      this.register.on('login',()=>{
        document.documentElement.classList.add('logged')
        // //  console.log('register and emit login main reset')
        this.main.user = this.register.main.user
        this.emit('globalchange')
        this.emit('reset')
      })

      // //  console.log(urlParams)
      // //  console.log(loginpar)
      if(loginpar!='expired' && loginpar!=null){
        this.intro = new Intro(this.DOM.el.querySelector('.m-login'),2)
      }
      else{

        this.intro = new Intro(this.DOM.el.querySelector('.m-login'),true)
      }
    }
    
    this.DOM.watchers = this.DOM.el.querySelectorAll('.iO')


   
    
    
    // this.login = new Login(this.DOM.el.querySelector('.logintab'))
    // this.login = new Login(this.DOM.el.querySelector('.logintab'))
    
    
    await this.loadImages()
    await this.createAnimations()


    
    





    // fetch(document.body.dataset.js+'/wp-json/csskiller/v1/mailchimp',{
    //   method: 'get',
    //   headers : {
    //     'Content-Type': 'application/json',
    //     // 'X-WP-Nonce': document.body.dataset.nonce // here you used the wrong name
        
    //   },
    //   // credentials: 'same-origin',
      
    // }).then((data)=>{
    // //  console.log(data)
    // })
    

    // var em= 'angelperezpedrosa@gmail.com'
    // var urlne = 'https://living-corporate.us13.list-manage.com/subscribe/subscribe/post-json?u=2462c30f2ff80099eb631fecb&amp;id=fa2ff7f67c'
    // var urlap = 'https://us13.api.mailchimp.com/2.0/lists/subscribe.json?apikey=03fb47ab9900e747c89f1491bb2c126d-us13&id=fa2ff7f67c&email[email]='+em+'&double_optin=false&send_welcome=false'
    // var formdata = new FormData()
    // formdata.set('EMAIL','angelperezpedrosa@gmail.com')
    
    // setTimeout(() => {
    // //  console.log('fona?')
    //   fetch(urlap,{
       
    //   }).then((o)=>{
    //     // //  console.log(o)
    //   })
      // fetch(urlne,{
      //   method: 'post',
      //   body:formdata,
      //   headers:{
      //     'Content-Type': 'jsonp',
      //     'jsonp': 'c'
      //   },
      // }).then((o)=>{
      // //  console.log(o)
      // })
    // }, 600);

  //  this.slidrag = new Slidrag(this.DOM.el.querySelector('.swiper'))
  //  this.slidclick = new SlidClick(this.DOM.el.querySelector('.m-slidnum'))

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
    // //  console.log(url)
    const posts = await fetch(url)
    const datap = await posts.json()
    // //  console.log(datap)
    this.html = Eta.render(list,{global:this.main,posts:datap.posts})
    // //  console.log(this.html)
    // //  console.log(this.DOM.holder)
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
    if(document.querySelector('.usercontrols')){
      gsap.to('.usercontrols',{opacity:0,duration:.6,onComplete:()=>{
        
      document.documentElement.querySelector('.usercontrols').remove()
      }})
    }
    return super.hide()
  }
}
