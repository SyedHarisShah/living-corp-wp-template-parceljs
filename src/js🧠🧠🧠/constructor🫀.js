

import browser from './basic/browser.js'
import icons from './basic/icons🔰.js'


import App from './basic/main🐙.js'
import FontFaceObserver from 'fontfaceobserver'
// import Login from '../views👁️👁️👁️/Login🥸/index.js'

const global = browser.browserCheck()
global.icons = icons

// //  console.log(navigator.userAgentData.mobile)

// //  console.log(process.env.APP_ENV)
if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual'
}

document.documentElement.style.setProperty("--app-height", window.innerHeight+"px")

async function getuser(){
  if(document.body.dataset.nonce){
    // const usertest = await fetch(document.body.dataset.js+'/wp-json/wp/v2/users/me',{
    const usertest = await fetch(document.body.dataset.js+'/wp-json/csskiller/v1/getuser',{
      method: 'post',
      headers : {
        'Content-Type': 'application/json',
        'X-WP-Nonce': document.body.dataset.nonce // here you used the wrong name
        
      },
      // credentials: 'same-origin',
      
    })
    const userdata = await usertest.json()
    // //  console.log(userdata)
    document.body.dataset.user=userdata.user.id
    document.documentElement.classList.add('logged')
    return userdata
  }
  else{
    // //  console.log('No dataset nonce');
  }
}

async function login(){
    let formdata = new FormData()
    formdata.set('username','usertest')
    formdata.set('password',encodeURIComponent('c'))
    const logtest = await fetch(document.body.dataset.js+'/wp-json/csskiller/v1/login',{
      
      method: 'post',
      body: formdata
    })
    const datalog = await logtest.json()
    // //  console.log(datalog)
    document.body.dataset.nonce=datalog.nonce
    document.body.dataset.user=datalog.user.ID
    document.documentElement.classList.add('logged')
    return datalog
    
}

async function start(main) {
  // //  console.log(document.body.dataset.js+'/wp-json/csskiller/v1/options')
  
  
	const response = await fetch(document.body.dataset.js+'/wp-json/csskiller/v1/options')
	const data = await response.json()
  global.user = null
  if(process.env.APP_ENV=='local' && document.documentElement.classList.contains('logme')){
    global.user = await login()
  }
  else{
    global.user =  await getuser()
  }
  // await 
  global.acf = data
  // //  console.log(main)
	return global
}

start(global).then(data => {
	
  Promise.all([
		new FontFaceObserver('roboto', {weight: 400}).load(),
		new FontFaceObserver('bureau', {weight: 700}).load(),
		new FontFaceObserver('bureau', {weight: 500}).load(),
		new FontFaceObserver('bureau', {weight: 400}).load(),
		new FontFaceObserver('bureau', {weight: 500}).load(),
		new FontFaceObserver('Berling').load(),
		new FontFaceObserver('Berling serif').load()
	]).then(() => {
    new App(data)
	})

})

