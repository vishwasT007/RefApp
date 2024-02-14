import { Language, Lightning, Router, Utils } from '@lightningjs/sdk'
import App from '../App.js'
import Meta from '../../metadata.json'
import Loader from '../helper/Loader'
import { colors, fontsizes } from '../Themes/theme.js'
import { getCategories } from '../Services/contentApis.js'
import { setCategories, categories } from '../helper/globalConstants.js'

export default class Splash extends Lightning.Component {
  static _template() {
    return {
      TopToBottomGradient: {
        w: App.width,
        h: App.height,
        rect: true,
        color: colors.background,
      },
      AlertText: {
        x: 1250,
        y: 700,
        text: {
          text: Language.translate("splash_footer"),
          fontFace: "Regular",
          fontSize: fontsizes.splashPageFooter,
          wordWrapWidth: 500,
          lineHeight: 40,
          maxLines: 2,
          textColor: colors.fontColor,
        },
      },
      Footer: {
        w: App.width,
        h: App.height * 0.13,
        color: colors.background,
        rect: true,
        y: App.height - App.height * 0.13,
        Copyright: {
          y: App.height * 0.13 * 0.5,
          x: 1000,
          mountX: 0.5,
          mountY: 0.5,
          text: {
            text: Language.translate("foot_copyright_def"),
            fontFace: "Regular",
            fontSize: fontsizes.splashPageFooter,
            textColor: colors.fontColor,
          },
        },
        Version: {
          countY: 0.5,
          x: 1700,
          y: App.height * 0.13 * 0.5,
          mountY: 0.5,
          text: {
            text: `VERSION ${Meta.version}`,
            fontFace: "Regular",
            fontSize: fontsizes.splashPageFooter,
            textColor: colors.fontColor,
          },
        },
      },
      Logo: {
        x: 960,
        y: 540,
        mount: 0.5,
        src: Utils.asset("images/menu_open.png"),
      },
      Loader: { alpha: 1, type: Loader },
    };
  }

  async _active() {
    const categoriesData = await getCategories()
    setCategories(await categoriesData)
    this.widgets.menu.data = categories
    this.widgets.iconmenu.data = categories
    setTimeout(() => {
      Router.navigate('home')
    }, 4000)
  }

}
