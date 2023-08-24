import icons from "../../../js🧠🧠🧠/basic/icons🔰";
import search_eta from 'bundle-text:./search.eta'
import modules_eta from 'bundle-text:../Templates/Module/modules.eta'
import * as Eta from 'eta'

let parent; // refers to `this` in the media player.js file

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    const html = Eta.render(search_eta, {global});
    if(parent) parent.DOM.content.innerHTML = html;
    else return;

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    const params = new URLSearchParams(window.location.search);
    parent.search_term = parent.search_term || params.get('term');
    parent.search_term_tax = parent.search_term_tax || params.get("tax");
    
   getModules();
}

const getModules = async () => {
    const modulesCont = document.querySelector('.player-page__content-modules');
    const params = new URLSearchParams();

    params.set("userid", parent.main.user.user.ID);
    params.set("term", parent.search_term);

    let tax = parent.search_term_tax;
    if (tax) params.set("tax", tax);

    parent.addFiltersToParams(params);

    modulesCont.innerHTML = parent.loading;

    const url = `/wp-json/sdv/player/v1/search-player?${params}`;

    const postsResp = await fetch(url);
    const posts = await postsResp.json();
    parent.nextPlaylist = posts;

    const html = Eta.render(modules_eta, {posts, icons, formatDate: parent.formatDate, formatDuration: parent.formatDuration});
    modulesCont.innerHTML = html;
    let text = `Results for "${parent.search_term}"`;
    if (tax) text = `${tax}: "${parent.search_term}"`;
    document.getElementById("search-term").innerHTML = text;
    parent.regModuleClick();
    parent.regModuleButtons();
}

export default {init, load};
