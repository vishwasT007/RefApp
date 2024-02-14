import { Lightning } from '@lightningjs/sdk'

export default class ListComponent extends Lightning.components.ListComponent {
  _init() {
    this._roll = true
    this._rollMax = 1
  }

  set activeItem(item) {
    this._activeItem = item
    this._restorePosition = item.x
    this._setState('Expanded')
  }

  forceState(state) {
    this._setState(state)
  }
}
