'use strict';
import Check from '../../../js🧠🧠🧠/defaults/Chk'
import Field from './Field.js'
export default class {
  constructor(el){
    this.DOM = {
      el: el,
      close:el.querySelector('.modal_close'),
      bg:el.querySelector('.modal_bg'),
      buttonclose:el.querySelector('.modal_success .btn'),
    }
    this.initEvents()
  }
  initEvents() {
    this.field = new Field(this.DOM.el.querySelector('.field'))
    this.check = new Check(this.DOM.el.querySelector('.chk'))
    this.closeFn = () =>{
      this.DOM.el.classList.remove('modal-act')
      setTimeout(()=>{

        this.DOM.el.classList.remove('modal-success')
      },760)
    }

    this.DOM.close.addEventListener('click',this.closeFn)
    this.DOM.bg.addEventListener('click',this.closeFn)
    this.DOM.buttonclose.addEventListener('click',this.closeFn)
    
    this.clickFn = () =>{
      this.field.check()
      this.check.check()
      if(!this.DOM.el.querySelector('.err')){

        // //  console.log('no error')
        fetch(document.body.dataset.js+'/wp-json/csskiller/v1/mailchimp/?email='+this.field.DOM.npt.value+'&list='+this.field.DOM.npt.dataset.list,{
            method: 'get',
            headers : {
              'Content-Type': 'application/json',
              // 'X-WP-Nonce': document.body.dataset.nonce // here you used the wrong name
              
            },
            // credentials: 'same-origin',
            
          }).then((data)=>{
            // this.closeFn()
            this.DOM.el.classList.add('modal-success')
          })
      }
      else{
        // //  console.log('error')
      }

    }
    // //  console.log(this.field.DOM.btn)
    this.field.DOM.btn.addEventListener('click',this.clickFn)
  }
  removeEvents() {
    this.DOM.close.addEventListener('click',this.closeFn)
    this.DOM.bg.addEventListener('click',this.closeFn)
    this.field.DOM.btn.removeEventListener('click',this.clickFn)
    this.field.removeEvents()
    this.check.removeEvents()

  }
  create(el){
    this.DOM.el.querySelector('.tit4').innerHTML = el.dataset.title
    this.DOM.el.querySelector('.field_npt').dataset.list = el.dataset.list
    this.DOM.el.classList.add('modal-act')
  }
}
