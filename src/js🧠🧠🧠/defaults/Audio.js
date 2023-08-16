'use strict';
function format(s) {
  var m = Math.floor(s / 60);
  m = (m >= 10) ? m : "0" + m;
  s = Math.floor(s % 60);
  s = (s >= 10) ? s : "0" + s;
  return m + ":" + s;
}
export default class {
  constructor(el){
    this.DOM = {
      el: el,
      media:el.querySelector('audio'),
      start:el.querySelector('.player_time_start'),
      end:el.querySelector('.player_time_end'),
      ball:el.querySelector('.playerball'),
      bar:el.querySelector('.player_time_bar'),
      btn:el.querySelector('.btnplayer'),
      rew:el.querySelector('.btn10left'),
      forw:el.querySelector('.btn10right'),
      rest:el.querySelector('.btnrestart'),
      volume:el.querySelector('.player_volume'),
      volbar:el.querySelector('.player_volume_bar'),
      volicon:el.querySelector('.player_volume_icon'),
      volres:el.querySelector('.player_volume_bar .volumepos'),
      volball:el.querySelector('.player_volume_bar .volumeball')
    };
    this.initEvents()
  }
  initEvents() {
    this.progressHandler = (event) => {
      var proportion = Math.round( event.target.currentTime * 100  )
      this.DOM.ball.style.left = (proportion / event.target.duration)+'%'
      this.DOM.start.innerHTML =  format(event.target.currentTime)
    }


    this.DOM.media.addEventListener('timeupdate',this.progressHandler)
    
    this.clickBar =(ev)=>{
      this.DOM.media.currentTime = (this.DOM.media.duration * ev.offsetX / ev.target.clientWidth)
  
    }

    this.DOM.bar.addEventListener('click', (ev) => this.clickBar(ev))
  
    this.pauseFn = () => {
      if(this.DOM.btn.classList.contains('playing')){
        this.DOM.btn.classList.remove('playing')
        this.DOM.media.pause()
      }
      else{
        this.DOM.btn.classList.add('playing')
        this.DOM.media.play()
      }
    }


    this.DOM.btn.addEventListener('click', this.pauseFn)

    this.rew = () =>{
      this.DOM.media.currentTime = this.DOM.media.currentTime -10
    }

    this.DOM.rew.addEventListener('click', this.rew)

    this.forw = () =>{
      this.DOM.media.currentTime = this.DOM.media.currentTime +10
    }

    this.DOM.forw.addEventListener('click', this.forw)

    this.rest = () =>{
      this.DOM.media.currentTime = 0
    }

    this.DOM.rest.addEventListener('click', this.rest)

    this.volume = () =>{
      if(this.DOM.volume.classList.contains('showVol')){
        this.DOM.volume.classList.remove('showVol')
      }
      else{
        this.DOM.volume.classList.add('showVol')
        
      }
    }
    if(document.documentElement.classList.contains('touch')){
      this.DOM.volume.addEventListener('click', this.volume)

    }
    else{
      this.DOM.volume.addEventListener('mouseenter', this.volume)
      this.DOM.volume.addEventListener('mouseleave', this.volume)

    }


    this.clickvolBar =(ev)=>{
      this.DOM.media.volume = 1-(ev.offsetY / ev.target.clientHeight)
      this.DOM.volres.style.height = (1-(ev.offsetY / ev.target.clientHeight))*100+'%'
      this.DOM.volball.style.top = ((ev.offsetY / ev.target.clientHeight))*100+'%'
      this.DOM.volicon.style.opacity = 1-(((ev.offsetY / ev.target.clientHeight))+.1)
      console.log(ev.offsetY / ev.target.clientHeight)
    }

    this.isactive = 0
    this.activVol = (ev) =>{
      this.isactive = 1 
    }
    this.deactivVol = (ev) =>{
      this.isactive = 0
    }

    this.clickmoveBar =(ev)=>{
      if(this.isactive == 0){
        return false
      }
      let tot = Math.max(0,(Math.min((ev.offsetY / ev.target.clientHeight),1)))
      // console.log(tot)
      this.DOM.media.volume = 1-tot
      this.DOM.volres.style.height = (1-tot)*100+'%'
      this.DOM.volball.style.top = ((ev.offsetY / ev.target.clientHeight))*100+'%'
      console.log(1-(Math.min(tot,.7)))
      this.DOM.volicon.style.opacity = 1-(Math.min(tot,.7))
      // console.log(ev.offsetY / ev.target.clientHeight)
      // console.log(1-(ev.offsetY / ev.target.clientHeight))
    }


    if(document.documentElement.classList.contains('touch')){
      this.DOM.volbar.addEventListener('click', (ev) => this.clickvolBar(ev))
    }
    else{
      this.DOM.volbar.addEventListener('mousedown', (ev) => this.activVol(ev))
      this.DOM.volbar.addEventListener('mousemove', (ev) => this.clickmoveBar(ev))
      window.addEventListener('mouseup', (ev) => this.deactivVol(ev))

    }
  }
  async reset(el){
    this.DOM.media.setAttribute('src',el.dataset.player)
    this.DOM.el.querySelector('img').setAttribute('src',el.dataset.image)
    this.DOM.el.querySelector('.tit4').innerHTML = el.dataset.title
    this.DOM.el.querySelector('.titleparent').innerHTML = el.dataset.subtitle
    await this.DOM.media.play()
    this.DOM.el.classList.add('load')
    this.DOM.start.innerHTML = '00:00'
    this.DOM.end.innerHTML = format(this.DOM.media.duration)
    this.DOM.btn.classList.add('playing')
    document.documentElement.classList.add('audio-playing')
  }
}