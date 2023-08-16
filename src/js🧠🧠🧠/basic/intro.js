import gsap from 'gsap'

import Component from '../defaults/Component'
import intro from 'bundle-text:/src/views👁️👁️👁️/ETA/intro.eta'
import signin from 'bundle-text:/src/views👁️👁️👁️/ETA/signin.eta'
import * as Eta from 'eta'
import AutoBind from 'auto-bind'

export default class extends Component {
  constructor (main) {
    super({

      element: document.documentElement,
    })

    AutoBind(this)
    this.main = main


  }
  async initSignIn () {
    
    var is_accepted = localStorage.getItem('sign_LC');

    const params = new URLSearchParams(window.location.search);

    const isEmbed = params.get('isEmbed') != null;
    const hidePopup = document.getElementById('content')?.dataset?.signupal === 'hide';

    if (!(is_accepted || isEmbed || hidePopup)) {
      let string = Eta.render(signin,{global:this.main})
      setTimeout(()=>{
        document.querySelector('body').insertAdjacentHTML('afterbegin',string)
        this.signup = document.documentElement.querySelector('.signupal')
        setTimeout(()=>{

          this.emit('linkseventlisteners')
          this.signup.classList.add('signupal-act')
        },1000*120)

        


        this.closeSBg = this.signup.querySelector('.signupal_bg')
        this.closeS = this.signup.querySelector('.signupal_close')
        this.closeSBtn = this.signup.querySelector('.btn')
        console.log(this.closeSBtn)

        this.clickModal = (type) =>{
          localStorage.setItem('sign_LC',true)
          this.signup.classList.remove('signupal-act')
          setTimeout(()=>{
    
            this.signup.remove()
          },800)
          if(type==1){
            this.emit('tochange')
          }
        }

        this.closeSBg.addEventListener('click',()=>this.clickModal(0))
        this.closeS.addEventListener('click',()=>this.clickModal(0))
        this.closeSBtn.addEventListener('click',()=>this.clickModal(1))
      },6000)
    }
  }
  async init () {

    var is_accepted = true;//localStorage.getItem('intro_LC')
    
    if (is_accepted) {
      this.initSignIn()
      return false
    }
    else{
      let string = Eta.render(intro,{global:this.main})
      document.querySelector('body').insertAdjacentHTML('afterbegin',string)
      this.intro = document.documentElement.querySelector('.introloader')
      setTimeout(()=>{
        document.documentElement.classList.add('intro-act')

        this.intro.classList.add('act')
      },10)
      this.initEvents()

      return true
    }
    
    // this.timeline = gsap.timeline()

    // this.timeline.to(this.element, {
    //   autoAlpha: 0,
    //   duration: 1
    // })

    // this.timeline.call(_ => {
    //   console.log('compit')
    //   this.emit('complete')
    // })

  }
  initEvents(){
    this.clickEnd = () =>{
      localStorage.setItem('intro_LC',true)
      document.documentElement.classList.remove('intro-act')
      this.initSignIn()
      gsap.to(this.intro,{opacity:0,
        onComplete:()=>{
          this.intro.remove()
        }
      })
      this.emit('closeintro')
      
    }


    this.closeIntro = this.intro.querySelector('.btnCloseIntro')
    this.closeIntro.addEventListener('click',this.clickEnd)


    
  }
}
