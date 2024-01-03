import Page from '../../js🧠🧠🧠/defaults/Page'
import player from 'bundle-text:./template.eta'
import audioLib from '../MediaPlayer/audioLib'
import emailRequired from 'bundle-text:./emailRequired.eta'
import emailNotAvailable from 'bundle-text:./emailNotAvailable.eta'
import discover from '../MediaPlayer/Discover'
import browse from '../MediaPlayer/Browse'
import playlist_page from '../MediaPlayer/Playlists'
import playlist_single from '../MediaPlayer/Playlist Single'
import module_single from '../MediaPlayer/Module Single'
import liked_podcasts from '../MediaPlayer/Liked_Podcasts'
import search_podcasts from '../MediaPlayer/Search'
// import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'

import * as Eta from 'eta'
import { getLoadingWheel } from '../Login🥸/LinkedinLogin/Dialog'

export default class extends Page {
  constructor (main,footer) {
    super(main,footer)
  }

  async generate(content) {
    let html = '';
    this.template = content.dataset.template
    this.playerPage = content.dataset.child || 'discover';
    this.main.title = content.dataset.title;
    this.postid = content.dataset.postid;
    this.spId = content.dataset.spid || 0;

    document.documentElement.classList.add('is_shared')

    window.history.replaceState({...window.history.state, postid: this.postid}, document.title, window.location.href);
    
    this.lsAvail = true;
    try {
      localStorage.getItem("sign_LC");
    } catch (_) {
      this.lsAvail = false;
    }

    this.state = {
      loop: this.lsAvail ? localStorage?.getItem("loop") === "true" : false,
      shuffle: this.lsAvail ? localStorage?.getItem("shuffle") === "true" : false,
      index: parseInt(this.lsAvail ? localStorage?.getItem("index") : 0),
      itemScrolling: "",
      playing: false, // only used for pausing while seeking
      filters: {cats: [], tags: [], topics: []}
    }

    // get filters
    const filtersResp = await fetch('/wp-json/sdv/player/v1/get-filters');
    const filters = await filtersResp.json();
    this.main.banner_image = this.main.acf?.player_banner_image;
    
    // get branding
    let params = new URLSearchParams();

    if(this?.main?.user) {
      window.location.href = '/learn';
    }

    if(!this.email) {
      html = Eta.render(emailRequired,{global:this.main,footer:this.footer})
      document.querySelector('#content').innerHTML += html;
      this.DOM = {
        el: document.querySelector('main:not(.old)'),
        submit_email: document.getElementById('submit_email')
      };

      this.DOM.submit_email.addEventListener("click", this.submit_email);
      return;
    }

    if(this.email) params.set('email', this.email);
    if(this.spId) params.set('spId', this.spId);

    // if(isEmbed) params.set('spId', page_params.get('spId'));

    const sponsorResp = this.spId ? await fetch(`/wp-json/sdv/player/v1/get-sponsor-id?${params}`) : await fetch(`/wp-json/sdv/player/v1/get-sponsor?${params}`);
    const sponsor = await sponsorResp.json();

    if(sponsor.id === 0) {
      html = Eta.render(emailNotAvailable,{global:this.main,footer:this.footer})
      document.querySelector('#content').innerHTML += html;
      this.DOM = {
        el: document.querySelector('main:not(.old)'),
        submit_email: document.getElementById('submit_email')
      };

      this.DOM.submit_email.addEventListener("click", this.submit_email);
      return;
    }

    this.main.sponsor = sponsor;

    // if (isEmbed) {
    //   document.documentElement.classList.add('embed');
    //   document.documentElement.classList.remove('smooth');
    //   document.documentElement.classList.add('touch');
    // }

    this.main.email = this.email;
    html = Eta.render(player,{global:this.main, footer:this.footer, filters})
    document.querySelector('#content').innerHTML += html;

    const seekbar = document.querySelector(".media-player__seek-bar");
    const volSlider = document.getElementById("volume-slider");

    this.loading = getLoadingWheel();

    this.DOM = {
      el: document.querySelector('main:not(.old)'),
      player: document.getElementById('audio-player'),
      mediaPlayer: document.querySelector(".media-player"),
      // mobile banner player info
      mobile_image: document.querySelector(".media-player__image img"),
      banner_title: document.querySelector(".media-player__banner h3"),
      banner_byline: document.querySelector(".media-player__banner span"),
      banner_close: document.querySelector("#close-mp-btn"),
      // player info
      title: document.querySelector(".media-player__title h3"),
      byline: document.querySelector(".media-player__title span"),
      currTime: document.getElementById('curr-time'),
      endTime: document.getElementById('end-time'),
      // seekbar
      seekbar,
      seekProgress: seekbar.querySelector("#progress"),
      seekHandle: seekbar.querySelector("#handle"),
      // left buttons
      prevBtn: document.getElementById('prev-btn'),
      playBtn: document.getElementById('play-btn'),
      nextBtn: document.getElementById('next-btn'),
      loopBtn: document.getElementById('loop-btn'),
      shuffleBtn: document.getElementById('shuffle-btn'),
      volBtn: document.getElementById('volume-btn'),
      // volume controls
      volCtrl: document.getElementById('volume-control'),
      volSlider,
      volProgress: volSlider.querySelector("#volume-progress"),
      volHandle: volSlider.querySelector("#volume-handle"),
      // right buttons
      menuList: document.getElementById('menu-list'),
      snackbar: document.getElementById('snackbar'),
      content: document.querySelector('.player-page__content'),
      //search
      searchBars: document.querySelectorAll('#player-search-bar'),
    }

    this.updateButtons();

    if(this.state.shuffle) this.shuffledPlaylist = this.shufflePlaylist();
    
    this.font = parseFloat(getComputedStyle(document.documentElement).fontSize)
    
    await this.loadImages()
    await this.createAnimations()

    discover.init(this);
    browse.init(this);
    playlist_page.init(this);
    liked_podcasts.init(this);
    playlist_single.init(this);
    module_single.init(this);
    search_podcasts.init(this);
    this.addEvents();
    audioLib.init(this.DOM);
    
    if (!localStorage.getItem('playlist')) {
      this.DOM.mediaPlayer?.classList.add('hidden');
    }

    this.nextPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? this.nextPlaylist;
  }

