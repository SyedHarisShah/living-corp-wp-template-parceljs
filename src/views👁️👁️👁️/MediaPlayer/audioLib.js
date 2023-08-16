import icons from "../../js🧠🧠🧠/basic/icons🔰";

let elemObj;
let podcast_id = 0;
let play_tracked = false;

const init = (domObject)=> {
    elemObj = domObject;
    loadPlayer();
}

const loadPlayer = ()=> {
    const player = elemObj.player;

    player.src = "https://file-examples.com/storage/fe863385e163e3b0f92dc53/2017/11/file_example_MP3_700KB.mp3";
    
    player.addEventListener("play", () => play(false));
    player.addEventListener("pause", () => play(false));
    player.addEventListener('timeupdate', () => updateTime());
    player.addEventListener('volumechange', () => updateVolume());
    player.addEventListener('durationchange', () => updateDuration());

    const volString = localStorage.getItem("volume") || 1;
    player.volume = parseFloat(volString);
}

// Toggles play/pause. if toggle is false icons are jsut updated
const play = (toggle = true) => {
    const playBtn = elemObj.playBtn;
    const player = elemObj.player;
  
    // toggle state
    if(toggle){
        if (player.paused) player.play();
        else player.pause();
    }

    // update icons
    if (player.paused) playBtn.innerHTML = icons.play;
    else playBtn.innerHTML = icons.pause;
};

const updateTime = () => {
    // Update curr time elem
    const timeElem = elemObj.currTime;
    const time = elemObj.player.currentTime;
    timeElem.innerHTML = formatDuration(time);

    // Update seekbar width 
    const progress = elemObj.seekProgress;
    const duration = elemObj.player.duration;
    const width = (time/duration) * 100;

    progress.style.width = `${width}%`;

    trackPlay();
}

const updateVolume = () => {
    // Update volume slider height 
    const progress = elemObj.volProgress;
    const volume = elemObj.player.volume;
    const height = volume * 100;

    progress.style.height = `${height}%`;
}

const updateDuration = () => {
    const timeElem = elemObj.endTime;
    const duration = elemObj.player.duration;
    timeElem.innerHTML = formatDuration(duration);
}

const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const seekOnBar = (e) => {
    const player = elemObj.player;
    const bar = elemObj.seekbar;
    const x = e.clientX - bar.offsetLeft;

    player.currentTime = player.duration * (x / bar.clientWidth);
}

const seekOnHandle = (percent) => {
    const player = elemObj.player;
    player.currentTime = player.duration * percent;
}

const volumeOnBar = (e) => {
    const player = elemObj.player;
    const bar = elemObj.volSlider;
    const rect = bar.getBoundingClientRect();
    const y = rect.bottom - e.clientY;

    player.volume = y / bar.clientHeight;

    localStorage.setItem("volume", player.volume)
}

const volumeOnHandle = (percent) => {
    const player = elemObj.player;
    player.volume = percent;
}

const load = ({src, id}, playlist, index) => {
    const player = elemObj.player;
    podcast_id = id;

    elemObj?.mediaPlayer?.classList.remove('hidden');
    play_tracked = false;

    if (playlist.length <= 1) elemObj?.mediaPlayer?.classList.add('single-playlist');
    else elemObj?.mediaPlayer?.classList.remove('single-playlist');

    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('index', index);
    player.src = src;
    player.load();
    updateVolume();
}

const trackPlay = async () => {
    if(play_tracked) return;

    const player = elemObj.player;

    if(player.currentTime >= 60.0 || player.ended){
        // console.log("play tracked", podcast_id);
        play_tracked = true;

        const params = new URLSearchParams();

        params.set('id', podcast_id);
        await fetch(`/wp-json/sdv/player/v1/track-play?${params}`);
    }
}

export default {init, play, load, seekOnBar, seekOnHandle, volumeOnBar, volumeOnHandle};
