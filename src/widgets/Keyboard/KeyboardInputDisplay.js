import { Lightning, Utils } from '@lightningjs/sdk'
import { colors, fontsizes } from '../../Themes/theme'

export default class KeyboardInputDisplay extends Lightning.Component {
  static _template() {
    return {
      Display: {
        mountY: 1,
        Icon: {},
        Input: {
          x: 0,
          y: 70,
          text: {
            textAlign: 'center',
            fontSize: fontsizes.KeyboardInputDisplayDefaultInput,
            maxLines: 1,
            maxLinesSuffix: '...',
            lineHeight: 38,
            fontFace: 'Regular',
            textColor: colors.fontColor,
          },
        },
        UnderLine: {
          x: 0,
          alpha: 1,
          y: 850,
          texture: Lightning.Tools.getRoundRect(470, 60, 0, 3, colors.keyboardInputDisplayFill, false, colors.fontColor),
        },
      },
    }
  }

  set displayType(inputType) {
    if (inputType == 'search') {
      this.patch({
        Display: {
          Title: {},
          Icon: {
            x: 100,
            y: 92,
            w: 30,
            h: 30,
            alpha: 0,
            src: Utils.asset('images/iconSearch.png'),
          },
          SearchIcon: {
            x: 805,
            y: 10,
            alpha: 1,
            texture: Lightning.Tools.getRoundRect(71, 73, 0, 3, colors.fontColor, false),
            Img: {
              src: Utils.asset('images/search.png'),
              w: 35,
              h: 35,
              x: 20,
              y: 20,
            },
          },
          UnderLine: {
            x: 905,
            y: 10,
            texture: Lightning.Tools.getRoundRect(686, 73, 0, 3, colors.fontColor, false, colors.keyboardInputDisplayBorder),
          },
          Input: {
            x: 932,
            alpha: 1,
            y: 26,
            text: {
              textAlign: 'center',
              fontSize: fontsizes.keyboardInputText,
              maxLines: 1,
              maxLinesSuffix: '...',
              lineHeight: 32,
              textColor: colors.fontColor,
              fontFace: 'Regular',
            },
          },
        },
      })
    }
  }

  set input(input) {
    this._input = input
    this.tag('Input').patch({ alpha: 1, text: { text: input } })
  }

  set hideTitle(bool) {
    this.tag('Title').alpha = bool ? 0 : 1
  }

  get input() {
    return this._input
  }
}
