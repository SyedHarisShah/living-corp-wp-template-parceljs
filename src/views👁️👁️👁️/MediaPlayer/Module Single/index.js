import icons from "../../../js🧠🧠🧠/basic/icons🔰";
import module_single from 'bundle-text:./module_single.eta'
import * as Eta from 'eta'

let parent; // refers to `this` in the media player.js file

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    parent.DOM.content.innerHTML = parent.loading;

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    
    getModules();
}

const getModules = async () => {
    const params = new URLSearchParams();
    params.set("userid", parent?.main?.user?.user?.ID);
    params.set("id", parent.postid || 0);

    const url = `/wp-json/sdv/player/v1/get-module?${params}`;

    const postsResp = await fetch(url);
    const module = (await postsResp.json());
    parent.nextPlaylist = [module];

    const html = Eta.render(module_single, {global: parent.main, module, icons, formatDate: parent.formatDate, formatDuration: parent.formatDuration});
    if(parent) parent.DOM.content.innerHTML = html;
    else return;
    parent.regModuleFilters(module);
    parent.regModuleButtons();
    parent.regModuleClick();

    if (parent.embed) {
        document.querySelector('.module-play-btn')?.click();
        document.querySelector('.media-player')?.click();
    }
}

export default {init, load};
