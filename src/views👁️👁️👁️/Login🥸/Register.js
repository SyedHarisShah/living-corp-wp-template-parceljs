'use strict';

import Field from './Field.js'
import Chk from '/src/js🧠🧠🧠/defaults/Chk.js'
import Selc from '/src/js🧠🧠🧠/defaults/Selc.js'
import EventEmitter from 'events'
import AutoBind from 'auto-bind'
import { linkedInRegister } from './LinkedinLogin/LinkedinLogin.js';


export default class extends EventEmitter {
  constructor(el,main){
    super()
    AutoBind(this)

    this.DOM = {
      el: el,
    }
    this.main = main
    this.email =  new Field(this.DOM.el.querySelector('.emailReg').parentNode)
    this.first =  new Field(this.DOM.el.querySelector('.firstReg').parentNode)
    this.last =  new Field(this.DOM.el.querySelector('.lastReg').parentNode)
    this.pronoun =  new Selc(this.DOM.el.querySelector(".pronounReg").parentNode)
    this.btn =  this.DOM.el.querySelector(".btnReg")
    this.btnLi =  this.DOM.el.querySelector(".btnLIReg")
    this.DOM.errors = this.DOM.el.querySelectorAll('.error')
    // //  console.log(this.DOM.errors)
    this.initEvents()
  }
  
  initEvents() {
    // this.register()
    this.registerFn = () =>{
      this.email.check()
      this.first.check()
      this.last.check()
      
      if(!this.DOM.el.querySelector('.err')){
        this.register()
      }
    }
    this.btn.addEventListener('click',this.registerFn)
    this.btnLi?.addEventListener('click',this.registerLI)
  }
    async register(){
      let formdata = new FormData()
      // formdata.set('email','angelperezpedrosa@gmail.com')
      // formdata.set('password',encodeURIComponent('jy1&K7w)i14O$BDCtC'))
      formdata.set('email',this.email.DOM.npt.value)
      formdata.set('first_name',this.first.DOM.npt.value)
      formdata.set('last_name',this.last.DOM.npt.value)
      formdata.set('pronoun',this.pronoun.DOM.npt.value)
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/register',{
        
        method: 'post',
        body: formdata
      })
      const datalog = await logtest.json()
      // //  console.log(datalog)
      if(datalog==300){
          this.DOM.errors[0].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[0].classList.remove('act')
        },3300)
      }
      else{
        // //  console.log('register and emit login')
        this.main.user = datalog
        this.emit('login')
      }
      //   // this.DOM.el
      // //  console.log('badname')
      //   this.DOM.errors[0].classList.add('act')
      //   setTimeout(()=>{
      //     this.DOM.errors[0].classList.remove('act')
      //   },3300)
      // }
      // else if(datalog.code=='incorrect_password'){
      // //  console.log('badpass')
      //   this.DOM.errors[1].classList.add('act')
      //   setTimeout(()=>{
      //     this.DOM.errors[1].classList.remove('act')
      //   },3300)
      // }
      // else{

      // }
      // //  console.log('sis')
      
  }

  async registerLI(){
    await linkedInRegister(this.main.acf);

    const finishLogin = setInterval(() => {
      if(window.registerFinished){
        // //  console.log('linkedin register and emit login')
        
        this.main.user = window.registerFinished
        
        this.emit('login')
        clearInterval(finishLogin)
      }
    })
    
  }

  removeEvents() {
     
  }
}