  submit_email() {
    const email = document.querySelector('.emailRequire').value;
    // console.log('this.email: ', this.email)
    // console.log('this.email Check: ', this.validateEmail(this.email));
  
    if(this.validateEmail(email)){
      this.email = email;

      this.generate(content);

      this.emit('globalchange')
      this.emit('reset')
    }
  }

  validateEmail(email){
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }

  addFiltersToParams(params) {
    const filters = this.state.filters;

    if(filters.cats.length > 0) params.set("cats", filters.cats.join(','));
    if(filters.tags.length > 0) params.set("tags", filters.tags.join('|'));
    if(filters.topics.length > 0) params.set("topics", filters.topics.join('|'));

    return params;
  }

  setBranding(icon, logo, banner, color) {
    // set icon
    const iconImg = document.querySelector('.player-header__profile-img img');
    if (iconImg && icon) iconImg.src = icon;

    // set logo
    const logoImg = document.querySelector('.player-header__logo img');
    if (logoImg && logo) logoImg.src = logo;

    // set banner
    const bannerImg = document.querySelector('.player-page__content-banner img');
    if (bannerImg && banner) {
      this.main.banner_image = banner;
      bannerImg.src = banner;
    };

    const bannerImgMobile = document.querySelector('.media-player__banner img');
    if (bannerImgMobile && icon) {
      bannerImgMobile.src = icon;
    };
    
    // set color
    if(color) document.getElementById('content')?.style?.setProperty('--brand-color', color);
  }

  search(e) {
    const searchTerm = e.target.value;

    if(!searchTerm) return;
    this.search_term = searchTerm.trim();
    this.search_term_tax = false;

    const params = new URLSearchParams(window.location.search);
    params.set('term', this.search_term);

    params.delete("tax");
    this.DOM.searchBars?.forEach(x => x.blur());

    window.history.pushState({'player_href': 'search'}, document.title, `${this.main.acf.search_podcasts_page_link}?${params}`);
    this.lastload = search_podcasts.load;
    this.lastload();
  }

