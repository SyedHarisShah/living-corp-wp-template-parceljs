'use strict';

export default class {
  constructor(el){
    this.DOM = {
      el: el,
      npt: el.querySelector("select")
    };
    this.initEvents()
  }
  initEvents() {
      this.check = () =>{
          if(this.DOM.npt.value!=''){
            this.DOM.el.classList.remove('err')

          }
          else{
              this.DOM.el.classList.add('err')
          }
      }

      this.changeFn = () =>{
        if(this.DOM.npt.value!=''){
          this.DOM.el.classList.remove('err')

        }
        
      }

      this.DOM.npt.addEventListener('change',this.changeFn)
  }
  removeEvents(){
    this.DOM.npt.removeEventListener('change',this.changeFn)

  }

}