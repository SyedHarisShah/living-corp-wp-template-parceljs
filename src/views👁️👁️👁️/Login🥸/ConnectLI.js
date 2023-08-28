'use strict';

import EventEmitter from 'events'
import Field from './Field.js'
import AutoBind from 'auto-bind'
import { linkedInConnect, linkedInDisconnect } from './LinkedinLogin/LinkedinLogin.js';

export default class extends EventEmitter {
  constructor(el,main){
    super()
    AutoBind(this)

    this.DOM = {
      el: el,
    }

    // //  console.log(this.DOM.el)
    this.main = main
    this.btn =  this.DOM.el.querySelector(".btnLIConnect")
    this.DOM.errors = document.body.querySelectorAll('.usercontrols_errors .error')
    this.disLIModal =  document.querySelector('.disLIModal')
    this.pass =  new Field(this.disLIModal.querySelector('.pass_conf').parentNode)

    if(this.main.user.linkedin_id){
      const btn_t = this.btn.querySelector(".btn_t");
      btn_t.innerHTML = btn_t.innerHTML.replace('CONNECT', 'DISCONNECT');
    }

    this.initEvents()
  }
  
  initEvents() {
    if(this.main.user.linkedin_id){
      this.btn?.addEventListener('click',this.disconnectLI)
    }
    else{
      this.btn?.addEventListener('click',this.connectLI)
    }
  }

  async connectLI(){
    await linkedInConnect(this.main.acf, this.main.user);

    const finishConnect = setInterval(() => {
      if(window.liConnected){
        window.liConnected = false;
        // //  console.log('linkedin connected')

        this.main.linkedin_id = window.liConnected;
        const btn_t = this.btn.querySelector(".btn_t");
        btn_t.innerHTML = btn_t.innerHTML.replace('CONNECT', 'DISCONNECT');

        // swap events
        this.btn?.removeEventListener('click',this.connectLI)
        this.btn?.addEventListener('click',this.disconnectLI)

        clearInterval(finishConnect)
      }
    })
  }

  async disconnectLI(){
    await linkedInDisconnect(this.main.acf, this.main.user, this.pass);

    const finishDisconnect = setInterval(() => {
      if(window.liDisconnected){
        window.liDisconnected = false;
        // //  console.log('linkedin disconnected')

        this.main.linkedin_id = '';
        const btn_t = this.btn.querySelector(".btn_t");
        btn_t.innerHTML = btn_t.innerHTML.replace('DISCONNECT', 'CONNECT');

        this.btn?.removeEventListener('click',this.disconnectLI);
        this.btn?.addEventListener('click',this.connectLI);
        clearInterval(finishDisconnect)
      }
    })
  }
  
  removeEvents() {
     
  }
}