  addLinkEvents(){
    const goBack = () => {
      if(window.history.state?.player_href && document.querySelector('.media-player')){
        const link = window.history.state?.player_href;

        this.postid = window.history.state?.postid || this.postid;

        switch (link) {
          case 'discover':
            this.lastload = discover.load;
            this.lastload();
            break;
          case 'browse':
            this.lastload = browse.load;
            this.lastload();
            break;
          case 'playlists':
            this.lastload = playlist_page.load;
            this.lastload();
            break;
          case 'playlist':
            this.lastload = playlist_single.load;
            this.lastload();
            break;
          case 'module':
            this.lastload = module_single.load;
            this.lastload();
            break;
          case 'search':
            this.lastload = search_podcasts.load;
            this.lastload();
            break;
          default:
            break;
        }
      }
      else window.removeEventListener('popstate', goBack);
    }

    window.addEventListener('popstate', goBack);

    const changeLink = (elem) => {
      if(elem.classList.contains('player-page-tab--active')) return;
      const link = elem.dataset.href;
      if(!link) return;

      let url;

      switch (link) {
        case 'discover':
          this.lastload = discover.load;
          this.lastload();
          url = this.main.acf.discover_page_link;
          break;
        case 'browse':
          this.lastload = browse.load;
          this.lastload();
          url = this.main.acf.browse_page_link;
          break;
        case 'playlists':
          this.lastload = playlist_page.load;
          this.lastload();
          url = this.main.acf.playlists_page_link;
          break;
        default:
          break;
      }

      if(url) window.history.pushState({'player_href': link}, document.title, url);
    }

    document.querySelectorAll('.player-page__nav-link').forEach((x) => x.addEventListener('click', () => changeLink(x)));
  }

  isSinglePlaylist() {
    return this.DOM?.mediaPlayer?.classList.contains('single-playlist');
  }

  mpNav () {
    const searchBtn = document.querySelector(".nav_search-mp-mobile");
    const menuElem = document.querySelector(".player-page__nav-mobile");
    const searchElem = document.querySelector(".player-header__search-mobile");

    const showSearch = () => {
      menuElem?.classList.remove('active');
      searchElem?.classList.toggle('active');
    }

    searchBtn?.removeEventListener('click', showSearch);
    searchBtn?.addEventListener('click', showSearch);
  }

  addEvents() {
    this.addLinkEvents();
    this.DOM.playBtn.addEventListener("click", (e) => {
      e?.stopPropagation();
      audioLib.play();
    });
    this.DOM.loopBtn.addEventListener("click", this.loop);
    this.DOM.shuffleBtn.addEventListener("click", this.shuffle);
    this.DOM.seekbar.addEventListener('click', audioLib.seekOnBar);
    this.DOM.prevBtn.addEventListener('click', this.prev);
    this.DOM.nextBtn.addEventListener('click', this.next);
    this.DOM.player.addEventListener('ended', this.replay);
    this.DOM.volBtn.addEventListener('click', this.toggleVolControls);
    this.DOM.volSlider.addEventListener('click', audioLib.volumeOnBar);
    this.DOM.volCtrl.addEventListener('click', (e) => e.stopPropagation());
    this.DOM.volHandle.addEventListener('mousemove', this.volumeHandle);
    this.mpNav();
    this.show();

    this.DOM.seekHandle.addEventListener('mousemove', this.seekHandle)    
    this.DOM.seekHandle.addEventListener('mousedown', () => {
      this.updateState({playing: !this.DOM.player.paused});
      if(this.state.playing) audioLib.play();
    });
    document.addEventListener('mousemove', this.docSliderHandler);
    document.addEventListener('mouseup', () => {
      if(this.state.playing) {
        audioLib.play();
        this.updateState({playing: false});
      }
    })

    // search
    this.DOM.searchBars?.forEach(x => x.addEventListener('keydown', (e) => { if (e.code == 'Enter') this.search(e) }));

    //tags/cats/topics
    document.querySelectorAll(".player-page__filters:not(.player-page__filters--modules) .player-page__filter-item").forEach(this.setupFilters);

    this.expandPlayer = () => {
      if (this.DOM.mediaPlayer.classList.contains('media-player--active')) return;

      this.DOM.mediaPlayer.style.transform = "translateY(100%)";

      setTimeout(() => {
        this.DOM.mediaPlayer.style.transform = "translateY(0%)";
        this.DOM.mediaPlayer?.classList.add('media-player--active');
      }, 250);
    };

    this.collapsePlayer = () => {
      this.DOM.mediaPlayer.style.transform = "translateY(100%)";

      setTimeout(() => {
        this.DOM.mediaPlayer.style.transform = "translateY(0%)";
        this.DOM.mediaPlayer?.classList.remove('media-player--active');
      }, 250);
    };

    const isMobile = document.documentElement.classList.contains('touch');
    
    const isEmbedPlaylist = document.querySelector('html.embed #content[data-child=playlist]');

    if(isMobile && !isEmbedPlaylist) {
      this.DOM.mediaPlayer.addEventListener('click', this.expandPlayer);
      this.DOM.banner_close.addEventListener('click', (e) => {
        e?.stopPropagation();
        this.collapsePlayer();
      });
      document.addEventListener('popstate', this.collapsePlayer);
    }
  }

