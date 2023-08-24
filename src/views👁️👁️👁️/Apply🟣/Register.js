'use strict';

import Field from './Field.js'
import Chk from '/src/js🧠🧠🧠/defaults/Chk.js'
import File from './File.js'
import EventEmitter from 'events'
import AutoBind from 'auto-bind'


export default class extends EventEmitter {
  constructor(el,global,job){
    super()
    AutoBind(this)

    this.DOM = {
      el: el,
    }
    this.main = main
    this.job = job
    this.email =  new Field(this.DOM.el.querySelector('.emailAp'))
    this.name =  new Field(this.DOM.el.querySelector('.nameAp'))
    this.message =  new Field(this.DOM.el.querySelector(".messageAp"))
    this.file = new File(this.DOM.el.querySelector('.file'))
    this.check = new Chk(this.DOM.el.querySelector('.chkAp'))
    this.btn =  this.DOM.el.querySelector(".btnReg")
    this.initEvents()
  }
  
  initEvents() {
    // this.register()
    this.registerFn = () =>{
      this.email.check()
      this.name.check()
      this.file.check()
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
      formdata.set('file',this.file.file,this.file.file.name)
      formdata.set('userid',this.main.user.user.ID)
      formdata.set('jobid',this.job.id)
      const logtest = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/sentjob',{
        
        method: 'post',
        body: formdata,
        'Content-Type': 'false',
        'Process-Data': 'false',
        'X-WP-Nonce': this.main.user.nonce
        // contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        // processData: false, // NEEDED, DON'T OMIT THIS
      })
      const datalog = await logtest
      // //  console.log(datalog)
      document.body.querySelector('.applyal').classList.add('applyal-act')  
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
