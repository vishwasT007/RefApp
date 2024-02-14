import { Lightning, Utils } from '@lightningjs/sdk'
import { InlineContent } from '@lightningjs/ui-components'
import { colors, fontsizes } from '../../Themes/theme.js'

export default class Button extends Lightning.Component {
  static _template() {
    return {
      texture: Lightning.Tools.getRoundRect(740, 63, 4, 2, colors.profileBtnItem, false, colors.profileBtnItem),
      Label: {
        type: InlineContent,
        content: []
      },
      Icon: {
        alpha: 0
      }
    }
  }

  set button(data) {
    this.buttonData = data
    this.highlight = this.buttonData.buttonColor ? this.buttonData.buttonColor : colors.profileBtnItem
    this.y = this.buttonData.y
    this.h = this.buttonData.h
    this.w = this.buttonData.w
    this.x = this.buttonData.x
    this.buttonData.radius ? (this.radius = this.buttonData.radius) : (this.radius = 8)

    this.patch({
      texture:
        this.buttonData.layout == 'border'
          ? Lightning.Tools.getRoundRect(this.w - 2, this.h - 2, 4, 2, colors.fontColor, false, colors.focusFillColor)
          : Lightning.Tools.getRoundRect(this.w - 2, this.h - 2, 4, 2, colors.fontColor, false, this.highlight),
      Label: {
        y: this.buttonData.h * 0.46,
        x: this.buttonData.buttonWithIcon ? this.buttonData.inputx : this.buttonData.w * 0.5,
        mount: 0.5,
        content: this.buttonData.title
          ? [
            {
              text: this.buttonData.title,
              style: {
                fontSize: this.buttonData.highlightOnlyBorder ? this.buttonData.fontSize : fontsizes.popupButtonsText,
                fontFace: this.buttonData.buttonWithIcon ? 'Regular' : 'Bold',
                textColor: colors.fontColor,
              }
            },
          ]
          : [
            {
              text: this.buttonData.title1,
              style: {
                fontSize: this.buttonData.highlightOnlyBorder ? this.buttonData.fontSize : fontsizes.popupButtonsText,
                fontFace: 'Regular',
                textColor: colors.fontColor,
              }
            },
            {
              text: this.buttonData.title2,
              style: {
                fontSize: this.buttonData.highlightOnlyBorder ? this.buttonData.fontSize : fontsizes.popupButtonsText,
                fontFace: 'Bold',
                textColor: colors.fontColor,
              }
            }
          ]
      },
      Icon: {
        x: this.buttonData.iconX,
        y: this.buttonData.iconY,
        w: this.buttonData.iconW,
        h: this.buttonData.iconH,
        alpha: this.buttonData.buttonWithIcon ? 1 : 0,
        src: Utils.asset('images/Angle_Right.png')
      }
    })
  }

  _focus() {
    this.highlight = colors.focusBorderColor
    this.texture = this.buttonData.highlightOnlyBorder
      ? Lightning.Tools.getRoundRect(this.w, this.h, 4, 2, this.highlight, false)
      : Lightning.Tools.getRoundRect(this.w, this.h, 4, 2, this.highlight, true, colors.focusFillColor)
  }

  _unfocus() {
    this.highlight = this.buttonData.buttonColor ? this.buttonData.buttonColor : colors.buttonUnfocusColor
    this.patch({
      texture:
        this.buttonData.layout == 'border'
          ? Lightning.Tools.getRoundRect(this.w - 2, this.h - 2, 4, 2, colors.fontColor, false)
          : Lightning.Tools.getRoundRect(this.w - 2, this.h - 2, 4, 2, colors.fontColor, false, this.highlight),
    })
  }
}
