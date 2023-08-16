import EventEmitter from 'events'


export default class extends EventEmitter {
  constructor ({  element }) {
    super()


    this.addEventListeners()
  }

  addEventListeners () {

  }

  removeEventListeners () {

  }
  async create () {
    await this.generate()

  }

  destroy () {
    this.removeEventListeners()
  }
}
