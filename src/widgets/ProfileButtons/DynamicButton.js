import { Lightning, Storage } from '@lightningjs/sdk'
import { colors } from '../../Themes/theme'
export default class DynamicButton extends Lightning.Component {
  static _template() {
    return {
      h: (h) => h,
      w: (w) => w,
      Background: {
        rect: true,
        texture: Lightning.Tools.getRoundRect(300, 80, 8, 2, colors.focusBorderColor, true, colors.focusFillColor),
      },
      Label: {
        color: colors.dynamicBtnLabel,
        mountY: 0.5,
        text: {
          fontFace: 'Bold',
          fontSize: 26,
          textAlign: 'center',
          wordWrap: true,
          wordWrapWidth: 480,
          maxLines: 1,
          maxLinesSuffix: '...'
        },
      },
      UnderLine: {
        x: 40,
        y: 47,
        alpha: 0,
      },
    }
  }

  _init() {
    if (this.w && !isNaN(this.w)) {
      return
    }
    this.tag('Label').on('txLoaded', () => {
      this.tag('UnderLine').patch({
        texture: Lightning.Tools.getRoundRect(this.tag('Label').finalW, 2, 0, 0, colors.fontColor, true, colors.fontColor)
      })
      this.patch({
        w: this.tag('Label').finalW + this._textPadding * 2,
      })
      this.setButtonStyles()
    })
  }

  set action(action) {
    this._action = action
  }

  get action() {
    return this._action
  }

  set textPadding(padding) {
    this._textPadding = padding
  }

  set withoutTexture(bool) {
    this._withoutTexture = bool
  }

  set btnId(id) {
    this.default_id = id
  }

  set label(label) {
    this._label = label

    if (!this.dynamicWidth && this.w && !isNaN(this.w)) {
      this._textPadding = 0
      this.patch({
        w: this.w,
        Label: {
          w: this.w,
          text: {
            w: this.w,
          },
        },
      })
      this.setButtonStyles()
    }
    this.tag('Label').text.text = label
  }

  get label() {
    return this._label
  }

  set borderRadius(radius) {
    this._borderRadius = radius
  }

  set color(color) {
    this._color = color
    this.tag('Background').patch({
      texture: Lightning.Tools.getRoundRect(this.w, this.h, this._borderRadius, 2, colors.focusBorderColor, true, colors.focusBorderColor),
    })
  }

  get color() {
    return this._color
  }

  setButtonStyles() {
    if (this.hasFocus()) {
      this.onButtonFocus()
    } else {
      this.patch({
        Background: {
          texture: !this._withoutTexture
            ? Lightning.Tools.getRoundRect(this.w, this.h, this._borderRadius, 2, colors.fontColor, false)
            : undefined
        },
      })
    }
    this.patch({
      Label: {
        x: this._textPadding,
        y: this.h / 2 + 2,
      },
    })
  }

  _focus() {
    this.toggleFocus(true)
  }

  _unfocus() {
    this.toggleFocus(false)
  }

  updateBtn(){
    this.toggleFocus(false)
  }

  toggleFocus(focus) {
    if (focus) {
      this.onButtonFocus()
    } else {
      const selectedBtnId = Storage.get('selectedBtn') || 1
      selectedBtnId === this.default_id
      ? this.patch({
        Background: {
          texture: Lightning.Tools.getRoundRect(this.w, this.h, this._borderRadius, 2, colors.lightHighlight, true, colors.lightHighlight),
        },
      })
      : this.patch({
        Background: {
          texture: Lightning.Tools.getRoundRect(this.w, this.h, this._borderRadius, 2, colors.fontColor, false),
        },
      })
      if (this._withoutTexture)
        this.tag('Background').texture = undefined
    }
  }

  onButtonFocus() {
    this.patch({
      Background: {
        texture: !this._withoutTexture
          ? Lightning.Tools.getRoundRect(
            this.w,
            this.h,
            this._borderRadius,
            2,
            colors.focusBorderColor,
            true,
            colors.focusFillColor
          )
          : Lightning.Tools.getRoundRect(
            this.w,
            this.h,
            this._borderRadius,
            2,
            colors.focusBorderColor,
            false,
          )
      },
    })
  }

  static get width() {
    return this.w
  }

  static get height() {
    return this.h
  }
}
