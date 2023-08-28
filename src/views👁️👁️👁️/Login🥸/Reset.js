'use strict';

import Field from './Field.js'
import EventEmitter from 'events'
import AutoBind from 'auto-bind'


export default class extends EventEmitter {
  constructor(el,main){
    super()
    AutoBind(this)

    this.DOM = {
      el: el,
    }
    this.main = main
    this.pass1 =  new Field(this.DOM.el.querySelector('.recPass1').parentNode)
    this.pass2 =  new Field(this.DOM.el.querySelector('.recPass2').parentNode)
    this.btn =  this.DOM.el.querySelector(".btnRecpass")
    this.DOM.errors =  this.DOM.el.querySelectorAll('.error')
    this.initEvents()
  }
  
  initEvents() {
    // this.pass()
    this.passFn = () =>{
      this.pass1.check()
      this.pass2.check()
      
      if(!this.DOM.el.querySelector('.err')){
        this.pass()
      }
    }
    this.btn.addEventListener('click',this.passFn)
  }
    async pass(){
      const urlParams = new URLSearchParams(window.location.search)
      const loginpar = urlParams.get('login')
      const keypar = urlParams.get('key')
      let formdata = new FormData()
      // //  console.log(this.pass1.DOM.npt.value)
      // //  console.log(this.pass2.DOM.npt.value)
      formdata.set('pass1',encodeURIComponent(this.pass1.DOM.npt.value))
      const pass1 = encodeURIComponent(this.pass1.DOM.npt.value)
      const pass2 = encodeURIComponent(this.pass2.DOM.npt.value)
      const login = loginpar
      const key = encodeURIComponent(keypar)
      // formdata.set('pass2',encodeURIComponent(this.pass2.DOM.npt.value))
      // formdata.set('login',encodeURIComponent(loginpar))
      // formdata.set('pass2',encodeURIComponent(keypar))
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/recoverpass?pass1='+pass1+'&pass2='+pass2+'&key='+key+'&login='+login,{
        method: 'GET'
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
        this.DOM.errors[1].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[1].classList.remove('act')
        },3300)
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
  removeEvents() {
     
  }
}
