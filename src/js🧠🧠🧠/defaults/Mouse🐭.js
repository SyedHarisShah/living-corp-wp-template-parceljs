'use strict';

import {gsap,Power2} from 'gsap'
import { lerp } from '../basic/math.js'

export default class {
  constructor(main){
    this.main = main

    this.position = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }
    this.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    }

    this.follows = []

    this.create()
    this.initEvents()
    
  }
  create () {
    
    this.element = document.createElement('div')
    this.element.className = 'mouse'

    document.body.appendChild(this.element)
    let reg = document.createElement('div')
    reg.className = 'mouse_reg mouse_hand'
    reg.innerHTML = this.main.icons.mreg
    this.element.appendChild(reg)


    let hov = document.createElement('div')
    hov.className = 'mouse_hov mouse_hand'
    hov.innerHTML = this.main.icons.mhover
    this.element.appendChild(hov)


    let drag = document.createElement('div')
    drag.className = 'mouse_drag mouse_hand'
    drag.innerHTML = this.main.icons.mdrag
    this.element.appendChild(drag)


    let dragin = document.createElement('div')
    dragin.className = 'mouse_dragin mouse_hand'
    dragin.innerHTML = this.main.icons.mdragin
    this.element.appendChild(dragin)


    this.ball = document.createElement('div')
    this.ball.className = 'mouse_ball'
    this.ball.innerHTML = '<span class="scrolldown">scroll<br>down</span><span class="read">read</span><span class="listen">Listen</span><span class="exp">Explore</span><span class="watch">Watch</span>'
    this.element.appendChild(this.ball)

    this.followbox = document.createElement('div')
    this.followbox.className = 'followbox'

    document.querySelector('#content').appendChild(this.followbox)
    this.followbox = document.querySelector('.followbox')
  }
  update () {
    let targetX = this.position.x
    let targetY = this.position.y
    this.current.x = lerp(this.current.x, targetX, .9)
    this.current.y = lerp(this.current.y, targetY, .9)
    gsap.set(this.element,  {
      x:this.current.x,
      y:this.current.y
    })

    if (this.follows.length != 0) {
      for(let ob of this.follows){
        if(ob.active==1){
        

          const x = targetX
          const y = targetY
          ob.current.x = lerp(ob.current.x, x, .03)
          ob.current.y = lerp(ob.current.y, y, .03)
          gsap.set(ob.follow,{left:ob.current.x+'px',top:ob.current.y+'px'})
        }
      }
    }
    
  }
  
  
  

  createFollow(pos,dad,follow,el,type){
    const dadpos = dad.getBoundingClientRect()
    // //  console.log(dadpos)
    // const x = this.current.x-dadpos.x
    // const y = this.current.y-dadpos.y

    const x = dadpos.x
   const y = dadpos.y

    // const x = this.current.x
    // const y =  this.current.y

    let followOb = {
      pos:pos,
      dad:dad,
      dadpos:{x:dadpos.x,y:dadpos.y},
      current:{x:this.current.x,y:this.current.y},
      follow:follow,
      active:1
    }
    this.follows.push(followOb)
    follow.appendChild(el)
    gsap.set(follow,{left:this.current.x+'px',top:this.current.y+'px'})
    // //  console.log(follow)
    document.querySelector('.followbox').appendChild(follow)
    gsap.to(follow,{'clip-path':'ellipse(35% 55% at 50% 50%)',rotate:-45+'deg',delay:.3,duration:.45})
    gsap.to(follow.querySelector('img'),{rotate:45+'deg',delay:.3,duration:.45})
    
    // let mask = document.createElement('div')
    // mask.className = 'follow_mask'
    // mask.appendChild(el)
    // follow.appendChild(mask)
    // setTimeout(()=>{
    //   follow.classList.add('unmask')
    //   if(type=='video'){
    //     el.play()
    //   }

    // },16)
  }
  escapeOps(){
      for(let deleteel of document.querySelectorAll('.followmouse')){
        
        
        gsap.to(deleteel,{
          'clip-path':'ellipse(0% 0% at 50% 50%)',duration:.3,
          onComplete:()=>{
            deleteel.remove()

          }
        })
      }
  }
  initEvents() {
    window.addEventListener('mousedown',()=>{
      document.documentElement.classList.add('mouse-down')
    })
    window.addEventListener('mouseup',()=>{
      document.documentElement.classList.remove('mouse-down')
    })


 

    this.mouseHoverIn = () =>{
      document.documentElement.classList.add("mouse-hover")
    }

    this.mouseHoverOut = () =>{
      document.documentElement.classList.remove("mouse-hover")
      
    }



   
    this.mouseReadIn = () =>{
      document.documentElement.classList.add("mouse-read")
      document.documentElement.classList.add("mouse-ball")
    }

    this.mouseReadOut = () =>{
      document.documentElement.classList.remove("mouse-read")
      document.documentElement.classList.remove("mouse-ball")
      
    }

    this.mouseWatchIn = () =>{
      document.documentElement.classList.add("mouse-watch")
      document.documentElement.classList.add("mouse-ball")
    }

    this.mouseWatchOut = () =>{
      document.documentElement.classList.remove("mouse-watch")
      document.documentElement.classList.remove("mouse-ball")
      
    }


    this.mouseListenIn = () =>{
      document.documentElement.classList.add("mouse-listen")
      document.documentElement.classList.add("mouse-ball")
    }

    this.mouseListenOut = () =>{
      document.documentElement.classList.remove("mouse-listen")
      document.documentElement.classList.remove("mouse-ball")
      
    }

    this.mouseExpIn = () =>{
      document.documentElement.classList.add("mouse-exp")
      document.documentElement.classList.add("mouse-ball")
    }

    this.mouseExpOut = () =>{
      document.documentElement.classList.remove("mouse-exp")
      document.documentElement.classList.remove("mouse-ball")
      
    }


    this.mouseScrollIn = () =>{
      document.documentElement.classList.add("mouse-scroll")
      document.documentElement.classList.add("mouse-ball")
    }

    this.mouseScrollOut = () =>{
      document.documentElement.classList.remove("mouse-scroll")
      document.documentElement.classList.remove("mouse-ball")
      
    }


    this.mouseDragIn = () =>{
      document.documentElement.classList.add("mouse-drag")
    }

    this.mouseDragOut = () =>{
      document.documentElement.classList.remove("mouse-drag")
      
    }


    this.mouseFollowIn = async (el) =>{
      document.documentElement.classList.add('mouse-hide')
      // this.escapeOps()
      let follow = document.createElement('div')
      follow.className = 'followmouse'
      const pos = this.follows.length
      el.dataset.posho=pos
      const src = el.dataset.image
      const img = new Image()
      img.src = src
      this.createFollow(pos,el,follow,img,'image')
       
      
    }
  
    this.mouseFollowOut = async (el) =>{
      // //  console.log('followout')
      document.documentElement.classList.remove('mouse-hide')
      if(!el.dataset.posho){
    
      }
      else{
        this.follows[el.dataset.posho].active=0
        let deleteel = this.follows[el.dataset.posho].follow
        el.dataset.posho=''
        gsap.to(deleteel,{
          'clip-path':'ellipse(0% 0% at 50% 50%)',duration:.3,
          onComplete:()=>{
            deleteel.remove()

          }
        })
        
      }
    }


  }
  clear(){

    document.documentElement.classList.remove("mouse-scroll")
    document.documentElement.classList.remove("mouse-listen")
    document.documentElement.classList.remove("mouse-watch")
    document.documentElement.classList.remove("mouse-hover")
    document.documentElement.classList.remove('mouse-down')
    document.documentElement.classList.remove('mouse-hide')
    document.documentElement.classList.remove("mouse-read")
    document.documentElement.classList.remove("mouse-ball")
    document.documentElement.classList.remove("mouse-drag")
    document.documentElement.classList.remove("mouse-exp")
  }
  async reset(){
    this.clear()
    await this.escapeOps()

    
    this.mouseRead = document.querySelectorAll('.mouseRead')
    if(this.mouseRead){
      for(let el of this.mouseRead ){
        if(!el.classList.contains('evt')){
          el.addEventListener('mouseenter',()=>this.mouseReadIn(el))

          el.addEventListener('mouseleave',()=>this.mouseReadOut(el))
          if(el.classList.contains('perma')){
            el.classList.add('evt')
          }
        }
      }
    }


    this.mouseWatch = document.querySelectorAll('.mouseWatch')
    if(this.mouseWatch){
      for(let el of this.mouseWatch ){
        if(!el.classList.contains('evt')){
          el.addEventListener('mouseenter',()=>this.mouseWatchIn(el))

          el.addEventListener('mouseleave',()=>this.mouseWatchOut(el))
          if(el.classList.contains('perma')){
            el.classList.add('evt')
          }
        }
      }
    }

    this.mouseExp = document.querySelectorAll('.mouseExp')
    if(this.mouseExp){
      for(let el of this.mouseExp ){
        if(!el.classList.contains('evt')){
          el.addEventListener('mouseenter',()=>this.mouseExpIn(el))

          el.addEventListener('mouseleave',()=>this.mouseExpOut(el))
          if(el.classList.contains('perma')){
            el.classList.add('evt')
          }
        }
      }
    }

    if(document.querySelectorAll('.mouseFollow')){
      this.mouseFollow = document.querySelectorAll('.mouseFollow')
      this.promises = []
      for(let el of this.mouseFollow ){
        if(!el.classList.contains('evt')){
            el.addEventListener('mouseenter',()=>this.mouseFollowIn(el))

            el.addEventListener('mouseleave',()=>this.mouseFollowOut(el))
            el.classList.add('evt')
          
            this.promises.push(new Promise((resolve, reject) => {
              const img = new Image()

              img.onload = ()=>resolve(el.dataset.image)
              img.onerror = ()=>reject(path)
              // //  console.log(img)
          }))
        }
      }
    }
    this.mouseListen = document.querySelectorAll('.mouseListen')
    if(this.mouseListen){
      for(let el of this.mouseListen ){
        if(!el.classList.contains('evt')){
          el.addEventListener('mouseenter',()=>this.mouseListenIn(el))

          el.addEventListener('mouseleave',()=>this.mouseListenOut(el))
          el.classList.add('evt')
        }
      }
    }

    this.mouseScroll = document.querySelectorAll('.mouseScroll')
    if(this.mouseScroll){
      for(let el of this.mouseScroll ){
        if(!el.classList.contains('evt')){
          el.addEventListener('mouseenter',()=>this.mouseScrollIn(el))

          el.addEventListener('mouseleave',()=>this.mouseScrollOut(el))
          el.classList.add('evt')
        }
      }
    }

    this.mouseDrag = document.querySelectorAll('.mouseDrag')
    if(this.mouseDrag){
      for(let el of this.mouseDrag ){
        if(!el.classList.contains('evt')){
          el.addEventListener('mouseenter',()=>this.mouseDragIn(el))

          el.addEventListener('mouseleave',()=>this.mouseDragOut(el))
          el.classList.add('evt')
        }
      }
    }

    this.mouseHover = document.querySelectorAll('.mouseHover')
    if(this.mouseHover){
      for(let el of this.mouseHover ){
        if(!el.classList.contains('evt')){
          el.addEventListener('mouseenter',()=>this.mouseHoverIn(el))

          el.addEventListener('mouseleave',()=>this.mouseHoverOut(el))
          el.classList.add('evt')
        }
      }
    }

  }   
}
