https://bbdo.de/
FUNCION NO

function No(t, e, i) {
return on.utils.interpolate(t, e, i)
}

Realmente lo que interesa es el EASE

this.index = this.element.getAttribute("data-animation-index") || i,
           this.transformPrefix = oo()("transform"),
           this.valueDesktop = parseInt(this.element.getAttribute("data-animation-speed"), 10) || 4,
           this.valueMobile = 2;
           const s = xn.isMobile() ? this.valueMobile : this.valueDesktop;
           this.scroll = {
               ease: .1,
               position: 0,
               current: 0,
               speed: this.index % 2 == 0 ? s : -s,
               target: 0,
               last: 0
           },
           _n()(this.elements.items, t=>{
               const e = En(t);
               t.extra = 0,
               t.width = e.width,
               t.offset = e.left,
               t.position = 0
           }
           ),
           this.length = this.elements.items.length,
           this.widthTotal = En(this.element).width
       }
       enable() {
           this.isEnabled = !0,
           this.update()
       }
       disable() {
           this.isEnabled = !1
       }
       onWheel(t) {
           if (!this.isEnabled)
               return;
           const e = .5 * Bo()(t).pixelY
             , i = xn.isMobile() ? this.valueMobile : this.valueDesktop;
           let s = this.index % 2 == 0 ? i : -i;
           e < 0 && (s *= -1),
           this.scroll.speed = s,
           this.scroll.target += s
       }
       transform(t, e) {
           t.style[this.transformPrefix] = `translate3d(${Math.floor(e)}px, 0, 0)`
       }
       update() {
           this.isEnabled && (this.scroll.target += this.scroll.speed,
           this.scroll.current = No(this.scroll.current, this.scroll.target, this.scroll.ease),
           this.scroll.current < this.scroll.last ? this.direction = "down" : this.direction = "up",
           
           this.scroll.last = this.scroll.current)
       }
       onResize() {
           _n()(this.elements.items, t=>{
               this.transform(t, 0);
               const e = En(t);
               t.extra = 0,
               t.width = e.width,
               t.offset = e.left,
               t.position = 0
           }
           ),
