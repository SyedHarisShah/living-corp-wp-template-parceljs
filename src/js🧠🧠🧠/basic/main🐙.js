import AutoBind from 'auto-bind'
import NormalizeWheel from 'normalize-wheel'
import Loader from './Loader'
import {gsap,Power3} from 'gsap'
import CustomEase from 'gsap/CustomEase'
// import Scroll from './Scroll'
// import Canvas from '../defaults/Canvas'
import Mouse from '/src/js🧠🧠🧠/defaults/Mouse🐭.js'
import Nav from '/src/views👁️👁️👁️/Nav🌤️'
import Footer from '/src/views👁️👁️👁️/Footer🔥'
import Intro from '/src/js🧠🧠🧠/basic/intro.js'


import Home from '/src/views👁️👁️👁️/Home⚪'
import Podcast from '/src/views👁️👁️👁️/Podcast🔴'
import Learn from '/src/views👁️👁️👁️/Learn'
import Network from '/src/views👁️👁️👁️/Network🟡'
import Article from '/src/views👁️👁️👁️/Article🔵'
import Tag from '/src/views👁️👁️👁️/Tag'
import MediaPlayer from '/src/views👁️👁️👁️/MediaPlayer'
import SharedPlayer from '/src/views👁️👁️👁️/SharedPlayer'
import Job from '/src/views👁️👁️👁️/Job🟣'
import Jobs from '/src/views👁️👁️👁️/Job🟣🟣🟣'
import Apply from '/src/views👁️👁️👁️/Apply🟣'
import Show from '/src/views👁️👁️👁️/Show🟠'
import Contact from '/src/views👁️👁️👁️/Contact🟢'
import Archive from '/src/views👁️👁️👁️/Archive⚫'
import Simple from '/src/views👁️👁️👁️/Simple'
import Player from '/src/views👁️👁️👁️/Player⏯️'
import List from '/src/views👁️👁️👁️/List📝'
import Search from '/src/views👁️👁️👁️/Search🔍'
import Login from '/src/views👁️👁️👁️/Login🥸'
import error404 from '/src/views👁️👁️👁️/404'
import ContentHub from '/src/views👁️👁️👁️/Content Hub/Home'
import Actions from '/src/views👁️👁️👁️/Content Hub/Actions'
import CEOs from '/src/views👁️👁️👁️/Content Hub/CEOs'
import ceo_single from '/src/views👁️👁️👁️/Content Hub/CEO-Single'
import Media from '/src/views👁️👁️👁️/Content Hub/Media'
import Resources from '/src/views👁️👁️👁️/Content Hub/Resources'
import resource_single from '/src/views👁️👁️👁️/Content Hub/Resource-Single'
import Purpose from '/src/views👁️👁️👁️/Content Hub/Purpose'
import Latest from '/src/views👁️👁️👁️/Content Hub/Latest'



//🟠🔴🔵🟢🟣🟡⚪

class App {
  constructor (main) {
    AutoBind(this)
    this.content = document.querySelector('#content')
    // console.log('App: ', main);
    
    this.main = main
    this.main.colors = ['#DF80AC','#E5855E','#895434']
    this.isMobile = this.main.isTouch
    this.speed = 0
    // this.createCanvas()
    gsap.registerPlugin(CustomEase)
    // CustomEase.create("bounceTrans","M0,0 C0,0 0.112,0.043 0.168,0.17 0.242,0.34 0.282,0.484 0.282,0.818 0.284,0.926 0.29,1.022 0.394,1.022 0.47,1.022 0.498,0.974 0.546,0.974 0.599,0.974 0.622,0.999 0.68,1 0.728,1 0.771,1 0.8,1 0.853,0.999 1,1 1,1")
    CustomEase.create("bounceTrans","M0,0 C0,0 0.08,0.05 0.224,0.21 0.332,0.33 0.394,0.462 0.424,0.784 0.424,0.99 0.542,1.038 0.76,1.01 0.834,1 0.859,1 0.888,1 0.941,0.999 1,1 1,1")
    
    
    CustomEase.create("bounceNew", "M0,0 C0,0 0.102,0.164 0.13,0.64 0.142,0.845 0.138,1.042 0.232,1.042 0.322,1.042 0.354,0.99 0.46,0.99 0.558,0.99 0.613,1.004 0.676,1.004 0.733,1.004 0.832,1 0.893,0.999 0.935,0.998 1,1 1,1 ")
    this.createNav()
    this.url = window.location.pathname
    this.links = []
    

    this.createViews()
    this.createLoader()
    this.addEventListeners()


  }



