import { Lightning, Router } from '@lightningjs/sdk'
import IconDynamicButton from './IconDynamicButton'

export default class ButtonsList extends Lightning.Component {
  static _template() {
    return {
      signals: { focusSuggestions: '_focusSuggestions' },
      Wrapper: {
        ButtonList: {
          x: 176,
          y: 600,
          h: 56,
          flex: { direction: 'row' },
        },
      },
    }
  }

  set data(inputData) {
    this._index = 0
    this.buttonsData = inputData[0]
    this._item = inputData[1]
    this.tag('ButtonList').children = this.buttonsData.map((button) => {
      return {
        type: IconDynamicButton,
        h: 60,
        textPadding: 30,
        label: button.text,
        iconWithText: true,
        iconImage: button.Icon,
        flexItem: { marginRight: 30, maxHeight: 100 },
        isHorizontalBtn: true,
      }
    })
  }

  _inactive() {
    this.tag('ButtonList').children = []
  }

  _handleLeft() {
    if (this._index > 0) {
      this._index--
    }
  }

  _handleRight() {
    if (this._index < this.buttonsData.length - 1) {
      this._index++
    }
  }

  _handleEnter() {
    Router.navigate('player')
    Router.getActivePage().widgets.loader.alpha = 1
  }

  _handleDown() {
    Router.getActivePage().widgets.detailsbtns.index = 0
    Router.focusWidget('DetailsBtns')
  }

  _handleUp() { return }

  _getFocused() {
    return this.tag('ButtonList').children[this._index]
  }

  _handleBack() {
    Router.getActivePage()._handleBack()
  }
}
