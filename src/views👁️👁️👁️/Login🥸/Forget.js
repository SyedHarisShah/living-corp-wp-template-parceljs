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
    this.email =  new Field(this.DOM.el.querySelector('.emFor').parentNode)
    this.btn =  this.DOM.el.querySelector(".btnForget")
    this.DOM.errors = this.DOM.el.querySelectorAll('.error')
    // //  console.log(this.DOM.errors)
    this.initEvents()
  }
  
  initEvents() {
    // this.login()
    this.forgetpassFn = () =>{
      this.email.check()
      if(!this.DOM.el.querySelector('.err')){
        this.forgetpass()
      }
    }
    this.btn.addEventListener('click',this.forgetpassFn)
  }
    async forgetpass(){
      let formdata = new FormData()
      // formdata.set('username','angelperezpedrosa@gmail.com')
      // formdata.set('password',encodeURIComponent('jy1&K7w)i14O$BDCtC'))
      // //  console.log(this.email.DOM.npt.value)
      formdata.set('email',this.email.DOM.npt.value)
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/forgetpassword?email='+this.email.DOM.npt.value,{
        
      })
      const datalog = await logtest.json()
      // //  console.log(datalog)
      if(datalog=='300'){
        // this.DOM.el
        // //  console.log('badmail')
        this.DOM.errors[0].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[0].classList.remove('act')
        },3300)
      }
      else if(datalog=='200'){
        this.DOM.errors[1].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[1].classList.remove('act')
        },3300)
      }
      
      
  }
  removeEvents() {
     
  }
}
