'use strict';

export default class {
  constructor(el){
    this.DOM = {
      el: el,
    }
    this.DOM.npt =  this.DOM.el.querySelector(".field_npt")
    this.DOM.btn =  this.DOM.el.querySelector(".field_button")
    this.initEvents()
  }
  initEvents() {
    this.checkField = ()=>{
        if(this.DOM.npt.value==''){
          this.DOM.el.classList.add("fill")
        }
        else{
          this.DOM.el.classList.add("fill")
        }
    }
    
    this.focusFn = ()=>{
        this.DOM.el.classList.remove("err")
        this.DOM.el.classList.add("foc")
    }
    this.focusoutFn = ()=>{
        this.DOM.el.classList.remove("foc")
        this.DOM.el.classList.remove("err")
        
    }
    
    this.DOM.npt.addEventListener("input", ()=>this.checkField())
    this.DOM.npt.addEventListener("focusin", this.focusFn)
    this.DOM.npt.addEventListener("focusout", ()=>this.focusoutFn())
  }
  check(){
    if ("" == this.DOM.npt.value)
        return void this.DOM.el.classList.add("err")
    this.DOM.el.classList.remove("err")
    this.DOM.el.classList.contains("field-email") ? null == this.DOM.npt.value.match(/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i) ? this.DOM.el.classList.add("err") : this.DOM.el.classList.remove("err") : this.DOM.el.classList.contains("field-number") && (isNaN(this.DOM.npt.value) ? this.DOM.el.classList.add("err") : this.DOM.el.classList.remove("err"))
      
  }
  clear(){
      this.DOM.el.classList.remove("foc")
      this.DOM.el.classList.remove("fill")
      this.DOM.el.classList.remove("err")
      this.DOM.npt.value=''
  }
  removeEvents() {
      this.DOM.npt.removeEventListener("input", ()=>this.checkField())
      this.DOM.npt.removeEventListener("focusin", this.focusFn)
      this.DOM.npt.removeEventListener("focusout", ()=>this.focusoutFn())
  }
}
