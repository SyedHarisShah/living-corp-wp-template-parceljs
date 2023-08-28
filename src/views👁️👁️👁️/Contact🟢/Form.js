'use strict';

import Field from './Field.js'
import Chk from '/src/js🧠🧠🧠/defaults/Chk.js'
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
    this.main = main
    this.email =  new Field(this.DOM.el.querySelector('.emailCon'))
    this.name =  new Field(this.DOM.el.querySelector('.nameCon'))
    this.message =  new Field(this.DOM.el.querySelector(".messageCon"))
    this.check = new Chk(this.DOM.el.querySelector('.chkCon'))
    this.topic = new Selc(this.DOM.el.querySelector('.topicCon'))
    this.btn =  this.DOM.el.querySelector(".btnCon")
    this.initEvents()
  }
  
  initEvents() {
    // this.register()
    this.registerFn = () =>{
      this.email.check()
      this.name.check()
      this.topic.check()
      this.check.check()
      this.message.check()
      
      if(!this.DOM.el.querySelector('.err')){
        this.register()
      }
    }
    this.btn.addEventListener('click',this.registerFn)
  }
    async register(){
      let formdata = new FormData()
      formdata.set('email',this.email.DOM.npt.value)
      formdata.set('name',this.name.DOM.npt.value)
      formdata.set('message',this.message.DOM.npt.value)
      formdata.set('topic',this.topic.DOM.npt.value)
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/sendform',{
        
        method: 'post',
        body: formdata
        // contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        // processData: false, // NEEDED, DON'T OMIT THIS
      })
      const datalog = await logtest
      // //  console.log(datalog)
      document.body.querySelector('.contactal').classList.add('contactal-act')  
      // document.body.querySelector('.applyal').classList.add('applyal-act')  
      // this.emit('success')


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
