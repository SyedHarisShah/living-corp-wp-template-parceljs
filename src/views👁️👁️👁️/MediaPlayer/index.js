import Page from '../../js🧠🧠🧠/defaults/Page'
import player from 'bundle-text:./template.eta'
import audioLib from './audioLib'
import icons from "../../js🧠🧠🧠/basic/icons🔰";
import notlogged from 'bundle-text:/src/views👁️👁️👁️/404/notlogged.eta'
import discover from './Discover'
import browse from './Browse'
import playlist_page from './Playlists'
import playlist_single from './Playlist Single'
import module_single from './Module Single'
import liked_podcasts from './Liked_Podcasts'
import search_podcasts from './Search'
import new_playlist from 'bundle-text:./Templates/Playlist/new-playlist.eta'
import delete_dialog from 'bundle-text:./Templates/Playlist/delete-confirmation.eta'
import noaccess from 'bundle-text:/src/views👁️👁️👁️/404/noaccess.eta'

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
    let email = '';
    const page_params = new URLSearchParams(window.location.search);

    const isEmbed = page_params.get('isEmbed') != null;
    this.embed = isEmbed;

    if(this?.main?.user && !isEmbed){
      email = this?.main?.user?.user?.data?.user_email;

      if (!this?.main?.user?.acf?.is_player_user) {
        html = Eta.render(noaccess,{global:this.main,footer:this.footer})
        document.querySelector('#content').innerHTML += html;
        this.DOM = {el: document.querySelector('main:not(.old)')};
        return;
      }
    }

    if(email) params.set('email', email);

    if(isEmbed) params.set('spId', page_params.get('spId'));

    const sponsorResp = await fetch(`/wp-json/sdv/player/v1/get-sponsor?${params}`);
    const sponsor = await sponsorResp.json();
    this.main.sponsor = sponsor;

    if (isEmbed) {
      document.documentElement.classList.add('embed');
      document.documentElement.classList.remove('smooth');
      document.documentElement.classList.add('touch');
    }
    else if(!this.main.user) {
    // if(!(this.main.user || isEmbed)){
      html = Eta.render(notlogged,{global:this.main,footer:this.footer})
      document.querySelector('#content').innerHTML += html;
      this.DOM = {el: document.querySelector('main:not(.old)')};
      return;
    }

    await this.getUserPlaylists();

    this.main.user = this.main.user || {};
    html = Eta.render(player,{global:this.main, footer:this.footer, filters, user_playlists: this.user_playlists})
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
      likeBtn: document.getElementById('like-btn'),
      shareBtn: document.getElementById('share-btn'),
      menuBtn: document.getElementById('menu-btn'),
      menuList: document.getElementById('menu-list'),
      snackbar: document.getElementById('snackbar'),
      content: document.querySelector('.player-page__content'),
      //search
      searchBars: document.querySelectorAll('#player-search-bar'),
    }

    // // current playing playlist
    // this.playlist = [
    //   {
    //     title: "1",
    //     byline: "by test1",
    //     image: "",
    //     src: "https://download.samplelib.com/mp3/sample-15s.mp3",
    //     liked: true,
    //   },
    //   {
    //     title: "2",
    //     byline: "by test2",
    //     image: "",
    //     src: "https://download.samplelib.com/mp3/sample-15s.mp3",
    //     liked: false,
    //   },
    //   {
    //     title: "3",
    //     byline: "by test3",
    //     image: "",
    //     src: "https://download.samplelib.com/mp3/sample-15s.mp3",
    //     liked: false,
    //   },
    //   {
    //     title: "4",
    //     byline: "by test4",
    //     image: "",
    //     src: "https://download.samplelib.com/mp3/sample-15s.mp3",
    //     liked: true,
    //   },
    // ]


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

  // changeSponsor(sponsorObj = null) {
  //   const setBranding = this.setBranding;
  //   console.log(this.main.acf);

  //   if (sponsorObj === null) {
  //     // use global
  //     setBranding(this.main.acf?.player_brand_icon, this.main.acf?.player_brand_logo, this.main.acf?.player_banner_image, this.main.acf?.player_brand_color);
  //   } else if (sponsorObj?.sponsor) {
  //     // use playlist/module sponsor
  //     setBranding(sponsorObj.sponsor.icon, sponsorObj.sponsor.logo, sponsorObj.sponsor.banner, sponsorObj.sponsor.color);
  //   } else {
  //     // dont change
  //   }
  // }

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
          case 'liked-podcasts':
            this.lastload = liked_podcasts.load;
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
        case 'liked-podcasts':
          this.lastload = liked_podcasts.load;
          this.lastload();
          url = this.main.acf.liked_podcasts_page_link;
          break;
        case 'create-playlist':
          this.createPlaylist();
          break;
        default:
          break;
      }

      if(url) window.history.pushState({'player_href': link}, document.title, url);
    }

    document.querySelectorAll('.player-page__nav-link').forEach((x) => x.addEventListener('click', () => changeLink(x)));
  }

  createPlaylist() {
    const playlists = document.querySelector('.player-page__nav-playlists');
    const html = Eta.render(new_playlist, {icons});
    const newPlElem = document.createElement('div');
    playlists.prepend(newPlElem);
    newPlElem.outerHTML = html

    const newPlaylist = document.querySelector('.player-page__nav-new-playlist');
    const input = newPlaylist.querySelector('input');
    const text = newPlaylist.querySelector('.player-page-btn--text');
    const shareicon = newPlaylist.querySelector('.player-page-btn--icon');
    const close = newPlaylist.querySelector('#close-icon');

    input.focus();

    const create2 = (e) => { if (e.code == 'Enter') create() };

    const create = async () => {
      close.removeEventListener('mousedown', create);
      input.removeEventListener('blur', create);
      input.removeEventListener('keydown', create2);

      if(!newPlaylist) return;
      newPlaylist.classList.remove('player-page__nav-new-playlist');
      newPlaylist.classList.remove('pl-adding');
      let name = input.value;
      shareicon.style.display = null;

      const params = new URLSearchParams();
      params.set("userid", this.main.user?.user?.ID);
      params.set("name", name);
  
      const url = `/wp-json/sdv/player/v1/create-user-playlist?${params}`;
  
      const resp = await fetch(url, {method: 'POST'});
      const [num, upid] = await resp.json();

      if(num === 'unauthorized') newPlaylist.remove();
      else if(!name) {
        name = `Custom Playlist #${num+1}`;
      }

      text.innerHTML = name;

      newPlaylist.id = `playlist_${num}`;
      newPlaylist.dataset.href = `/playlist/?upid=${upid}`;
      shareicon.addEventListener('click', (e) => this.shareUserPlaylist(e, shareicon))
      newPlaylist.addEventListener('click', () => this.clickUserPlaylist(newPlaylist));
      //add to playlist menu
      this.DOM.menuList.innerHTML = `<li id="playlist_${num}-add">${name}</li>` + this.DOM.menuList.innerHTML;

      close.removeEventListener('mousedown', create);

      this.refreshPlaylistPage();
    }

    close.addEventListener('mousedown', create);
    input.addEventListener('blur', create);
    input.addEventListener('keydown', create2);
  }

  async addToPlaylist (e, id) {
    if(e.target?.id?.startsWith('playlist_')){
      const params = new URLSearchParams();

      id = id || this.currentPodcast().id;
      params.set("userid", this.main.user?.user?.ID);
      params.set("playlist_key", e.target.id.split('-')[0]);
      params.set("podcast_id", id);
  
      const url = `/wp-json/sdv/player/v1/add-to-user-playlist?${params}`;
  
      const resp = await fetch(url, {method: 'POST'});

      if(await resp.json() === true) {
        this.showSnackbar("Added to playlist");
        this.refreshPlaylistPage();
      }
    }
  }

  async removeFromPlaylist (upid, id) {
    if(!upid || !id) return;

    const params = new URLSearchParams();

    const elm = document.querySelector(`[data-href="/playlist/?upid=${upid}"]`);

    params.set("userid", this.main.user?.user?.ID);
    params.set("playlist_key", elm?.id.split('-')[0]);
    params.set("podcast_id", id);

    const url = `/wp-json/sdv/player/v1/remove-from-user-playlist?${params}`;

    const resp = await fetch(url, {method: 'POST'});

    if(await resp.json() === true) {
      this.showSnackbar("Removed from playlist");
      this.refreshPlaylistPage();
    }
  }

  refreshPlaylistPage () {
    if (document.querySelector('.player-page-tab--active')?.dataset.href === 'playlists') {
      this.lastload = playlist_page.load;
      this.lastload();
    } else if (window.location.href.includes('playlist')) {
      this.lastload();
    }
  }

  isSinglePlaylist() {
    return this.DOM?.mediaPlayer?.classList.contains('single-playlist');
  }

  mpNav () {
    const menuBtn = document.querySelector(".nav_burger-mp-mobile");
    const searchBtn = document.querySelector(".nav_search-mp-mobile");
    const menuElem = document.querySelector(".player-page__nav-mobile");
    const searchElem = document.querySelector(".player-header__search-mobile");

    const showSearch = () => {
      menuElem?.classList.remove('active');
      searchElem?.classList.toggle('active');
    }
    const showMenu = () => {
      searchElem?.classList.remove('active');
      menuElem?.classList.toggle('active');
    }

    menuBtn?.removeEventListener('click', showMenu);
    searchBtn?.removeEventListener('click', showSearch);
    menuBtn?.addEventListener('click', showMenu);
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
    this.DOM.likeBtn.addEventListener('click', (e) => this.like());
    this.DOM.shareBtn.addEventListener('click', () => this.share(false, true));
    this.DOM.menuBtn.addEventListener('click', this.togglePlaylistMenu);
    this.DOM.menuList.addEventListener('click', this.addToPlaylist);
    this.regUserPlaylistClick();
    this.mpNav();

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

    //share user playlist
    document.querySelectorAll(".share-user-pl-btn").forEach((btn) => btn.addEventListener('click', (e) => this.shareUserPlaylist(e, btn)));

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

  shareUserPlaylist(e, btn) {
    // this is now the menu
    const menu = btn.parentElement.querySelector('.mp-dropmenu');

    const editPlaylist = (playlist) => {
      playlist.classList.add('pl-adding');
      
      const close = playlist.querySelector('#close-icon');
      const input = playlist.querySelector('input');
      const text = playlist.querySelector('.player-page-btn--text');

      const save2 = (e) => { if (e.code == 'Enter') save() };
      
      const save = async () => {
        close?.removeEventListener('mousedown', save);
        input?.removeEventListener('blur', save);
        input?.removeEventListener('keydown', save2);

        if(!playlist) return;
        const pl_id = playlist.id;

        playlist.classList.remove('pl-adding');

        let name = input.value;

        if(!name || text.innerHTML === name) return;

        const params = new URLSearchParams();
        params.set("userid", this.main.user?.user?.ID);
        params.set("playlist_key", pl_id);
        params.set("name", name);
    
        text.innerHTML = "Saving...";
    
        const url = `/wp-json/sdv/player/v1/edit-user-playlist?${params}`;
    
        const resp = await fetch(url, {method: 'POST'});
        const res = await resp.json();

        if(res === 'unauthorized') return;

        const addToPl = document.getElementById("menu-list").querySelector(`#${pl_id}-add`);
        if(addToPl) addToPl.innerHTML = name;
        text.innerHTML = name;

        this.refreshPlaylistPage();
      }

      close.addEventListener('mousedown', save);
      input.addEventListener('blur', save);
      input.addEventListener('keydown', save2);

      setTimeout(() => input.focus(), 500);
    }

    const deletePlaylist = (playlist) => {
      // show popup
      const html = Eta.render(delete_dialog, {name: playlist.querySelector('.player-page-btn--text')?.innerHTML});
      let dialog = document.createElement('div');

      document.body.append(dialog);
      dialog.outerHTML = html;
      const dialog_bg = document.getElementById('delete-conf-dialog-background');
      dialog = document.getElementById('delete-conf-dialog');

      const closeDialog = () => {
        dialog.remove();
        dialog_bg.remove();
      }
      
      const confirmDelete = async () => {
        if(!playlist) return;
        const pl_id = playlist.id;

        // remove playlist

        if(window.location.pathname + window.location.search === playlist.dataset.href) document.getElementById("playlists-link").click();

        document.getElementById("menu-list").querySelector(`#${pl_id}-add`)?.remove();
        playlist.remove();

        // delete request
        const params = new URLSearchParams();
        params.set("userid", this.main.user?.user?.ID);
        params.set("playlist_key", pl_id);
    
        const url = `/wp-json/sdv/player/v1/delete-user-playlist?${params}`;
        closeDialog();
    
        const resp = await fetch(url, {method: 'POST'});
        const res = await resp.json();

        if(res === 'unauthorized') return;

        this.refreshPlaylistPage();
      }

      const cancel_btn = dialog.querySelector('#cancel-conf-btn');
      cancel_btn.addEventListener('click', closeDialog);
      dialog_bg.addEventListener('click', closeDialog);

      const del_btn = dialog.querySelector('#delete-conf-btn');
      del_btn.addEventListener('click', confirmDelete);
    }

    if(!menu.dataset.events) {
      menu.dataset.events = true;
      const editBtn = menu.querySelector('#edit-playlist-name');
      editBtn.addEventListener('click', () => editPlaylist(btn.parentElement));

      const deleteBtn = menu.querySelector('#delete-this-playlist');
      deleteBtn.addEventListener('click', () => deletePlaylist(btn.parentElement));

      const shareBtn = menu.querySelector('#share-this-playlist');
      shareBtn.addEventListener('click', () => this.share(window.location.origin + btn.parentElement.dataset.href, true));
    }

    const hideMenu = () => {
      menu.style.display = 'none';
      document.removeEventListener('click', hideMenu);
    };

    if(menu.style.display === 'unset'){ // hide
      menu.style.display = 'none';
      menu.classList.remove('stickout');
      //  console.log('hide');
      document.removeEventListener('click', hideMenu);
    } else { // show
      document.querySelectorAll('.mp-menu, .mp-dropmenu, .mp-removemenu')?.forEach(el => el.style.display = 'none');
      menu.style.display = 'unset';
      menu.classList.add('stickout');
      //  console.log('show');

      document.addEventListener('click', hideMenu);
      e?.stopPropagation();
    }

    // this.share(window.location.origin + btn.parentElement.dataset.href, true);
  }

  currentPodcast(){
    const index = this.state.index;
    const playlist = this.state.shuffle ? this.shuffledPlaylist : this.playlist;

    return playlist[index];
  }

  togglePlaylistMenu (e, forceHide = false) {
    const menuList = this.DOM.menuList;
    const menuBtn = this.DOM.menuBtn;

    if(forceHide || menuList.style.display === "block") {
      menuList.style.display = "none";
      menuBtn.classList.add("mp-btn");
      document.removeEventListener('click', this.togglePlaylistMenu);
    }
    else {
      document.querySelectorAll('.mp-menu, .mp-dropmenu, .mp-removemenu')?.forEach(el => el.style.display = 'none');
      menuList.style.display = "block";
      menuBtn.classList.remove("mp-btn");
      document.addEventListener('click', () => this.togglePlaylistMenu(e, true));
      e?.stopPropagation();
    }
  }

  async getUserPlaylists(){
    const params = new URLSearchParams();
    params.set("userid", this.main.user?.user?.ID);
    //  console.log(this.main.user?.user);

    const url = `/wp-json/sdv/player/v1/get-user-playlists?${params}`;

    const resp = await fetch(url);
    this.user_playlists = await resp.json();
  }

  async playPlaylist(id, ismodule = false) {
    if(!id && !ismodule) return;

    //  console.log('id, ismodule');
    //  console.log(id, ismodule);

    const params = new URLSearchParams();
    params.set("userid", this.main.user?.user?.ID);
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

  regUserPlaylistClick(){
    document.querySelectorAll('.player-page__nav-playlists span.mouseHover').forEach(pl => {
      pl.querySelector('input').addEventListener('click', (e) => e.stopPropagation());
      this.clickUserPlaylist(pl);
    });
  }

  clickUserPlaylist(playlist) {
    let clickCount = 0;

    const showPlaylist = (playlist) => {
      //  console.log('opening playlist page');

      window.history.pushState({'player_href': 'playlist'}, document.title, playlist.dataset.href);
      this.lastload = playlist_single.load;
      this.lastload();
    }

    playlist.addEventListener('mousedown', (e) => {
      if(['svg', 'path', 'ul', 'li'].includes(e.target.tagName.toLowerCase()) || e.target.id === 'share-icon'){
        //  console.log(e.target);
        return;
      }

      showPlaylist(playlist);
      // clickCount++;

      // if (("which" in e && e.which == 3) || ("button" in e && e.button == 2)) {
      //  console.log('right click');
      //   editPlaylist(playlist); // right-click
      //   clickCount = 0;
      // }
      // else if (clickCount === 1) {
      //   setTimeout(() => {
      //     if (clickCount === 1) showPlaylist(playlist); // single-click
      //     else if (clickCount === 2) editPlaylist(playlist); // double-click

      //     clickCount = 0;
      //   }, 300);
      // }
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
    const likeBtns = document.querySelectorAll('.module-like-btn');
    const menuBtns = document.querySelectorAll('.module-menu-btn');
    const menuRemoveBtns = document.querySelectorAll('.module-remove-menu-btn');
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
          params.set("userid", this.main.user?.user?.ID);
          params.set("id", parent.dataset.id || 0);
      
          const url = `/wp-json/sdv/player/v1/get-module?${params}`;
      
          const postsResp = await fetch(url);
          const module = (await postsResp.json());
          this.nextPlaylist = [module];
        }

        this.playPlaylist(parent.dataset.id, true);
      });
    })

    likeBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e?.stopPropagation();
        const parent = btn.parentElement;
        const liked = parent.dataset.liked === 'true';

        this.updateLikeButton({liked: !liked}, btn);

        if(this.currentPodcast().id == parent.dataset.id){
          this.currentPodcast().liked = !liked;
          this.updateLikeButton(this.currentPodcast());
        }

        parent.dataset.liked = await this.like(parent.dataset.id, liked);
      });
    })

    menuBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e?.stopPropagation();
        const parent = btn.parentElement;
        const currMenu = parent.querySelector(".mp-menu");

        const hideMenu = () => {
          const currMenu = parent.querySelector(".mp-menu")?.remove();
          if(currMenu) currMenu.remove();
          document.removeEventListener('click', hideMenu);
        };

        if(currMenu) {
          currMenu.remove();
          document.removeEventListener('click', hideMenu);

          return;
        }

        document.querySelectorAll('.mp-menu, .mp-dropmenu, .mp-removemenu')?.forEach(el => el.style.display = 'none');
        document.addEventListener('click', hideMenu);

        // duplicate menu list
        const newList = document.getElementById('menu-list').cloneNode(true);
        newList.id = '';
        newList.style.display = "block";

        // attach to menu btn
        btn.appendChild(newList);

        // attach events
        newList.addEventListener('click', (e) => this.addToPlaylist(e, parent.dataset.id));
      });
    })

    menuRemoveBtns.forEach(btn => {
      btn.addEventListener('click', e => {
        e?.stopPropagation();
        const module = btn.parentElement;
        const menu = module.querySelector('.mp-removemenu');

        const hideMenu = () => {
          menu.style.display = 'none';
          document.removeEventListener('click', hideMenu);
        };

        if (!menu.dataset.events){
          menu.dataset.events = true;

          const cancel_btn = menu.querySelector('#cancel-from-playlist');
          cancel_btn.addEventListener('click', e => {
            hideMenu()
            e?.stopPropagation();
          });

          const remove_btn = menu.querySelector('#remove-from-playlist');
          remove_btn.addEventListener('click', (e) => {
            hideMenu();
            const params = new URLSearchParams(window.location.search);

            const upid = params.get("upid");

            this.removeFromPlaylist(upid, module.dataset.id);
            e?.stopPropagation();
          });
        }
    
        if(menu.style.display === 'unset'){ // hide
          menu.style.display = 'none';
          menu.classList.remove('stickout');
          document.removeEventListener('click', hideMenu);
        } else { // show
          document.querySelectorAll('.mp-menu, .mp-dropmenu, .mp-removemenu')?.forEach(el => el.style.display = 'none');
          menu.style.display = 'unset';
          menu.classList.add('stickout');

          document.addEventListener('click', hideMenu);
        }
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

  async like(id, liked = false) {
    const index = this.state.index;
    let podcast;
    const params = new URLSearchParams();

    params.set("userid", this.main.user?.user?.ID);

    if(!id){
      podcast = this.playlist[index];
      id = podcast.id;
      liked = podcast.liked;
      podcast.liked = !podcast.liked;
      this.updateLikeButton(podcast);
    }

    params.set('podcast_id', id);
    params.set('remove', liked);

    const url = `/wp-json/sdv/player/v1/like-podcast?${params}`;

    await fetch(url, {method: 'POST'});

    return !liked;
  }

  share(link, embed) {
    // if(!link && this.isSinglePlaylist()) return;
    link = link || this.currentPodcast().link;
    let copy = link;

    if(embed){
      const params = new URLSearchParams();

      params.set('isEmbed', true);
      params.set('spId', this.main?.sponsor?.id ?? 0);
      params.set("cache", Math.random());

      link += link.at(-1) == '/' ? '?' : '&';
      link += `${params}`;

      copy = `<iframe src="${link}" height="812" width="375"></iframe>`;
    }
    
    // copy to clipboard
    if(navigator?.clipboard) navigator?.clipboard?.writeText(copy);
    // else console.log('copied: ' + link);

    const type = embed ? 'Iframe' : 'link';
    const shareMsg = this.main.acf?.share_message ?? `${type} copied to clipboard`;
    this.showSnackbar(shareMsg);
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

  updateLikeButton({liked}, btn) {
    const likeBtn = btn || this.DOM.likeBtn;

    if(liked){
      likeBtn.innerHTML = icons.heart_filled;
      likeBtn.classList.add("heart--filled");
    }
    else{
      likeBtn.innerHTML = icons.heart;
      likeBtn.classList.remove("heart--filled");
    }
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
    this.DOM.mediaPlayer.style.height = null;
    setTimeout(() => this.DOM.mediaPlayer.style.overflow = 'unset', 500);

    audioLib.load(podcast, this.playlist, this.state.index);

    this.DOM.mobile_image.src = podcast.img;

    this.DOM.banner_title.innerHTML = podcast.title;
    this.DOM.banner_byline.innerHTML = podcast.byline;

    this.DOM.title.innerHTML = podcast.title;
    this.DOM.byline.innerHTML = podcast.byline;
    this.updateLikeButton(podcast);
    if(this.embed) audioLib.play();
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
    const page_params = new URLSearchParams(window.location.search);

    const isEmbed = page_params.get('isEmbed') != null;

    if(!this?.main?.user && !isEmbed){
      return super.show();
    }

    this.timeout(1)
    window.history.replaceState({'player_href': this.playerPage}, document.title, window.location.href);

    this.modifyNav();
    
    // load the current loaded pages playlist
    if (this.playerPage === "browse") {
      this.lastload = browse.load;
    } else if (this.playerPage === "playlists") {
      this.lastload = playlist_page.load;
    } else if (this.playerPage === "liked-podcasts") {
      this.lastload = liked_podcasts.load;
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