  createViews(){
    // CREATE VIEWS
    this.pages = new Map()
    this.pages.set('home', new Home(this.main,this.footer.string))
    this.pages.set('simple', new Simple(this.main,this.footer.string))
    this.pages.set('article', new Article(this.main,this.footer.string))
    this.pages.set('podcast', new Podcast(this.main,this.footer.string))
    this.pages.set('learn', new Learn(this.main,this.footer.string))
    this.pages.set('network', new Network(this.main,this.footer.string))
    this.pages.set('job', new Job(this.main,this.footer.string))
    this.pages.set('jobs', new Jobs(this.main,this.footer.string))
    this.pages.set('apply', new Apply(this.main,this.footer.string))
    this.pages.set('contact', new Contact(this.main,this.footer.string))
    this.pages.set('show', new Show(this.main,this.footer.string))
    this.pages.set('archive', new Archive(this.main,this.footer.string))
    this.pages.set('list', new List(this.main,this.footer.string))
    this.pages.set('search', new Search(this.main,this.footer.string))
    this.pages.set('login', new Login(this.main,this.footer.string))
    this.pages.set('error404', new error404(this.main,this.footer.string))
    this.pages.set('tag', new Tag(this.main,this.footer.string))
    this.pages.set('player', new MediaPlayer(this.main,this.footer.string))
    this.pages.set('shared-player', new SharedPlayer(this.main,this.footer.string))
    this.pages.set('content-hub', new ContentHub(this.main,this.footer.string))
    this.pages.set('ch-actions', new Actions(this.main,this.footer.string))
    this.pages.set('ch-ceos', new CEOs(this.main,this.footer.string))
    this.pages.set('ch-media', new Media(this.main,this.footer.string))
    this.pages.set('ch-resources', new Resources(this.main,this.footer.string))
    this.pages.set('ch-purpose', new Purpose(this.main,this.footer.string))
    this.pages.set('ch-latest', new Latest(this.main,this.footer.string))
    this.pages.set('ch-ceos-single', new ceo_single(this.main,this.footer.string))
    this.pages.set('ch-resource-single', new resource_single(this.main,this.footer.string))

    // this.pages.set('home', new Home(this.main,this.footer.string))
    this.pages.get('login').on('reset',()=>{
      let url = window.location
      // //  console.log('letsmakethelog')
      // if(process.env.APP_ENV=='local'){
      //   url='http://localhost:1234/login.html'
      // }
      // this.onChange({
      //   url: url,
      //   id: '',
      //   link:null
        
      // })
      this.toUser()

    })
    this.pages.get('apply').on('toJob',(content)=>{
      
      // if(process.env.APP_ENV=='local'){
      //   content.url='http://localhost:1234/job.html'
      // }
      this.toJob({
        content:content
        
      })

    })
    this.pages.get('login').on('gotohome',()=>{
      let url = this.main.acf.home
      document.documentElement.classList.remove('is_shared')
      // if(process.env.APP_ENV=='local'){
      //   url='http://localhost:1234/index.html'
      // }
      this.onChange({
        url: url,
        id: '',
        link:null
        
      })

    })

    this.pages.get('job').on('toApply',(id)=>{
      this.toApply(id)
    })
    for(let pa of this.pages){
      pa[1].on('linkseventlisteners',()=>{
        this.addLinksEventsListeners()
      })
      pa[1].on('globalchange',()=>{
        this.main = this.page.main
       
        // //  console.log('reset global')
        // //  console.log(this.main)
      })
      pa[1].on('mousereset',()=>{
        if(this.mouse){
          this.mouse.reset()
        }
      })
    }
  }



  createLoader () {
    this.loader = new Loader()
    this.loader.on('complete', this.loaderReady)
    this.loaderReady()
  }


  async loaderReady () {
    this.template = this.content.dataset.template
    this.page = this.pages.get(this.template)
    await this.page.create(this.content,this.main)
    this.addLinksEventsListeners()
    
    if(this.introstate == true){
      this.update()
      if(this.mouse){
        this.mouse.reset()
      }
    }
    else{
      await this.nav.create()
      await this.page.show()
      this.update()
      if(this.mouse){
        this.mouse.reset()
      }
    }
    
    // this.onResize()


  }

