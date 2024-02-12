'use strict';

import Field from './Field.js'
import Chk from '/src/js🧠🧠🧠/defaults/Chk.js'
import EventEmitter from 'events'
import AutoBind from 'auto-bind'
import {linkedInLogin} from './LinkedinLogin/LinkedinLogin.js';

export default class extends EventEmitter {
  constructor(el,main){
    super()
    AutoBind(this)
    
    this.DOM = {
      el: el,
    }
    this.main = main
    this.email =  new Field(this.DOM.el.querySelector('.logEm').parentNode)
    this.password =  new Field(this.DOM.el.querySelector('.logPass').parentNode)
    this.rem =  new Chk(this.DOM.el.querySelector('.logRem').parentNode)
    this.btn =  this.DOM.el.querySelector(".btnLogin")
    this.btnLi =  this.DOM.el.querySelector(".btnLILogin")
    this.DOM.errors = this.DOM.el.querySelectorAll('.error')
    // //  console.log(this.DOM.errors)
    this.initEvents()
  }
  
  initEvents() {
    // this.login()
    this.loginFn = () =>{
      this.email.check()
      this.password.check()
      if(!this.DOM.el.querySelector('.err')){
        this.login()
      }
    }
    this.btn.addEventListener('click',this.loginFn)
    
    this.btnLi?.addEventListener('click',this.loginLI)
  }
    async login(){
      let formdata = new FormData()
      // formdata.set('username','angelperezpedrosa@gmail.com')
      // formdata.set('password',encodeURIComponent('jy1&K7w)i14O$BDCtC'))
      // //  console.log(this.email.DOM.npt.value)
      // //  console.log(this.password.DOM.npt.value)
      formdata.set('username',this.email.DOM.npt.value)
      formdata.set('password',encodeURIComponent(this.password.DOM.npt.value))
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/login',{
        
        method: 'post',
        body: formdata
      })
      const datalog = await logtest.json()
      // //  console.log(datalog)
      if(datalog.code=='empty_username'){
        // this.DOM.el
        // //  console.log('badname')
        this.DOM.errors[0].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[0].classList.remove('act')
        },3300)
      }
      else if(datalog.code=='incorrect_password'){
        // //  console.log('badpass')
        this.DOM.errors[1].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[1].classList.remove('act')
        },3300)
      }
      else{
        this.main.user = datalog
        // //  console.log('login is made')
        // //  console.log(this.main)
        // this.emit('login')
        window.location.reload();
      }
      
  }

  async loginLI(){
    await linkedInLogin(this.main.acf);

    const finishLogin = setInterval(() => {
      if(window.loginFinished){
        this.main.user = window.loginFinished
        // //  console.log('linkedin login is made')
        // //  console.log(this.main)
        this.emit('login')

        clearInterval(finishLogin)
      }
    })
  }

  removeEvents() {
     
  }
}
