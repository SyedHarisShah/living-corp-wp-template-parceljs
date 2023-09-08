import icons from "../../../js🧠🧠🧠/basic/icons🔰";
import liked_podcasts_eta from 'bundle-text:./liked_podcasts.eta'
import modules_eta from 'bundle-text:../Templates/Module/modules.eta'
import * as Eta from 'eta'

let parent; // refers to `this` in the media player.js file

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    const html = Eta.render(liked_podcasts_eta, {global});
    if(parent) parent.DOM.content.innerHTML = html;
    else return;

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    document.querySelectorAll("#liked-podcasts-link").forEach((x) => x.classList.add("player-page-tab--active"));

    getModules();
}

const getModules = async () => {
    const modulesCont = document.querySelector('.player-page__content-modules');
    const params = new URLSearchParams();
    params.set("userid", parent.main?.user?.user?.ID);

    parent.addFiltersToParams(params);

    modulesCont.innerHTML = parent.loading;

    const url = `/wp-json/sdv/player/v1/get-liked-podcasts?${params}`;

    const postsResp = await fetch(url);
    const posts = await postsResp.json();
    parent.nextPlaylist = posts;

    const html = Eta.render(modules_eta, {posts, icons, formatDate: parent.formatDate, formatDuration: parent.formatDuration});
    modulesCont.innerHTML = html;
    parent.regModuleClick();
    parent.regModuleButtons();
}

export default {init, load};
