function browserCheck(){
 
  var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 || window.innerWidth < 1181;
  


  if(!isMobile){
    var devicec = 'desktop'
    document.documentElement.classList.add("smooth")
  }
  else{
    var  devicec = 'mobile'
    document.documentElement.classList.add("touch")
    document.documentElement.classList.add(devicec)
  }
  

  //No memoria scroll
  if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual'
  }

  return {
    'device':devicec,
    'isTouch':isMobile
  }
}
export default { browserCheck };
