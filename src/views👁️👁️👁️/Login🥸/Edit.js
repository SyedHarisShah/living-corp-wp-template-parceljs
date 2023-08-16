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
    this.email =  new Field(this.DOM.el.querySelector('.emailEdit').parentNode)
    this.first =  new Field(this.DOM.el.querySelector('.firstEdit').parentNode)
    this.last =  new Field(this.DOM.el.querySelector('.lastEdit').parentNode)
    this.pronoun =  new Selc(this.DOM.el.querySelector(".pronounEdit").parentNode)
    this.btn =  this.DOM.el.querySelector(".btnEdit")
    this.DOM.errors = document.body.querySelectorAll('.usercontrols_errors .error')
    this.initEvents()
  }
  
  initEvents() {
    // this.edit()
    this.editFn = () =>{
      this.email.check()
      this.first.check()
      this.last.check()
      
      if(!this.DOM.el.querySelector('.err')){
        this.edit()
      }
    }
    this.btn.addEventListener('click',this.editFn)
  }
    async edit(){
      let formdata = new FormData()
      formdata.set('email',this.email.DOM.npt.value)
      formdata.set('first_name',this.first.DOM.npt.value)
      formdata.set('last_name',this.last.DOM.npt.value)
      formdata.set('pronoun',this.pronoun.DOM.npt.value)
      formdata.set('pronoun',this.pronoun.DOM.npt.value)
      formdata.set('userid',this.main.user.user.ID)
      console.log(this.main.acf.base)
      console.log(this.main.user.nonce)
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/editinfo',{
        
        method: 'post',
        body: formdata,
        'Content-Type': 'application/json',
        'X-WP-Nonce': this.main.user.nonce
      })
      const datalog = await logtest.json()
      console.log(datalog)
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
        console.log('edit and emit login')
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
