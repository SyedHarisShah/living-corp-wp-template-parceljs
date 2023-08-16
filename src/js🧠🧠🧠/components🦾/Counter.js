
import Component from '/src/js🧠🧠🧠/defaults/Component'

import {gsap,Power3} from 'gsap'
import { parse } from 'eta'


export default class extends Component {
  constructor (element,isDelay = false,plusDelay = 0) {
    super({
    })

    this.el = element
    if(isActive==false){

    }
    else{

    }
    this.active = 0
    this.isFroms = 0
    this.isDelay = isDelay
    this.delay = plusDelay
    this.create()
    
    this.initEvents()
  }

  async create () {
      let msg = this.el.querySelector('.nums_main').textContent
      this.el.querySelector('.nums_main').innerHTML = ''
      msg = msg.split('')
      if(this.el.dataset.from){
        this.isFroms = 1
        this.froms =  this.el.dataset.from.split('')
        this.to =  msg
        // console.log(this.froms)
        // console.log(this.to)
      }
      else{

      }
      
      // el.querySelector('.nums_main').innerHTML = '<div class="nums_main_el">' + msg.join('</div><div class="nums_main">') + '</div>'
      
      if(this.isFroms==1){
        for(let [index,s] of this.to.entries() ){
          let nu = parseInt(s)
          if(nu< parseInt(this.froms[index])){
            nu = this.froms[index]
          }
          let str = '<div class="nums_main_el">'
          for(let i=0;i<=nu;i++ ){
            if(i==nu){
              str+='<span>'+i+'</span>'
  
            }
            else{
              str+='<span>'+i+'</span>'
  
            }
  
          }
          this.el.querySelector('.nums_main').innerHTML+=str+'</div>'
          
        
        }
        let vfrom = 0
        for(let [index,s] of this.el.querySelectorAll('.nums_main_el').entries()){

          if(parseInt(this.froms[index]) == parseInt(this.to[index])){
            vfrom = -100*this.froms[index]
          }
          else if(parseInt(this.froms[index]) > parseInt(this.to[index])){
            vfrom = parseInt(this.to[index]) - parseInt(this.froms[index])
            
            vfrom = parseInt(this.froms[index]) * -100
          }
          else{
            vfrom = parseInt(this.froms[index]) - parseInt(this.to[index])
            vfrom = parseInt(this.froms[index])*-100
            console.log(vfrom)
          }
          // console.log(parseInt(this.froms[index]))
          // console.log(parseInt(this.to[index]))
          // console.log(vfrom*100)
          gsap.set(s,{yPercent:vfrom})
        
        }
      }
      else{
        this.el.querySelector('.nums_main').innerHTML=''
        for(let s of msg ){
          let nu = parseInt(s)
          let str = '<div class="nums_main_el">'
          for(let i=0;i<=nu;i++ ){
            if(i==nu){
              str+='<span>'+i+'</span>'
  
            }
            else{
              str+='<span>'+i+'</span>'
  
            }
  
          }
          this.el.querySelector('.nums_main').innerHTML+=str+'</div>'
          
        
        }
        for(let s of this.el.querySelectorAll('.nums_main_el')){
        
          gsap.set(s,{yPercent:100,y:0})
        
        }
      }
        
  }
  startFroms(){
    let ran = 0
    let total = 0
    for(let [index,s] of this.el.querySelectorAll('.nums_main_el').entries()){
      
      total = parseInt(this.to[index])
      // console.log(total)
      gsap.to(s,{yPercent:-100*(total),duration:.6+(total*.12),delay:this.delay,ease:Power3.easeInOut})
      
    }
    setTimeout(()=>{
      this.el.classList.add('nums-end')
    },800)
  }
  startNormal(){
    let ran = 0
    let total = 0
    for(let [index,s] of this.el.querySelectorAll('.nums_main_el').entries()){
      total = s.querySelectorAll('span').length
      gsap.to(s,{yPercent:-100*(total-1),duration:.6+(total*.08),delay:this.delay,ease:Power3.easeInOut})
      
    }
    setTimeout(()=>{
      this.el.classList.add('nums-end')
    },800)
  }
  start(){
    if(this.isFroms==1){

      this.startFroms()
    }
    else{
      this.startNormal()
    }
    
  }
  stop(){
    
    if(this.isFroms==1){
      for(let [index,s] of this.el.querySelectorAll('.nums_main_el').entries()){

        if(parseInt(this.froms[index]) == parseInt(this.to[index])){
          vfrom = -100*this.froms[index]
        }
        else if(parseInt(this.froms[index]) > parseInt(this.to[index])){
          vfrom = parseInt(this.to[index]) - parseInt(this.froms[index])
          vfrom = parseInt(this.froms[index]) * -100
          console.log(vfrom)
        }
        else{
          vfrom = parseInt(this.froms[index]) - parseInt(this.to[index])
          vfrom = vfrom * 100
        }
        // console.log(parseInt(this.froms[index]))
        // console.log(parseInt(this.to[index]))
        // console.log(vfrom*100)
        gsap.set(s,{yPercent:vfrom,y:0})
      
      }
    }
    else{
      for(let s of this.el.querySelectorAll('.nums_main_el')){
        
        gsap.to(s,{yPercent:100,duration:.45})
        console.log(s)
      
      }
    }
  }
  

  
  initEvents(){
  
  }
}
