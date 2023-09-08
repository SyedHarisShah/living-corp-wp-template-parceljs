import playlists_page_eta from 'bundle-text:./playlists.eta'
import playlists_grid_eta from 'bundle-text:./../Templates/Playlist/playlists.eta'
import * as Eta from 'eta'

let parent; // refers to `this` in the media player.js file

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    const html = Eta.render(playlists_page_eta, {global});
    if(parent) parent.DOM.content.innerHTML = html;
    else return;

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    document.querySelectorAll("#playlists-link").forEach((x) => x.classList.add("player-page-tab--active"));

    getPlaylists();
}

const getPlaylists = async () => {
    const playlistsCont = document.querySelector('.player-page__content-playlists');
    const params = new URLSearchParams();
    params.set("userid", parent.main?.user?.user?.ID);
    
    // parent.addFiltersToParams(params);

    playlistsCont.innerHTML = parent.loading;

    const url = `/wp-json/sdv/player/v1/get-user-playlists?${params}`;

    const playlistsResp = await fetch(url);
    const playlists = await playlistsResp.json();

    const html = Eta.render(playlists_grid_eta, {global: parent.main, playlists});
    playlistsCont.innerHTML = html;
    parent.regPlaylistClick();
}

export default {init, load};
