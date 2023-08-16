'use strict';
//https://codepen.io/mmhuntsberry/pen/QowZwR
export default class {
  constructor(el){
    this.DOM = {
      el: el,
      npt:el.querySelector('input'),
      drag:el.querySelector('.file_dropzone')
    }
    this.fd = new FormData()
    this.initEvents()
  }
  initEvents() {
    this.change = (e) =>{
      console.log(this.DOM.npt.value)
      let reader = new FileReader()
      reader.readAsText(e.target.files[0])
      console.log(e.target.files)
      console.log(reader)
      this.DOM.el.querySelector('.tit3').innerHTML = e.target.files[0].name
      
      // this.DOM.el.querySelector('.tit3').innerHTML = readerev.target.fileName
      this.file = e.target.files[0]
      this.DOM.el.classList.remove('err')
      this.DOM.el.classList.add('suc')
    }

    this.dragOver = (e) =>{
      e.preventDefault()
    }

    this.click = (e) =>{
      this.DOM.npt.click()
    }
    this.drop = (e) =>{
      e.preventDefault()
      // const validatedFiles = this.fileValidation(unvalidatedFiles)
      // this.createFileDOMNode(validatedFiles)
      // this.fd.set('file', e.dataTransfer.files[0], e.dataTransfer.files[0].name)
      console.log(e.dataTransfer.files[0].path)
      console.log(this.fd)
      console.log(e.dataTransfer.files)
      let reader = new FileReader()
      // reader.readAsDataURL(e.dataTransfer.files[0])
      reader.readAsText(e.dataTransfer.files[0])
      console.log(reader)
      
      this.DOM.el.querySelector('.tit3').innerHTML = e.dataTransfer.files[0].name
      this.file = e.dataTransfer.files[0]
      this.DOM.el.classList.remove('err')
      this.DOM.el.classList.add('suc')
    }

    

    
    

    this.fileValidation = (files) => {
      const validatedFileArray = []
      const supportedExts = ['pdf']
      files.forEach(file => {
        const ext = this.getFileExtension(file)
        if (supportedExts.indexOf(ext) === -1) {
        } else {
          validatedFileArray.push(file)
        }
      })
      return validatedFileArray
    }
    
    this.getFileExtension = (file)=> {
      return file.name.split('.').pop();
    }
    this.check = () =>{
      console.log(this.file)
      if(this.file){
        this.DOM.el.classList.remove('err')
      }
      else{
        this.DOM.el.classList.add('err')

      }
    }
    this.DOM.npt.addEventListener('change',(e)=>this.change(e))
    this.DOM.drag.addEventListener('dragover',(e)=>this.dragOver(e))
    this.DOM.drag.addEventListener('drop',(e)=>this.drop(e))
    this.DOM.drag.addEventListener('click',(e)=>this.click(e))

  }
  

  removeEvents() {
  }
}
