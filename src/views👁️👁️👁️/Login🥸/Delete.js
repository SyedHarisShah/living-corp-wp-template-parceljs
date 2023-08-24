'use strict';

import Field from './Field.js'
import EventEmitter from 'events'
import AutoBind from 'auto-bind'
import { getLoadingWheel } from './LinkedinLogin/Dialog.js';


export default class extends EventEmitter {
  constructor(el,main){
    super()
    AutoBind(this)

    this.DOM = {
      el: el,
    }

    // //  console.log(this.DOM.el)
    this.main = main
    this.delConfModal =  document.querySelector(".delAcctModal")
    this.pass =  new Field(this.delConfModal.querySelector('.pass_conf').parentNode)
    this.delBtn =  this.DOM.el.querySelector(".btnDelete")
    this.delConfBtn =  this.delConfModal.querySelector(".btnDeleteConf")
    this.delModalBg =  this.delConfModal.querySelector(".delAcctModal__bg")
    this.delModalMessage =  this.delConfModal.querySelector(".delAcctModal__message")
    this.DOM.errors = document.body.querySelectorAll('.usercontrols_errors .error')
    this.initEvents()
  }
  
  initEvents() {
    this.deleteFn = () =>{
      //show modal and then delete
      this.showModal();
    }
    
    this.delBtn.addEventListener('click',this.deleteFn)
    this.delConfBtn.addEventListener('click',this.delete)
    this.delModalBg.addEventListener('click', () => this.showModal(false))
  }

  async delete(){
    this.pass.check()
      
    if(this.delConfModal.querySelector('.err')){
      return;
    }

    //loading wheel
    const delConfText = this.delConfBtn.querySelector(".btn_t");
    delConfText.innerHTML = getLoadingWheel();

    // //  console.log(this.main.acf.base)
    // //  console.log(this.main.user.nonce)
    let formdata = new FormData()
    formdata.set('userid',this.main.user.user.ID)
    formdata.set('pass',encodeURIComponent(this.pass.DOM.npt.value))

    //delete account
    const response = await fetch(this.main.acf.base+'/wp-json/csskiller/v1/delete-account/',{
      method: 'post',
      body: formdata,
      'Content-Type': 'application/json',
      'X-WP-Nonce': this.main.user.nonce
    })
    const success = await response.json();

    delConfText.innerHTML = "CONFIRM AND DELETE";

    if(success){
      this.showMessage("Account deleted successfully");
      this.showModal(false);
      this.emit('resetuser')
    }
    else{
      this.showMessage("Incorrect password");
    }
  }

  async showModal(show = true){
    const modal = this.delConfModal;
    const delModalBg = this.delModalBg;
    const delModalBody = this.delConfModal.querySelector(".delAcctModal__body");

    if(show){
      modal.style.display = "unset";
      setTimeout(() => delModalBg.style.opacity = 1.0, 50);
      setTimeout(() => delModalBody.style.opacity = 1.0, 50);
    }
    else{
      delModalBg.style.opacity = 0;
      delModalBody.style.opacity = 0;
      setTimeout(() => modal.style.display = "none", 350);
    }
  }

  showMessage(message){
    const delModalMessage = this.delModalMessage;

    if(message){
      delModalMessage.innerHTML = message;

      delModalMessage.style.maxHeight = "100%";
      delModalMessage.style.padding = "1rem";
      setTimeout(this.showMessage, 3300);
    }
    else{
      delModalMessage.style.maxHeight = 0;
      delModalMessage.style.padding = 0;
    }
  }

  removeEvents() {
     
  }
}
