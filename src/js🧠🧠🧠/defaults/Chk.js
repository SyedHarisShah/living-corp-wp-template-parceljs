'use strict';

export default class {
  constructor(el){
    this.DOM = {
      el: el,
      npt: el.querySelector("input")
    };
    this.initEvents()
  }
  initEvents() {
      this.check = () =>{
          if(this.DOM.npt.checked){
            this.DOM.el.classList.remove('err')

          }
          else{
              this.DOM.el.classList.add('err')
          }
      }
      this.DOM.npt.addEventListener('change',this.check)
  }
  removeEvents(){
    this.DOM.npt.removeEventListener('change',this.check)

  }

}