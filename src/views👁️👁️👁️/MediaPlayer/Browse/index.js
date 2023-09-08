import icons from "../../../js🧠🧠🧠/basic/icons🔰";
import browse_eta from 'bundle-text:./browse.eta'
import modules_eta from 'bundle-text:../Templates/Module/modules.eta'
import * as Eta from 'eta'

let parent; // refers to `this` in the media player.js file
let tabLatest;
let tabPopular;

const init = (par_this) => {
    parent = par_this;
};

const load = async () => {
    const global = parent?.main;
    const html = Eta.render(browse_eta, {global});
    
    if(parent) parent.DOM.content.innerHTML = html;
    else return;

    tabLatest = document.getElementById("tab-latest");
    tabPopular = document.getElementById("tab-popular");

    document.querySelectorAll(".player-page-tab--active").forEach((x) => x.classList.remove("player-page-tab--active"));
    document.querySelectorAll("#browse-link").forEach((x) => x.classList.add("player-page-tab--active"));

    tabLatest.addEventListener('click', (e) => {
        if(tabLatest.classList.contains('player-browse-tab--active')) return;

        tabLatest.classList.add('player-browse-tab--active');
        tabPopular.classList.remove('player-browse-tab--active');
        
        getModules();
    });

    tabPopular.addEventListener('click', (e) => {
        if(tabPopular.classList.contains('player-browse-tab--active')) return;
       
        tabPopular.classList.add('player-browse-tab--active');
        tabLatest.classList.remove('player-browse-tab--active');
        
        getModules();
    });
    
    getModules();
}

const getModules = async () => {
    const modulesCont = document.querySelector('.player-page__content-modules');
    const params = new URLSearchParams();
    params.set("userid", parent.main?.user?.user?.ID);

    if(tabPopular.classList.contains('player-browse-tab--active')) params.set('popular', true);

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

export default {init, load};
