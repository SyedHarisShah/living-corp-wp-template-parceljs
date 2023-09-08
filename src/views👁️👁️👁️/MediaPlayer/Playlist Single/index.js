import icons from "../../../js🧠🧠🧠/basic/icons🔰";
import playlist_single from 'bundle-text:./playlist_single.eta'
import modules_eta from 'bundle-text:../Templates/Module/modules.eta'
import user_modules_eta from 'bundle-text:../Templates/Module/user_modules.eta'
import * as Eta from 'eta'

let parent; // refers to `this` in the media player.js file

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    const html = Eta.render(playlist_single, {global});
    if(parent) parent.DOM.content.innerHTML = html;
    else return;

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    const params = new URLSearchParams(window.location.search);
    
    if (params.get('upid')) await getModulesUser(params.get('upid'));
    else if (parent.postid) await getModules();
}

const getModules = async () => {
    const modulesCont = document.querySelector('.player-page__content-modules');
    const params = new URLSearchParams();

    params.set("userid", parent.main?.user?.user?.ID);
    params.set("id", parent.postid || 0);

    parent.addFiltersToParams(params);

    modulesCont.innerHTML = parent.loading;

    const url = `/wp-json/sdv/player/v1/get-playlist?${params}`;

    const postsResp = await fetch(url);
    const result = await postsResp.json();

    if(!result){
        modulesCont.innerHTML = '';
        document.getElementById("podcast-name").innerHTML = "Playlist Not Found";
        return;
    }

    const posts = result.modules;
    parent.nextPlaylist = posts;

    const html = Eta.render(modules_eta, {posts, icons, formatDate: parent.formatDate, formatDuration: parent.formatDuration});
    modulesCont.innerHTML = html;
    document.getElementById("podcast-name").innerHTML = result.post_title;
    parent.regModuleClick();
    parent.regModuleButtons();
}

const getModulesUser = async (upid) => {
    const modulesCont = document.querySelector('.player-page__content-modules');
    const params = new URLSearchParams();

    params.set("userid", parent.main?.user?.user?.ID);
    params.set("upid", upid || 0);

    parent.addFiltersToParams(params);

    modulesCont.innerHTML = parent.loading;

    const url = `/wp-json/sdv/player/v1/get-user-playlist?${params}`;

    const postsResp = await fetch(url);
    const result = await postsResp.json();

    if(!result){
        modulesCont.innerHTML = '';
        document.getElementById("podcast-name").innerHTML = "Playlist Not Found";
        return;
    }

    const posts = result.modules || [];
    parent.nextPlaylist = posts;

    const html = Eta.render(user_modules_eta, {posts, icons, formatDate: parent.formatDate, formatDuration: parent.formatDuration});
    modulesCont.innerHTML = html;
    document.getElementById("podcast-name").innerHTML = result.post_title;

    if (parent.embed) {
        document.querySelectorAll('.p-m').forEach((module) => {
            module.addEventListener('click', () => module.querySelector('.module-play-btn').click());
        });
    } else {
        parent.regModuleClick();
    }

    parent.regModuleButtons();
    // console.log('parent.nextPlaylist', parent.nextPlaylist);
}

export default {init, load};
