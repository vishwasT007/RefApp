import { Lightning, Utils, Router } from '@lightningjs/sdk'
import App from '../../App.js'
import { imagesFolder } from '../../helper/globalConstants.js'
import { colors, fontsizes } from '../../Themes/theme.js'

export default class EmptyPage extends Lightning.Component {
  static _template() {
    return {
      zIndex: 3,
      alpha: 1,
      Background: {
        w: App.width,
        h: App.height,
        Image: {
          x: 0,
          w: App.width,
          h: App.height,
          y: 0,
          filter: { blur: 5 },
          shader: { type: Lightning.shaders.RoundedRectangle, radius: 16 }
        },
        TopToBottomGradient: {
          x: 0,
          y: 0,
          w: App.width,
          h: App.height,
          rect: true,
          color: colors.background
        },
        WishlistIcon: {
          w: 100,
          h: 100,
          x: 1920 / 2,
          y: 1080 / 2,
          mountX: 0.5,
          mountY: 0.5
        },
        Label: {
          w: App.width,
          h: App.height,
          x: 965,
          y: 1080 / 2 + 70,
          mountX: 0.5,
          alpha: 1,
          text: {
            fontFace: 'Bold',
            fontSize: fontsizes.emptyPageText,
            fontWeight: 400,
            textColor: colors.fontColor,
            textAlign: 'center'
          }
        }
      }
    }
  }

  _focus() {
    this.patch({ alpha: 1 })
  }

  _handleLeft() {
    return Router.focusWidget('Menu')
  }

  set data(data) {
    if (data.status) {
      this.tag('Background').patch({
        WishlistIcon: {
          src: Utils.asset(imagesFolder + data.Image)
        },
        Label: {
          text: {
            text: data.Message
          }
        }
      })
    }
  }

  _handleBack() {
    Router.back()
  }
}