  currentPodcast(){
    const index = this.state.index;
    const playlist = this.state.shuffle ? this.shuffledPlaylist : this.playlist;

    return playlist[index];
  }

  async playPlaylist(id, ismodule = false) {
    if(!id && !ismodule) return;

    //  console.log('id, ismodule');
    //  console.log(id, ismodule);

    const params = new URLSearchParams();
    params.set("id", id);

    
    const url = `/wp-json/sdv/player/v1/get-playlist?${params}`;
    let playlist = this.nextPlaylist;
    this.nextPlaylist = [];

    if(!ismodule){
      const resp = await fetch(url);
      const respJson = await resp.json();
      playlist = respJson?.modules;
    }

    this.playlist = [];

    if (playlist) {
      for(const module of playlist){
        const podcast = {
          title: module.title || module.post_title,
          byline: module.byline,
          image: module.image || module.img,
          src: module.src,
          id: module.id || module.ID,
          liked: module.liked,
          link: module.link,
          img: module.img,
        };
  
        this.playlist.push(podcast);
      }
    }

    this.updateState({index: 0});

    if(this.state.shuffle) this.shuffledPlaylist = this.shufflePlaylist();
    
    this.load(this.playlist[0]);
  }

  regModuleClick(){
    document.querySelectorAll('.p-m').forEach((module) => {
      module.addEventListener('click', (e) => {
        //  console.log('opening module page');
        this.postid = module.dataset.id;

        window.history.pushState({'player_href': 'module', postid: this.postid}, document.title, module.dataset.href);
        this.lastload = module_single.load;
        this.lastload();
      });
    });
  }

  regPlaylistClick(){
    document.querySelectorAll('.player-playlist').forEach((playlist) => {
      playlist.addEventListener('click', (e) => {
        //  console.log('opening playlist page');
        this.postid = playlist.dataset.id;

        window.history.pushState({'player_href': 'playlist', postid: this.postid}, document.title, playlist.dataset.href);
        this.lastload = playlist_single.load;
        this.lastload();
      });
    });
  }

