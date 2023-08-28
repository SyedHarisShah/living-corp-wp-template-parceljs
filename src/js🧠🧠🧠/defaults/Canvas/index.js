import { Plane, Camera, Renderer, Mesh, Program, Transform, Vec2, Vec4 } from 'ogl'
import {gsap,Power2} from 'gsap'
export default class {
  constructor ({ url }) {
    this.url = url

    this.renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, 2)
    })

    this.gl = this.renderer.gl
    this.gl.clearColor(0, 0, 0, 1)

    
    document.querySelector('#app').appendChild(this.gl.canvas)
    
    this.time = {x:0.5,y:0.5}
    this.tl = gsap.timeline()

    //mouse
    this.mouse = new Vec2(-1)
    this.velocity = new Vec2()
    this.lastTime
    this.lastMouse = new Vec2()
    this.speed =0
    this.aspect=1

    this.createCamera()
    this.createScene()
    this.onResize()
    this.createGeometries()



  }

  createCamera () {
    this.camera = new Camera(this.gl)
    // this.camera.fov = 45
    this.camera.position.z = 5

  }

  createScene () {
    this.scene = new Transform()
  }

  createGeometries () {


    const geometry = new Plane(this.gl,{
      width:2,
      height:2
    })
    const program = new Program(this.gl, {
      vertex: `
          attribute vec2 uv;
          attribute vec2 position;

          varying vec2 vUv;

          void main() {
              vUv = uv;
              gl_Position = vec4(position, 0., 1);
          }
      `,
      fragment: `
          precision highp float;
					precision highp int;


          uniform float uTimeX;
          uniform float uTimeY;
          uniform float uTime;
          uniform vec2 uRes;
          uniform float uProgress;
          uniform float uColor;
          uniform float uSoft;
          varying vec2 vUv;

          float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
          float noise(vec2 x) {
            vec2 i = floor(x);
            vec2 f = fract(x);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }
          float fbm (in vec2 p) {

            float value = 0.0;
            float freq = 1.0;
            float amp = 0.5*uProgress;    
        
            for (int i = 0; i < 14; i++) {
                value += amp * (noise((p - vec2(3.0)) * freq));
                freq *= 1.9;
                amp *= uSoft;
                //el amp en 0.5 suaviza
                //el amp en 0.6 estridente
            }
            return value;
        }
        
        float pattern(in vec2 p) {
            vec2 offset = vec2(-0.5);
        
            // vec2 aPos = vec2(sin(uTimeX * 0.005), sin(uTimeY * 0.01)) * 6.;
            vec2 aPos = vec2(uTimeX * 0.005, uTimeY * 0.01) * 6.;
            vec2 aScale = vec2(3.0);
            // vec2 aScale = vec2(1.*uTimeX*uTimeY);
            float a = fbm(p * aScale + aPos);
        
            // vec2 bPos = vec2(sin(uTime + * 0.0006), sin(uTime * 0.0006)) * 1.4;

            vec2 bPos = vec2(uTime * 0.0003, uTime * 0.0003);
            vec2 bScale = vec2(0.6);
            float b = fbm((p + a) * bScale + bPos);
        
            // vec2 cPos = vec2(-0.6, -0.5) + vec2(sin(-uTime * 0.0006), sin(uTime * 0.0006)) * 0.9;
            vec2 cPos =vec2(sin(-uTime * 0.0006), sin(uTime * 0.0006));
            
            vec2 cScale = vec2(2.6);
            float c = fbm((p + b) * cScale + cPos);
            return c;
        }
        
        vec3 palette(in float t) {
            vec3 a = vec3(0.5*uColor, 0.5*uColor, 0.5*uColor);
            vec3 b = vec3(0.45*uColor, 0.45*uColor, 0.45*uColor);
            vec3 c = vec3(0.8*uColor ,0.8*uColor, 0.8*uColor);
            vec3 d = vec3(0.1*uColor, 0.1*uColor, 0.1*uColor);
            return a + b * cos(6.28318 * (c * t + d));
        }
          void main() {
              
              vec2 p = gl_FragCoord.xy / uRes.xy;
              p.x *= uRes.x / uRes.y;
              float value = pow(pattern(p), 0.6); //antes era 2
              vec3 color = palette(value);
              gl_FragColor = vec4(color.r*uProgress,color.g*uProgress,color.b*uProgress, uProgress);


          }
        //   void main() {
              
        //     gl_FragColor = vec4(0.,0.,1.0, 1.0);
        // }
      `,
      uniforms: {
        uTimeX: {value: 0},
        uTimeY: {value: 0},
        uTime: {value: 0},
        uRes: {value:new Vec2(window.innerWidth,window.innerHeight)},
        uProgress: {value:0},
        uColor: {value:1},
        uSoft: {value:0},
      },
    })
    

    this.bg = new Mesh(this.gl, { geometry, program })
    this.bg.setParent(this.scene);
    // //  console.log(this.bg)
    this.tl.to(this.bg.program.uniforms.uProgress,{value:1,duration:3,ease:Power2.easeInOut},1)
    //this.tl.to(this.bg.program.uniforms.uColor,{value:1,duration:3,ease:Power2.easeInOut},1)
    this.tl.to(this.bg.program.uniforms.uSoft,{value:.5,duration:1,ease:Power2.easeInOut},1)
  }

  /**
   * Change.
   */
  onChange (url) {

  }

  /**
   * Resize.
   */
  onResize () {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth
    }
    this.aspect = this.screen.width/this.screen.height
    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height,
      width
    }

    const values = {
      screen: this.screen,
      viewport: this.viewport
    }
    
    this.scale = this.screen.height / 1500

    if(this.bg){
      // //  console.log('res')
      // this.bg.scale.y = this.viewport.height * (this.screen.height * this.scale) / this.screen.height
      // //  console.log(this.bg.scale.x)
      // this.bg.scale.x = this.viewport.width * (this.screen.width * this.scale) / this.screen.width
      // //  console.log(this.bg.scale.x)
    }
  }

  onTouchDown (event) {

  }

  onTouchMove (event) {
    // //  console.log(event.offsetX - this.screen.width/2)
    // this.time.x += Math.abs(( event.clientX - this.screen.width/2)*.003)
    // this.time.y += Math.abs(( event.clientY - this.screen.height/2)*.003)

    const positionX = event.x - this.screen.width;
    const positionY = event.y - this.screen.height;

    // Get mouse value in 0 to 1 range, with y flipped
    this.mouse.set(
      positionX / this.renderer.width,
      1.0 - positionY / this.renderer.height
    );

    // Calculate velocity
    if (!this.lastTime) {
      // First frame
      this.lastTime = performance.now();
      this.lastMouse.set(positionX, positionY);
    }

    const deltaX = positionX - this.lastMouse.x;
    const deltaY = positionY - this.lastMouse.y;

    this.lastMouse.set(positionX, positionY);

    let time = performance.now();

    // Avoid dividing by 0
    let delta = Math.max(10.4, time - this.lastTime);
    this.lastTime = time;
    this.velocity.x = deltaX / delta;
    this.velocity.y = deltaY / delta;
    // Flag update to prevent hanging velocity values when not moving
    // //  console.log(this.velocity.x)
  }

  onTouchUp (event) {

  }
  onWheel(event){
    this.speed += event.deltaY*.005
  }
  /**
   * Update.
   */
  update (application) {
    if (!application) return
    // this.bg.program.uniforms.uTimeX.value += this.speed-1
    if(this.bg.program.uniforms.uTimeX.value < 0 ){
      // this.bg.program.uniforms.uTimeX.value = 0
    }
    // this.speed *=0.9
    // //  console.log(this.speed)
    // this.velocity.needsUpdate = false
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
    // this.time+= 1;
    // this.bg.program.uniforms.uTimeX.value += this.velocity.x;
    // this.bg.program.uniforms.uTimeY.value += this.velocity.y;


    // this.bg.program.uniforms.uTime.value += .022
    this.bg.program.uniforms.uTime.value += 1
    // //  console.log((Math.sin(this.bg.program.uniforms.uTime.value** 0.0006)));
    // //  console.log(Math.sin(-this.bg.program.uniforms.uTime.value * 0.01))

  }
}
