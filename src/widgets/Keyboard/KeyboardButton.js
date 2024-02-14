import { Lightning, Utils } from '@lightningjs/sdk'
import { colors, fontsizes } from '../../Themes/theme'

export default class KeyboardButton extends Lightning.Component {
  static _template() {
    return {
      Background: {
        zIndex: 4,
      },
      Content: {
        zIndex: 5,
      },
    }
  }

  set action(action) {
    this._action = action
  }

  get action() {
    return this._action
  }

  get c() {
    return this.key.c
  }

  set key(keyVal) {
    this._key = keyVal
    this.firstFocus = true
    if (this.active) {
      this._update()
    }
  }

  _update() {
    const key = this._key

    if (this._key.source) {
      this.content = {
        w: this._key.source == 'images/space.png' ? 126 : 54,
        h: 54,
        y: 32,
        x: this._key.source == 'images/space.png' ? 104 : this._key.source == 'images/backspace.png' ? 80 : 110,
        src: this._key.source ? Utils.asset(this._key.source) : '',
      }
    } else {
      this.content = {
        text: {
          text: key.c || '',
          fontFace: 'Regular',
          textAlign: 'center',
          textColor: colors.keyboardButtonColor,
          fontSize: fontsizes.keyboardButton,
        },
      }
      // setting firstfocus to false in the the first time
      if (this.key.c === 'a' && this.firstFocus) {
        this.firstFocus = false
      }
    }

    this.patch({
      Content: {
        w: this.w,
        h: this.h,
        mountX: 0.5,
        mountY: 0.35,
        x: this.w / 2,
        y: this.h / 2,
        ...this.content,
      },
    })
  }

  get key() {
    return this._key
  }

  _getFocused() {
    return this._focus()
  }

  _focus() {
    this.patch({
      Background: {
        texture: Lightning.Tools.getRoundRect(this.w - 3, this.h - 3, 0, 3, colors.focusBorderColor, true, colors.searchKeyFocusColor),
      },
    })
    const content = this._key.source
      ? {
          w: this._key.source == 'images/space.png' ? 126 : 54,
          h: 54,
          y: 32,
          x: this._key.source == 'images/space.png' ? 104 : this._key.source == 'images/backspace.png' ? 80 : 110,
          src:
            this._key.source === 'images/space.png'
              ? Utils.asset('images/spaceHighlight.png')
              : this._key.source == 'images/backspace.png'
              ? Utils.asset('images/backspaceHighlight.png')
              : Utils.asset('images/trashHighlight.png'),
        }
      : {
          text: {
            text: this._key.c || '',
            fontFace: 'Regular',
            textAlign: 'center',
            textColor: colors.fontColor,
            fontSize: fontsizes.keyboardButton,
          },
        }
    this.tag('Content').patch({
      w: this.w,
      h: this.h,
      mountX: 0.5,
      mountY: 0.35,
      x: this.w / 2,
      y: this.h / 2,
      ...content,
    })

    if (this._key.source) this.alignToCenter()
  }

  alignToCenter() {
    switch (this._key.source) {
      case 'images/space.png': {
        this.patch({
          Background: {
            y: 5,
            x: 27,
            texture: Lightning.Tools.getRoundRect(148, 70, 0, 3, colors.focusBorderColor, true, colors.searchKeyFocusColor),
          },
        })
        break
      }
      case 'images/backspace.png': {
        this.patch({
          Background: {
            y: 5,
            x: 38,
            texture: Lightning.Tools.getRoundRect(80, 70, 0, 3, colors.focusBorderColor, true, colors.searchKeyFocusColor),
          },
        })
        break
      }
      default: {
        this.patch({
          Background: {
            y: 5,
            x: 66,
            texture: Lightning.Tools.getRoundRect(80, 70, 0, 3, colors.focusBorderColor, true, colors.searchKeyFocusColor),
          },
        })
        break
      }
    }
  }

  _unfocus() {
    this._update()
    this.patch({
      Background: {
        texture: Lightning.Tools.getRoundRect(
          this.w - 3,
          this.h - 3,
          0,
          1,
          colors.searchKeyColor,
          true,
          colors.searchKeyColor
        ),
      },
      Content: {
        w: this.w,
        h: this.h,
        mountX: 0.5,
        mountY: 0.35,
        x: this.w / 2,
        y: this.h / 2,
        text: {
          textColor: colors.keyboardButtonColor,
        },
        ...this.content,
      },
    })
  }

  _firstActive() {
    this._update()
  }
}
