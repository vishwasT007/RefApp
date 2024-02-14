import { Lightning, Router, Utils } from '@lightningjs/sdk'
import IconDynamicButton from '../ButtonsList/IconDynamicButton'
import App from '../../App'

export default class DetailsBtns extends Lightning.Component {
  static _template() {
    return {
      ScrollWrapper: {
        y: 680,
        h: 380,
        w: App.width,
        clipping: true,
        VerticalButtonList: {
          y: 1,
          x: 175,
          flex: { direction: 'column' }
        }
      }
    }
  }

  set data({ buttonData }) {
    this._isSidePanelActive = true
    this._index = 0
    this.buttonsData = buttonData
    this.tag('VerticalButtonList').children = this.buttonsData.map((button) => {
      return {
        type: IconDynamicButton,
        h: 46,
        textPadding: 30,
        label: button.label,
        iconImage: Utils.asset(`images/${button.iconImage}`),
        iconWithText: true,
        flexItem: { marginTop: 24, alignSelf: 'stretch', maxHeight: 100 },
        isVerticalBtn: true,
      }
    })
    this._refocus()
  }

  _inactive() {
    this.tag('VerticalButtonList').children = []
  }

  _getFocused() {
    return this.tag('VerticalButtonList').children[this._index]
  }

  _handleUp() {
    Router.focusWidget('ButtonsList')
  }

  _handleDown() { return }

  _handleRight() { return }

  _handleLeft() { return }

  _handleEnter() {
    Router.getActivePage()._handleBack()
  }

  _handleBack() {
    this._handleEnter()
  }

  _handleKey() { return }
}
