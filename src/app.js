import './app🖌️.scss';
// //  console.log('%c 💀 CssKiller ','background-color:#111; font-weight:800; color:white; text-transform:uppercase;font-size:30px;');
(function(url) {
    // Create a new `Image` instance
    var image = new Image();
  
    image.onload = function() {
      // Inside here we already have the dimensions of the loaded image
      var style = [
        // Hacky way of forcing image's viewport using `font-size` and `line-height`
        'font-size: 1px;',
        'line-height: ' + 100 + 'px;',
  
        // Hacky way of forcing a middle/center anchor point for the image
        'padding: ' + 0 + 'px ' + 50 + 'px;',
  
        // Set image dimensions
        'background-size: ' + 100 + 'px ' + 100 + 'px;',
  
        // Set image URL
        'background-color:rgb(36,36,36);',
        'background-image: url('+ url +');'
       ].join(' ');
  
       // notice the space after %c
      // //  console.log('%c ', style);
    };
  
    // Actually loads the image
    image.src = url;
  })('https://csskiller.es/ses.png');
import './js🧠🧠🧠/constructor🫀.js';