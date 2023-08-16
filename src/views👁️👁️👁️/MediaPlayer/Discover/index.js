import icons from "../../../js🧠🧠🧠/basic/icons🔰";
import discover_eta from 'bundle-text:./discover.eta'
import playlists_swiper_eta from 'bundle-text:./../Templates/Playlist/playlists.eta'
import modules_eta from 'bundle-text:./../Templates/Module/modules.eta'
import * as Eta from 'eta'
import { Swiper } from 'swiper'

let parent; // refers to `this` in the media player.js file

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    const html = Eta.render(discover_eta, {global});
    if(parent) parent.DOM.content.innerHTML = html;
    else return;

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    document.querySelectorAll("#discover-link").forEach((x) => x.classList.add("player-page-tab--active"));

    getPlaylists();
    getModules();
}

const getModules = async () => {
    const modulesCont = document.querySelector('.player-page__content-modules');
    const params = new URLSearchParams();

    params.set("userid", parent.main.user.user.ID);
    params.set("popular", true);

    parent.addFiltersToParams(params);

    modulesCont.innerHTML = parent.loading;

    const url = `/wp-json/sdv/player/v1/get-modules?${params}`;

    const postsResp = await fetch(url);
    const posts = await postsResp.json();
    parent.nextPlaylist = posts;

    const html = Eta.render(modules_eta, {posts, icons, formatDate: parent.formatDate, formatDuration: parent.formatDuration});
    modulesCont.innerHTML = html;
    parent.regModuleClick();
    parent.regModuleButtons();
}

const getPlaylists = async () => {
    const playlistsCont = document.querySelector('.player-page__content-playlists .swiper-wrapper');
    const params = new URLSearchParams();
    params.set("userid", parent.main.user.user.ID);
    
    // parent.addFiltersToParams(params);

    playlistsCont.innerHTML = parent.loading;

    const url = `/wp-json/sdv/player/v1/get-playlists?${params}`;

    const playlistsResp = await fetch(url);
    const playlists = await playlistsResp.json();

    const html = Eta.render(playlists_swiper_eta, {global: parent.main, playlists});
    playlistsCont.innerHTML = html;
    
    setupSwiper();

    parent.regPlaylistClick();
}

const setupSwiper = () => {
    document.querySelectorAll('.swiper-wrapper .player-playlist').forEach(x => x.classList.add('swiper-slide'));
    
    const isMobile = document.documentElement.classList.contains('touch');

    const spaceBetween = isMobile ? 24 : 0;

    parent.swiper = new Swiper ('.swiper', {
        slidesPerView: 3,
        spaceBetween,
    })
}

export default {init, load};
