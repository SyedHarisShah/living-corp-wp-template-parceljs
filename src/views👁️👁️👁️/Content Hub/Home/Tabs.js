'use strict';

import EventEmitter from 'events'
import AutoBind from 'auto-bind'

export default class extends EventEmitter {
  constructor(el){
    super()
    AutoBind(this)

    this.DOM = {
      el: el,
      btns:el.querySelectorAll('.tabClick'),
      selectors:el.querySelectorAll('.m-tabposts_hold'),
      clickshold:el.querySelector('.m-tabposts_selector_blocks'),
      clicks:el.querySelectorAll('.blockClick')
    }
    
    this.pos = 0

    this.initEvents()
  }
  async select(num,el){
    if(num==1 || num==2){
      this.DOM.clickshold?.classList.add('hid')
    }
    else{
      this.DOM.clickshold?.classList.remove('hid')

    }
    // //  console.log(num)
    this.DOM.btns[this.pos]?.classList.remove('act')
    this.DOM.btns[num]?.classList.add('act')
    this.DOM.selectors[this.pos]?.classList.add('load')
    await this.timeout(600)
    this.DOM.selectors[this.pos]?.classList.remove('act')
    this.pos = num
    this.DOM.selectors[this.pos]?.classList.add('act')
    await this.timeout(12)
    this.DOM.selectors[this.pos]?.classList.remove('load')

    this.emit('resize')

  }
  timeout(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  async blockClicks(el){
    for(let b of this.DOM.clicks){
      b?.classList.remove('act')
    }
    el?.classList.add('act')

    this.DOM.selectors[this.pos]?.classList.add('load')
    await this.timeout(600)
    const type = el.dataset.type
    if(type=='block'){
      this.DOM.selectors[this.pos]?.classList.add('blocks')
    }
    else{
      this.DOM.selectors[this.pos]?.classList.remove('blocks')

    }
    this.DOM.selectors[this.pos]?.classList.remove('load')
    this.emit('resize')
  }
  initEvents() {
    for(let [i,el] of this.DOM.clicks.entries()){
      el.addEventListener('click',()=>this.blockClicks(el))
    }


    for(let [i,el] of this.DOM.btns.entries()){
      el.addEventListener('click',()=>this.select(i,el))
    }
    
    // this.register()
    
  }
  removeEvents() {
     
  }
}