  async makeStart(){
    await this.nav.create()
    await this.page.show()
    if(this.mouse){
      this.mouse.reset()
    }
  }

  createCanvas () {
    this.canvas = new Canvas({
      url: this.url
    })
  }


  async createNav () {
    
    this.nav = new Nav(this.main)
    this.footer = new Footer(this.main)
    this.player = new Player(this.main)
    this.intro  = new Intro(this.main)
    await this.nav.generate()
    await this.footer.create()

    this.introstate = await this.intro.init()
    if(!this.isMobile){
      this.mouse = new Mouse(this.main)
    }
    

    this.intro.on('closeintro',()=>{
      this.makeStart()

    })

    this.intro.on('tochange',()=>{
      let url = this.main.acf.login
      // if(process.env.APP_ENV=='local'){
      //   url='http://localhost:1234/login.html'
      // }
      this.onChange({
        url: url,
        id: '',
        link:null
        
      })

    })

    this.intro.on('linkseventlisteners',()=>{
      
      this.addLinksEventsListeners()
    })

    this.nav.on('search',()=>{
      let url = this.main.acf.search+'?search='+this.nav.field.DOM.npt.value
      this.nav.closeSearchFn()
      // if(process.env.APP_ENV=='local'){
      //   url='http://localhost:1234/search.html'
      // }
      this.onChange({
        url: url,
        id: '',
        link:null
        
      })
    })
  }

  update () {
    if (this.page) {
      this.page.update(this.speed)
    }
    if (this.mouse) {
      this.mouse.update()
    }
    // if (this.canvas) {
    //   this.canvas.update()
    // }
    if(this.speed >0.005 || this.speed < -0.005){
      document.documentElement.classList.add('is-scrolling')
      // this.speed=parseFloat(0.8*this.speed)
      this.speed = Math.round((0.9*this.speed) * 1000) / 1000
    }
    else{
      this.speed = 0
      document.documentElement.classList.remove('is-scrolling')
    }
    window.requestAnimationFrame(this.update)
  }