  regModuleFilters(module){
    const genFilterElem = (filters, filter, type, i) => {
      const filterElem = document.createElement('span');
      filterElem.id = `${type}-${i}`;
      filterElem.dataset.id = filter.id;
      filterElem.dataset.type = type;
      filterElem.classList.add("player-page__filter-item");
      filterElem.classList.add("mouseHover");
      filterElem.innerHTML = filter.name;

      filters.appendChild(filterElem);
    }

    // add cats
    const cats = document.querySelector('.player-page__filter-items--cats');
    cats.innerHTML = '';

    if(module?.cats){
      module?.cats
      ?.map(x => new Object({id: x.term_id, name: x.name}))
      ?.forEach((cat, i) => genFilterElem(cats, cat, 'cat', i));
    }
    
    // add tags
    const tags = document.querySelector('.player-page__filter-items--tags');
    tags.innerHTML = '';

    if(module?.tags){
      module?.tags
      ?.map(x => new Object({id: x.ID, name: x.post_title}))
      ?.forEach((tag, i) => genFilterElem(tags, tag, 'tag', i));
    }
    

    // add topics
    const topics = document.querySelector('.player-page__filter-items--topics');
    topics.innerHTML = '';

    if(module?.topics){
      module?.topics
      ?.map(x => new Object({id: x.ID, name: x.post_title}))
      ?.forEach((topic, i) => genFilterElem(topics, topic, 'topic', i));
    }

    const moduleFilterBtns = document.querySelectorAll(".player-page__filters--modules .player-page__filter-item");

    moduleFilterBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        this.search_term = btn.innerText;
        this.search_term_tax = btn.dataset.type;
        const params = new URLSearchParams(window.location.search);
        params.set("term", this.search_term);
        params.set("tax", this.search_term_tax);
        this.DOM.searchBars?.forEach((x)=>x.blur());
        // clear selected cats
        const actClass = "player-page__filter-item--active";
        document.querySelectorAll(`.${actClass}`).forEach((filter)=>filter.classList.remove(actClass));
        this.state.filters = {cats: [], tags: [], topics: []};

        window.history.pushState({
          "player_href": "search"
        }, document.title, `${this.main.acf.search_podcasts_page_link}?${params}`);
        this.lastload = search_podcasts.load;
        this.lastload();
      });
    })
  }

  regModuleButtons(){
    const playBtns = document.querySelectorAll('.module-play-btn');
    const readTranscriptBtn = document.querySelector('.module-read-transcript');

    readTranscriptBtn?.addEventListener('click', (e) => {
      const transcript = document.querySelector('.player-module-page__transcript');

      transcript.classList.add('expanded-transcript');
    });

    playBtns.forEach(btn => {
      btn.addEventListener('click', async e => {
        e?.stopPropagation();
        const parent = btn.parentElement;

        if(btn.dataset.fetch){
          const params = new URLSearchParams();
          params.set("id", parent.dataset.id || 0);
      
          const url = `/wp-json/sdv/player/v1/get-module?${params}`;
      
          const postsResp = await fetch(url);
          const module = (await postsResp.json());
          this.nextPlaylist = [module];
        }

        this.playPlaylist(parent.dataset.id, true);
      });
    })
  }
  
  setupFilters(x) {
    x.addEventListener("click", async () => {
      const classname = "player-page__filter-item--active";
      let key;

      if(x.id.includes("cat")) key = "cats";
      if(x.id.includes("tag")) key = "tags";
      if(x.id.includes("topic")) key = "topics";

      const filterArr = this.state.filters[key];

      if (x.classList.contains(classname)) {
        x.classList.remove(classname);

        let index = filterArr.indexOf(x.dataset.id);
        if (index !== -1) filterArr.splice(index, 1)
      }
      else {
        x.classList.add(classname);

        filterArr.push(x.dataset.id);
      }

      // clearTimeout(this.filterChanged);
      this.lastload();
  
      // this.filterChanged = setTimeout(() => snackbar.classList.remove("snackbar--visible"), 2500);
    });
  }

  docSliderHandler(e){
    if (e.buttons == 1) {
      switch(this.state.itemScrolling){
        case "volume":
          this.volumeHandle(e);
          break;
        case "seek":
          this.seekHandle(e);
          break;
        default:
          break;
      }
    }
    else this.updateState({itemScrolling: ""});
  }

  volumeHandle(e) {
    e.preventDefault();

    if (e.buttons == 1) {
      const y = this.DOM.volSlider.getBoundingClientRect().bottom - e.pageY;
      const height = this.DOM.volSlider.clientHeight;

      let percent = y/height;
      percent = percent <= 1 ? percent : 1;
      percent = percent >= 0 ? percent : 0;
      audioLib.volumeOnHandle(percent);
      this.updateState({itemScrolling: "volume"});
    }
  }

  seekHandle(e) {
    e.preventDefault();

    if (e.buttons == 1) {
      const x = e.pageX - this.DOM.seekbar.offsetLeft;
      const width = this.DOM.seekbar.clientWidth;

      let percent = x/width;
      percent = percent <= 1 ? percent : 1;
      percent = percent >= 0 ? percent : 0;
      audioLib.seekOnHandle(percent);
      this.updateState({itemScrolling: "seek"});
    }
  }

  // volume
  toggleVolControls (e, forceHide = false) {
    const volCtrl = this.DOM.volCtrl;
    const volBtn = this.DOM.volBtn;

    if(forceHide || volCtrl.style.display === "block") {
      volCtrl.style.display = "none";
      volBtn.classList.add("mp-btn");
      document.removeEventListener('click', this.toggleVolControls);
    }
    else {
      volCtrl.style.display = "block";
      volBtn.classList.remove("mp-btn");
      document.addEventListener('click', this.toggleVolControls);
      e?.stopPropagation();
    }
  }

  updateButtons () {
    const loop = this.state.loop;
    const loopBtn = this.DOM.loopBtn;

    if(loop) loopBtn.classList.add("mp-btn--active");
    else loopBtn.classList.remove("mp-btn--active");

    const shuffle = this.state.shuffle;
    const shuffleBtn = this.DOM.shuffleBtn;

    if(shuffle) shuffleBtn.classList.add("mp-btn--active");
    else shuffleBtn.classList.remove("mp-btn--active");
  }

  // snackbar
  showSnackbar(message) {
    const snackbar = this.DOM.snackbar;
    clearTimeout(this.snackbarShowing);
    snackbar.style.display = 'unset';

    setTimeout(() => {
      if(message) snackbar.innerHTML = message;
      snackbar.classList.add("snackbar--visible");
  
      this.snackbarShowing = setTimeout(() => snackbar.classList.remove("snackbar--visible"), 3000)
      setTimeout(() => snackbar.style.display = 'none', 3500)
    }, 100)
  }

  // audio
  replay(){
    if(this.state.loop) audioLib.play();
    else this.next();
  }

  load (podcast) {
    setTimeout(() => {
      this.DOM.mediaPlayer.style.height = null;
      this.DOM.mediaPlayer.style.overflow = 'unset';
    }, 500);

    audioLib.load(podcast, this.playlist, this.state.index);

    this.DOM.mobile_image.src = podcast.img;

    this.DOM.banner_title.innerHTML = podcast.title;
    this.DOM.banner_byline.innerHTML = podcast.byline;

    this.DOM.title.innerHTML = podcast.title;
    this.DOM.byline.innerHTML = podcast.byline;
  }

  prev (e) {
    e?.stopPropagation();
    const index = this.state.index;
    const playlist = this.state.shuffle ? this.shuffledPlaylist : this.playlist;
    const prevIndex = (index + playlist.length - 1) % playlist.length;

    const podcast = playlist[prevIndex];

    this.load(podcast);
    this.updateState({index: prevIndex});
  }

  next (e) {
    e?.stopPropagation();
    if(this.isSinglePlaylist()) return;
    const index = this.state.index;
    const playlist = this.state.shuffle ? this.shuffledPlaylist : this.playlist;
    const nextIndex = (index + 1) % playlist.length;
  
    const podcast = playlist[nextIndex];

    this.load(podcast);
    this.updateState({index: nextIndex});
  }

  loop () {
    if(this.isSinglePlaylist()) return;
    const loop = !this.state.loop;
    const btn = this.DOM.loopBtn;

    if(loop) btn.classList.add("mp-btn--active");
    else btn.classList.remove("mp-btn--active");

    this.updateState({loop});
  }

  shuffle () {
    if(this.isSinglePlaylist()) return;
    const shuffle = !this.state.shuffle;
    let index = 0;
    const btn = this.DOM.shuffleBtn;

    if(shuffle) {
      btn.classList.add("mp-btn--active");
      this.shuffledPlaylist = this.shufflePlaylist();
    }
    else {
      const podcast = this.shuffledPlaylist[index];
      btn.classList.remove("mp-btn--active");
      index = this.playlist.findIndex(x => x.src === podcast.src);
    }

    this.updateState({shuffle, index});
  }

  shufflePlaylist() {
    const array = this.playlist?.slice();
  
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    let index = array.findIndex((x) => x.src === this.playlist[this.state.index].src);
    let elem = array.splice(index, 1)[0];

    array.unshift(elem);

    return array;
  }

  // utils
  updateState (state) {
    for(const [key, value] of Object.entries(state)){
      this.state[key] = value
    }

    localStorage.setItem('loop', this.state.loop);
    localStorage.setItem('shuffle', this.state.shuffle);
  }
  
  formatDate (dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}, ${year}`;
  }

  formatDuration(duration, mmhh = false) {
    if (mmhh){
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    if (duration < 60) return duration + ' Secs';
    else if (duration < 3600) return Math.floor(duration / 60) + ' Mins';
    else return Math.floor(duration / 3600) + ' Hrs';
  }

  async ajaxImages(){
    let newpage = document.createElement("template")
    newpage.innerHTML = this.html

    let paths = Array.from(newpage.content.querySelectorAll('img'))
    const promises = []
    paths.forEach((path) => {
      promises.push(new Promise((resolve, reject) => {
          const img = new Image();

          img.onload = ()=>resolve(path)
          img.onerror = ()=>reject(path)
          
          img.src = path.src
      }))
    })
    return Promise.resolve()



  }

  async blocksClick (type){
    this.DOM.holder.classList.add('load')
    await this.timeout(600)
    if(type=='block'){
      this.DOM.holder.classList.add('blocks')
    }
    else{
      this.DOM.holder.classList.remove('blocks')

    }
    this.DOM.holder.classList.remove('load')
    this.resizeLimit()
  }

  async loadImages(){
    let paths = Array.from(this.DOM.el.querySelectorAll('img'))
    const promises = []
    paths.forEach((path) => {
      promises.push(new Promise((resolve, reject) => {
          const img = new Image();

          img.onload = ()=>resolve(path)
          img.onerror = ()=>reject(path)
          
          img.src = path.src
      }))
    })
    let videos = Array.from(this.DOM.el.querySelectorAll('video.wait'))
    if(videos){
      Promise.all(videos).then(values => {
        for(let vid of values){
            vid.play();
        }
      });
    }
    return super.loadImages()



  }
  
  callBacks(){
    this.sticks = []
    this.callback = (entries,observer) =>{
      entries.forEach(entry=>{
        if(!entry.target.dataset.pos){
          return false
        }
        const pos = entry.target.dataset.pos
        const id = this.anims[pos].id.substring(0, 1);
        if(id=='l'){

        }
        if(!entry.isIntersecting){
          if(this.anims[pos].active==true && this.anims[pos].animated==1){
            if(id=='s'){
              // console.log(this.anims[pos])
              this.anims[pos].stick.active = 0
              this.movestick = null
            }
            else if(id=='v'){

              clearInterval(this.clockInt)
            }
            else if(id=="t"){
              
              this.anims[pos].stick.active = 0
              this.movetext = null
            }

            else if(id=='c'){
              document.documentElement.classList.remove('white-menu')
            }
            else if(id=='l'){
              document.documentElement.classList.remove('logohide-menu')
            }
            else if(id=='q'){
              document.documentElement.classList.remove('quick-menu')
            }
            else if(id=='e'){
              this.anims[pos].classel.stop()
              this.slidetext = null
              
            }
          }
          this.anims[pos].active = false
        }
        else if(entry.isIntersecting){
          if(this.anims[pos].active==false && this.anims[pos].animated==1){
            if(id=='e'){
              this.anims[pos].classel.start()
              this.slidetext = this.anims[pos]
            }
            else if(id=='v'){
              this.clockStart(this.anims[pos].el.parentNode.querySelector('.time'))
            }
            else if(id=='s'){
              this.anims[pos].stick.active = 1
              this.movestick = this.anims[pos]
            }
            else if(id=='t'){
              this.anims[pos].stick.active = 1
              this.movetext = this.anims[pos]
            }
            
            else if(id=='c'){
              document.documentElement.classList.add('white-menu')
            }
            else if(id=='l'){
              document.documentElement.classList.add('logohide-menu')
            }
            else if(id=='q'){
              document.documentElement.classList.add('quick-menu')
            }
          }
          this.anims[pos].active = true
          if(this.anims[pos].animated==2){
            this.makeAnim(this.anims[pos],(entry.boundingClientRect.y).toFixed(0),entry.intersectionRatio)
          }
          else if(this.anims[pos].animated==0){
            if(entry.intersectionRatio > 0.8){
              entry.target.classList.add('inview')
              if(this.anims[pos].classel!=null){
                this.anims[pos].classel.start()
              }
              this.observer.unobserve(entry.target)
            }
          }
        }
      })
    }
    
    if(this.main.isTouch){
      this.optionsob = {
        root:document.body,
        threshold:this.buildThresholdList(500)
      };
    }
    else{
      this.optionsob = {
        root:null,
        threshold:this.buildThresholdList(500)
      };
    }
    this.observer = new IntersectionObserver(this.callback,this.optionsob)
    if(this.DOM.watchers){
      this.DOM.watchers.forEach((el)=>{
        this.observer.observe(el)
      })
    }
  }

  createAnimations () {
    if(this.DOM.watchers){
      for(let[index,anim] of this.DOM.watchers.entries()){
        let vocal = ''
        let animated = 0
        let stick = null
        let classel = null
        let gsapanim = null
        let delay = 0
        if(anim.classList.contains('iO-stck')){
          animated = 1
          stick = {
            parent:this.DOM.el.querySelector('#stck'+anim.dataset.stck),
            son:this.DOM.el.querySelector('#stck'+anim.dataset.stck+' .stck_main'),
            active:0,
            current:0,
            target:0,
            pos:0,
            prog:0,
            limit:0
          }
          
          vocal ='s'+index
          
        }
        else if(anim.classList.contains('iO-time')){
          
          vocal ='v'+index
          animated = 1
        }
        else{

          vocal ='n'+index
        }
        anim.dataset.pos = index
        let animobj = {
          el: anim,
          pos: index,
          stick: stick,
          id: vocal+'s',
          animated:animated,
          gsapanim:gsapanim,
          classel:classel,
          active: false
        };
        this.anims.push(animobj)
        
      }
    }
  }
  makeAnim(anim,y,ratio){
    const id = anim.id.substring(0, 1);
    let prog = 0
    //HAY que hacer algo con esto, que si no tiene el tamaño de la pantalla,peta
    if(y < 0){
      prog = 1-(ratio/2)
    }
    else{
      prog = (ratio/2)
    }
    if(id=='p' || id=='h' || id=='f'){
      anim.gsapanim.progress(prog)
    }
  }
  onResize(){
    
    return super.onResize()
  }
  
  
  smoothScroll(){
    if(this.isVisible==1){
      super.smoothScroll()
    }
    
  }

  mobileScroll(){
    if(this.isAutoScroll==0){
      
    }
  }

  modifyNav(show = false){
    const accountBtn = document.querySelector('.nav_buttons #my-account-btn');
    const searchBtn = document.querySelector('.nav_search');
    const mpNav = document.querySelector('.nav-mp-mobile');
    const navBtn = document.querySelector('.nav_burger');
    
    if (!show) {
      // hide items
      searchBtn.style.maxHeight = '0%';
      navBtn.style.maxHeight = '0%';
      mpNav.style.maxHeight = '100%';

      // make target blank
      accountBtn.target = '_blank';
    } else {
      // show items
      searchBtn.style.maxHeight = '100%';
      navBtn.style.maxHeight = '100%';
      mpNav.style.maxHeight = '0%';

      // make target not blank
      accountBtn.target = '_self';
    }
  }

  async show () {
    this.timeout(1)
    window.history.replaceState({'player_href': this.playerPage}, document.title, window.location.href);

    this.modifyNav();
    
    // load the current loaded pages playlist
    if (this.playerPage === "browse") {
      this.lastload = browse.load;
    } else if (this.playerPage === "playlists") {
      this.lastload = playlist_page.load;
    } else if (this.playerPage === "playlist") {
      this.lastload = playlist_single.load;
    } else if (this.playerPage === "module") {
      this.lastload = module_single.load;
    } else if (this.playerPage === "search") {
      this.lastload = search_podcasts.load;
    } else {
      this.lastload = discover.load;
    }

    await this.lastload();

    this.playPlaylist(0, true);

    return super.show()
  }

  async hide () {
    this.isVisible = 0
    document.removeEventListener('popstate', this.collapsePlayer);

    this.modifyNav(true);

    return super.hide()
  }
}
