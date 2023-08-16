'use strict';

import Field from './Field.js'
import Selc from '/src/js🧠🧠🧠/defaults/Selc.js'
import EventEmitter from 'events'
import AutoBind from 'auto-bind'


export default class extends EventEmitter {
  constructor(el,main){
    super()
    AutoBind(this)

    this.DOM = {
      el: el,
    }
    console.log(this.DOM.el)
    this.main = main
    this.pass1 =  new Field(this.DOM.el.querySelector('.p1Pass').parentNode)
    this.pass2 =  new Field(this.DOM.el.querySelector('.p2Pass').parentNode)
    this.btn =  this.DOM.el.querySelector(".btnPass")
    this.DOM.errors = document.body.querySelectorAll('.usercontrols_errors .error')
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
      let formdata = new FormData()
      formdata.set('pass1',encodeURIComponent(this.pass1.DOM.npt.value))
      formdata.set('pass2',encodeURIComponent(this.pass2.DOM.npt.value))
      formdata.set('userid',this.main.user.user.ID)
      console.log(this.main.acf.base)
      console.log(this.main.user.nonce)
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/setpass',{
        
        method: 'post',
        body: formdata,
        'Content-Type': 'application/json',
        'X-WP-Nonce': this.main.user.nonce
      })
      const datalog = await logtest.json()
      console.log(datalog)
      if(datalog==300){
        this.DOM.errors[2].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[2].classList.remove('act')
        },3300)
      }
      else{
        this.DOM.errors[3].classList.add('act')
        setTimeout(()=>{
          this.DOM.errors[3].classList.remove('act')
        },3300)
        this.main.user = datalog
        this.emit('resetuser')
      }
      //   // this.DOM.el
      //   console.log('badname')
      //   this.DOM.errors[0].classList.add('act')
      //   setTimeout(()=>{
      //     this.DOM.errors[0].classList.remove('act')
      //   },3300)
      // }
      // else if(datalog.code=='incorrect_password'){
      //   console.log('badpass')
      //   this.DOM.errors[1].classList.add('act')
      //   setTimeout(()=>{
      //     this.DOM.errors[1].classList.remove('act')
      //   },3300)
      // }
      // else{

      // }
      // console.log('sis')
      
  }
  removeEvents() {
     
  }
}