  /**
   * Page creations
   */
   timeout(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  async loadImage(img){
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      img.onerror = reject
      image.src = img.getAttribute('src')
    })
  }

  async toJob (content) {
    if (this.isLoading) return
    this.page.isVisible = false
    this.isLoading = true
    // //  console.log(content.content)
    document.body.style.pointerEvents = 'none'
    let mainold = document.querySelector('#content main')
    mainold.classList.add('old')
    mainold.style.zIndex= 1
    
    this.page.hide()
    this.newpage = this.pages.get('job')
    await this.newpage.create(content.content.content,this.main)

    await gsap.to('main.old',{opacity:0,duration:.6,ease:Power3.easeInOut})
    await this.newpage.show()
    if(this.isMobile){
      window.scrollY = 0
      document.body.scroll({
        top: 0, 
        left: 0, 
        behavior: 'instant'
      })
    }
    document.querySelector('#content').removeChild(document.querySelector('main.old'))
    

    if(this.mouse){
      this.mouse.reset()
    }
    this.addLinksEventsListeners()

    document.body.style.pointerEvents = ''

    this.isLoading = false


    this.page = this.newpage
  }


  async toApply (id) {
    if (this.isLoading) return
    this.page.isVisible = false
    this.isLoading = true
    document.body.style.pointerEvents = 'none'
    let mainold = document.querySelector('#content main')
    mainold.classList.add('old')
    mainold.style.zIndex= 1
    
    this.page.hide()
    this.newpage = this.pages.get('apply')
    await this.newpage.create(id,this.main)

    await gsap.to('main.old',{opacity:0,duration:.6,ease:Power3.easeInOut})
    await this.newpage.show()
    window.scrollY = 0
    if(this.isMobile){
      document.body.scroll({
        top: 0, 
        left: 0, 
        behavior: 'instant'
      })
    }
    document.querySelector('#content').removeChild(document.querySelector('main.old'))
    

    if(this.mouse){
      this.mouse.reset()
    }
    
    this.addLinksEventsListeners()

    document.body.style.pointerEvents = ''

    this.isLoading = false


    this.page = this.newpage
  }

  async toUser () {
    if (this.isLoading) return
    this.page.isVisible = false
    this.isLoading = true

    document.body.style.pointerEvents = 'none'
    let mainold = document.querySelector('#content main')
    mainold.classList.add('old')
    mainold.style.zIndex= 1
    
    this.page.hide()
    this.newpage = this.pages.get('login')
    await this.newpage.create('',this.main)

    await gsap.to('main.old',{opacity:0,duration:.6,ease:Power3.easeInOut})
    await this.newpage.show()
    document.querySelector('#content').removeChild(document.querySelector('main.old'))
    window.scrollY = 0
    if(this.isMobile){
      document.body.scroll({
        top: 0, 
        left: 0, 
        behavior: 'instant'
      })
    }

    if(this.mouse){
      this.mouse.reset()
    }
    this.addLinksEventsListeners()


    document.body.style.pointerEvents = ''

    this.isLoading = false


    this.page = this.newpage

  }

  async onChange ({ url = null, link = null, id = null, img = null }) {
    url = url.replace(window.location.origin, '')
    if (this.isLoading || this.url === url) return
    this.page.isVisible = false
    this.isLoading = true
    
    this.url = url

    // if (this.canvas) {
    //   this.canvas.onChange(this.url)
    // }
    if(this.mouse){
      this.mouse.clear()
    }
    if(this.nav.isOpen==1){
      this.nav.isOpen = 0
      this.nav.closeMenu()
      await this.timeout(600)
    }
    document.body.style.pointerEvents = 'none'
    let mainold = document.querySelector('#content main')
    mainold.classList.add('old')
    mainold.style.zIndex= 1
    
    const request = await window.fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })

    const response = await request.text()
    var push = true
    this.onRequest({
      push,
      response,
      url,
      id
    })
    this.page.hide()
    await this.newpage.create(this.content,this.main)
    // //  console.log(this.page.isVisible)
    // //  console.log(mainold)
    // gsap.to('main.old',{y:'-='+window.innerHeight*.8+'px',duration:.9,ease:Power3.easeInOut})
    gsap.to('main.old',{opacity:0,duration:1.2,ease:Power3.easeInOut})
    await this.newpage.show()
    if(this.isMobile){
      window.scrollY = 0
      document.body.scroll({
        top: 0, 
        left: 0, 
        behavior: 'instant'
      })
    }
    // //  console.log(mainold)
    if(this.mouse){
      this.mouse.reset()
    }
    // document.querySelector('main.old').remove()
    document.querySelector('#content').removeChild(document.querySelector('main.old'))

   
    this.addLinksEventsListeners()


    document.body.style.pointerEvents = ''

    this.isLoading = false


    this.page = this.newpage

  }
  async onRequest ({ push, response, url, id }) {
    const html = document.createElement('div')

    html.innerHTML = response

    this.content = html.querySelector('#content')

    document.title = html.querySelector('title').textContent

    if (push) {
      window.history.pushState({}, document.title, url)
    }
    this.template = this.content.dataset.template
    
    this.newpage = this.pages.get(this.template)
  }
  /**
   * Events.
   */

  onContextMenu (event) {
    event.preventDefault()
    event.stopPropagation()

    return false
  }

  onPopState () {
    // if we're in the player, use the popstate defined in the media player view
    if(window.history.state?.player_href && document.querySelector('.media-player')) return;

    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  onResize () {
    document.documentElement.style.setProperty("--app-height", window.innerHeight+"px")
    if (this.isMobile){
      if(document.documentElement.classList.contains('touch')){
        location.reload() 
      }
    }
    else{
      var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 || window.innerWidth < 1181;
      // //  console.log(isMobile)
      if(isMobile){
        location.reload()
        
      }
    }
    if (this.page) {
      this.page.onResize()
    }
    // if (this.canvas && this.canvas.onResize) {
    //   this.canvas.onResize()
    // }
  }

  onTouchDown (event) {
    event.stopPropagation()

    if (this.isMobile) return
    this.mouse.position.x = event.touches ? event.touches[0].clientX : event.clientX
    this.mouse.position.y = event.touches ? event.touches[0].clientY : event.clientY
    
    // if (event.target.tagName === 'A') return

    // this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX
    // this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event)
    }

  }

  onTouchMove (event) {
    event.stopPropagation()
    
    if (this.isMobile) return
    
    this.mouse.position.x = event.touches ? event.touches[0].clientX : event.clientX
    this.mouse.position.y = event.touches ? event.touches[0].clientY : event.clientY


    

    if (this.page && this.page.onTouchMove) {
      this.page.onTouchMove(event)
    }

  }

  onTouchUp (event) {
    event.stopPropagation()
    
    if (this.isMobile) return

    this.mouse.position.x = event.changedTouches ? event.changedTouches[0].clientX : event.clientX
    this.mouse.position.y = event.changedTouches ? event.changedTouches[0].clientY : event.clientY


    

    if (this.page && this.page.onTouchUp) {
      this.page.onTouchUp(event)
    }

  }

  onScroll (event) {
    // const {pageYOffset: e} = window;
    this.page && this.page.onScroll && this.page.onScroll(event.scrollY)

  }

  onWheel (event) {
    if (this.isMobile) return
    const normalized = NormalizeWheel(event)
    // const speed = normalized.pixelY
    this.speed += normalized.pixelY*.12
    if (this.page && this.page.onWheel) {
      this.page.onWheel()
    }
    if (this.canvas && this.canvas.onWheel) {
      this.canvas.onWheel()
    }
  }

  onInteract () {
    window.removeEventListener('mousemove', this.onInteract)
    window.removeEventListener('touchstart', this.onInteract)

    this.update()
  }

  /**
   * Listeners.
   */
   addEventListeners () {
    window.addEventListener('popstate', this.onPopState, { passive: true })
    // window.addEventListener('resize', this.onResize, { passive: true })
    this.res = ''
    window.onresize = ()=>{

      clearTimeout(this.res)
      this.res = setTimeout(this.onResize, 400)
    }

    if (this.isMobile){
      window.addEventListener('orientationchange', event => { 
        location.reload()
      })
    }


    window.addEventListener('mousedown', this.onTouchDown, { passive: true })
    window.addEventListener('mousemove', this.onTouchMove, { passive: true })
    window.addEventListener('mouseup', this.onTouchUp, { passive: true })

    window.addEventListener('touchstart', this.onTouchDown, { passive: true })
    window.addEventListener('touchmove', this.onTouchMove, { passive: true })
    window.addEventListener('touchend', this.onTouchUp, { passive: true })

    window.addEventListener('mousewheel', this.onWheel, { passive: true })
    window.addEventListener('wheel', this.onWheel, { passive: true })

    // window.addEventListener('keydown', this.onKeyDown)
    // window.addEventListener('focusin', this.onFocusIn)

    if(!this.isMobile){
      window.oncontextmenu = this.onContextMenu
    }
    else{

      document.body.addEventListener("scroll", this.onScroll, { passive: true })
    }
  }

  addLinksEventsListeners () {
    const links = document.querySelectorAll('a')
    for(let link of links){
      if(!this.links.includes(link)){
        let isLocal = link.href.indexOf(this.main.acf.base) == 0
        if(link.dataset.type){
        if(process.env.APP_ENV=='local'){
          isLocal = true
          if(link.dataset.type){
            // link.href = '/'+link.dataset.type+'.html'
          }
        }
        link.removeAttribute('data-type')
        }
        const isAnchor = link.href.indexOf('#') > -1
        
        if (isLocal) {
          link.onclick = event => {
            if (link.target == '_blank') return;
            event.preventDefault()

            //remove content hub header
            document.querySelector('.nav_box').classList.remove('nav_box--ch');
            
            if (!isAnchor) {
              
              this.onChange({
                url: link.href,
                id: link.dataset.id,
                link:link
                
              })
            }
          }
        } else if (link.href.indexOf('mailto') === -1 && link.href.indexOf('tel') === -1) {
          link.rel = 'noopener'
          link.target = '_blank'
        }
      }
      this.links.push(link)
    }
    
    const pods = document.querySelectorAll('*[data-player]')
    for(let link of pods){
      if(link.dataset.player){
        link.onclick = event => {
          this.player.start(link)

        }
      }
    }
    const shares = document.querySelectorAll('.shareclick_close')
    for(let share of shares){
      share.onclick = event => {
        if(share.parentNode.classList.contains('act')){
          share.parentNode.classList.remove('act')

        }
        else{

        share.parentNode.classList.add('act')
        }
      }
      
    }
  }
}

export default App