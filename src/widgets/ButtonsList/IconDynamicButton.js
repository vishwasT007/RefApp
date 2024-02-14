import { Lightning, Router } from '@lightningjs/sdk'
import { colors, fontsizes } from '../../Themes/theme'

export default class IconDynamicButton extends Lightning.Component {
  static _template() {
    return {
      h: (h) => h,
      w: (w) => w,

      Background: {
        w: (w) => w,
        h: 62,
        rect: true,
        texture: Lightning.Tools.getRoundRect(150, 40, 0, 1, colors.fontColor, false),

        Label: {
          color: colors.iconDynamicBtnLabel,
          y: 40,
          x: 20,
          mountY: 0.7,
          text: {
            fontFace: 'Bold',
            fontSize: fontsizes.iconDynamicbuttonText,
            textAlign: 'center',
            wordWrap: true,
            wordWrapWidth: 1000,
            maxLines: 1,
            maxLinesSuffix: '...'
          },
        },
        Image: {
          w: 32,
          h: 28,
          x: 10,
          y: 40,
          mountX: 0.5,
          mountY: 0.9,
        },
      },
      IconImage: {
        w: 35,
        h: 35,
        x: 40,
        y: 40,
        mountX: 0.5,
        mountY: 0.9,
      },
    }
  }

  _init() {
    if (this.w && !isNaN(this.w)) {
      return
    }
    this.tag('Label').on('txLoaded', () => {
      if (this._isBtnVertical) {
        // vertical btnList
        this.tag('Image').x = 30
        this.tag('Image').mountY = 0.83
        this.tag('Label').x = this.tag('Image').finalW + 40
        this.tag('Label').y = 40
        this.tag('Image').y = 40

        this.tag('Label').on('txLoaded', () => {
          this.calculateWidth = this.tag('Label').finalW + 100

          this.tag('Background').patch({
            w: this.calculateWidth,
          })
        })
      } else {
        // only horizontal btnList

        if (this._btntype) {
          this.calculateWidth = this._iconImage
            ? this.tag('Label').finalW + this._textPadding * 2 + 40
            : this.tag('Label').finalW + this._textPadding + 10
        } else {
          this.calculateWidth = this.tag('Label').finalW + this._textPadding * 2
        }

        this.patch({
          w: this.calculateWidth,
        })
        // setting width to label and x pos image
        this.tag('Label').w = this.tag('Label').finalW
        this.tag('Image').x = this.tag('Label').finalW + 20 + 20 + 20
      }
      this.setButtonStyles()
    })
  }

  // using the below lifecycle event to solve the verticalBtn prob
  // that causes not updating of focus[i.e the rectangle border] when wishlist label is changed
  _active() {
    if (this._isBtnVertical) {
      // vertical btnList
      this.tag('Image').x = 30
      this.tag('Image').mountY = 0.83
      this.tag('Label').x = this.tag('Image').finalW + 40
      this.tag('Background').texture = undefined

      this.tag('Label').on('txLoaded', () => {
        this.calculateWidth = this.tag('Label').finalW + 100

        this.tag('Background').patch({
          w: this.calculateWidth,
          h: this.tag('Label').finalY + 22,
        })
      })
    }
  }

  set isVerticalBtn(val) {
    // either true or false
    this._isBtnVertical = val
  }

  set isHorizontalBtn(val) {
    this._isHorizontalBtn = val
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

  set iconWithText(btnType) {
    this._btntype = btnType
  }

  set iconImage(Img) {
    this._iconImage = Img
  }

  set pageBtns(type) {
    this._btnsPage = type
  }

  set iconCheck(type) {
    this._checkIconStatus = type
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
  }

  get color() {
    return this._color
  }

  setButtonStyles() {
    const width = Router.getActiveHash().includes('details') ||
      Router.getActiveHash().includes('series') ? 381 : 178
    !this._btntype
      ? this.patch({
        Background: {
          Image: {
            alpha: 0,
          },
        },
        Label: {
          x: this._textPadding,
          y: this.h / 2 + 2,
        },
      })
      : this.patch({
        Label: {
          x: this._textPadding + 40,
          y: this.h / 2 + 2,
        },
      })
    // Display Only Label without Image fn end

    // Display Image with Label start
    this.hasFocus()
      ? this.patch({
        Background: {
          texture: Lightning.Tools.getRoundRect(
            this.calculateWidth || width,
            40,
            2,
            2,
            colors.focusBorderColor,
            true,
            colors.focusFillColor
          ),
          Image: {
            color: colors.fontColor,
            src: this._iconImage,
          },
        },
        Label: {
          text: {
            textColor: colors.fontColor,
          },
        },
      })
      : this.patch({
        Background: {
          texture: this._isHorizontalBtn
            ? Lightning.Tools.getRoundRect(this.calculateWidth, 40, 2, 1, colors.fontColor, false)
            : undefined,
          Image: {
            color: colors.fontColor,
            src: this._iconImage,
          },
        },
        Label: {
          text: {
            textColor: colors.fontColor,
          },
        },
      })
  }

  _focus() {
    this.toggleFocus(true) // here we set focus into true.
  }

  _unfocus() {
    this.toggleFocus(false) // here we set focus as false.
  }

  toggleFocus(focus) {
    if (focus) {
      this.patch({
        Background: {
          texture: Lightning.Tools.getRoundRect(
            this.calculateWidth,
            40,
            2,
            2,
            colors.focusBorderColor,
            true,
            colors.focusFillColor
          ),
          Image: {
            color: colors.fontColor,
          },
        },
        Label: {
          text: {
            textColor: colors.fontColor,
          },
        },
      })
    } else {
      this.patch({
        Background: {
          texture: Lightning.Tools.getRoundRect(this.calculateWidth, 40, 2, 1, colors.fontColor, false),
          Image: {
            color: colors.fontColor,
          },
        },
        Label: {
          text: {
            textColor: colors.fontColor,
          },
        },
      })

      if (this._isBtnVertical && !this.isHorizontalBtn) {
        this.tag('Background').texture = undefined
      }
    }
  }
}
