import { Lightning, Language, Router, Utils } from '@lightningjs/sdk'
import App from '../../App'
import { colors, fontsizes } from '../../Themes/theme'
import Button from '../ProfileButtons/Button'

export default class Popup extends Lightning.Component {
  static _template() {
    return {
      zIndex: 7,
      alpha: 0,
      signals: { closePopUp: 'closePopUp' },
      x: App.width * 0.5 - 550 * 0.5,
      y: App.height * 0.5 - 660 * 0.5,
      Blur: {
        color: colors.popupBlurColor,
        rect: true,
        w: App.width + (App.width * 0.5 - 250),
        h: App.height + (App.height * 0.5 - 175),
        x: -(App.width * 0.5 - 550 * 0.5),
        y: -(App.height * 0.5 - 660 * 0.5),
        zIndex: -1,
      },
      Background: {
        texture: Lightning.Tools.getRoundRect(550, 660, 1, 2, colors.focusBorderColor, true, colors.background),
      },
      AlertImg: {
        w: 120,
        h: 120,
        y: 260,
        x: 225,
        src: Utils.asset('images/tv-app-alert-icon.png'),
      },
      Line1: {
        y: 45,
        w: 700,
        x: 275,
        mountX: 0.5,
        zIndex: 1,
        text: {
          text: Language.translate('tv_alert'),
          fontFace: 'Bold',
          textColor: colors.fontColor,
          fontSize: fontsizes.popUpAlertText,
          textAlign: 'center',
          lineHeight: 35,
          wordWrap: true,
          maxLinesSuffix: '...',
        },
      },
      Line2: {
        y: 140,
        text: {
          text: Language.translate('exit_alert'),
          paddingLeft: 30,
          fontFace: 'Regular',
          textColor: colors.fontColor,
          fontSize: fontsizes.popUpAlertSubtext,
          textAlign: 'center',
          wordWrap: true,
          wordWrapWidth: 700,
          lineHeight: 40,
          maxLines: 3,
          maxLinesSuffix: '...'
        },
      },
      ButtonList: {},
    }
  }

  _init() {
    this.exitApp = false
  }

  _focus() {
    this.patch({ alpha: 1 })
  }

  _unfocus() {
    this.patch({ alpha: 0 })
  }

  showExitPopUp() {
    this._index = 0
    this.bData = [
      {
        h: 80,
        y: 460,
        x: 25,
        w: 500,
        radius: 40,
        title: Language.translate('alert_yes'),
        color: colors.fontColor,
        layout: 'border',
        buttonColor: colors.background,
      },
      {
        h: 80,
        y: 560,
        x: 25,
        w: 500,
        radius: 40,
        title: Language.translate('alert_no'),
        layout: 'border',
        color: colors.fontColor,
        buttonColor: colors.background,
      },
    ]

    this.tag('ButtonList').children = this.bData.map((button) => {
      return { type: Button, button }
    })
  }

  get exitKey() {
    return this.exitApp
  }

  _handleDown() {
    if (this._index == 0 && this.bData.length - 1 > this._index) this._index++
  }

  _handleUp() {
    if (this._index == 1) this._index--
  }

  _handleEnter() {
    this._index == 0 ? this.application.closeApp() : Router.focusPage()
    this.setSmooth('alpha', 0)
  }

  _getFocused() {
    return this.tag('ButtonList').children[this._index]
  }

  _handleRight() { return }

  _handleLeft() { return }

  _handleBack() { return }

  _handleKey() { return }
}
