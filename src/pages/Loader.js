import { Lightning, Utils } from '@lightningjs/sdk'

export default class Loader extends Lightning.Component {
  static _template() {
    return {
      alpha: 0,
      zIndex: 9,
      Spinner: {
        mount: 0.5,
        x: 960,
        y: 540,
        src: Utils.asset('images/spinner.png'),
      },
    }
  }

  _init() {
    this._spin = this.tag('Spinner').animation({
      duration: 2,
      repeat: -1,
      actions: [{ p: 'rotation', v: { 0: 0, 1: Math.PI * 2 } }],
    })
  }

  _enable() {
    this._spin.start()
  }

  finish() {
    this.setSmooth('alpha', 0, { duration: 0.6 })
    setTimeout(() => this._spin.stop(), 400)
  }
}
