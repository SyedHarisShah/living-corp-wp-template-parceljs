import icons from "../../../js🧠🧠🧠/basic/icons🔰";
import discover_eta from 'bundle-text:./discover.eta'
import playlists_swiper_eta from 'bundle-text:./../Templates/Playlist/playlists.eta'
import sponsor_playlists_swiper_eta from 'bundle-text:./../Templates/Playlist/sponsor-playlist.eta'
import modules_eta from 'bundle-text:./../Templates/Module/modules.eta'
import * as Eta from 'eta'
import { Swiper } from 'swiper'

let parent; // refers to `this` in the media player.js file

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    const spId = parent?.spId || 0;
    const html = Eta.render(discover_eta, {global});
    if(parent) parent.DOM.content.innerHTML = html;
    else return;

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    document.querySelectorAll("#discover-link").forEach((x) => x.classList.add("player-page-tab--active"));

    getPlaylists();
    getSponsorPlaylist(spId);
    getModules();
}

const getModules = async () => {
    const modulesCont = document.querySelector('.player-page__content-modules');
    const params = new URLSearchParams();

    params.set("userid", parent.main?.user?.user?.ID);
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
    params.set("userid", parent.main?.user?.user?.ID);
    
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

const getSponsorPlaylist = async (spId) => {
    const sponsorPlaylistsCont = document.querySelector('.sponsor-playlists');
    const params = new URLSearchParams();
    const email = parent?.main?.user ? parent?.main?.user?.user?.data?.user_email : parent?.email;
    params.set("email", email);
    // params.set("userid", parent.main?.user?.user?.ID);

    // sponsorPlaylistsCont.innerHTML = parent.loading;

    let url = `/wp-json/sdv/player/v1/get-sponsor-playlists?${params}`;

    if(spId) {
        params.set("spId", spId);
        url = `/wp-json/sdv/player/v1/get-sponsor-playlists-by-id?${params}`;
    }

    const sponsorPlaylistsResp = await fetch(url);
    const sponsors = await sponsorPlaylistsResp.json();

    const html = Eta.render(sponsor_playlists_swiper_eta, {global: parent.main, sponsors});
    sponsorPlaylistsCont.innerHTML = html;
    
    setupSwiper();

    parent.regPlaylistClick();
}

const setupSwiper = () => {
    document.querySelectorAll('.swiper-wrapper .player-playlist').forEach(x => x.classList.add('swiper-slide'));
    
    const isMobile = document.documentElement.classList.contains('touch');

    const spaceBetween = isMobile ? 24 : 0;

    parent.swiper = new Swiper ('.player-page__content-playlists ,player-page__content-playlists--swiper .swiper', {
        slidesPerView: 3,
        spaceBetween,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        }
    })
}

export default {init, load};
