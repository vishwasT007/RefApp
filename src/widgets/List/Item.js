import { Lightning, Utils, Img } from '@lightningjs/sdk'
import { contentImagesFolder, fallBackBanner, viewMoreImage } from '../../helper/globalConstants'
import { colors, fontsizes } from '../../Themes/theme'

export default class Item extends Lightning.Component {
  static _template() {
    return {
      w: Item.width,
      h: Item.height,
      Background: {
        alpha: 0,
        texture: Lightning.Tools.getRoundRect(Item.width, Item.height, 0, 3, colors.focusBorderColor, true, colors.focusFillColor),
      },
      LazyBackground: {
        w: (w) => w - 14,
        x: 12,
        y: 12,
        h: (h) => h - 14,
        rect: true,
        color: colors.focusBorderColor,
      },
      Poster: {
        zIndex: 3,
        w: (w) => w - 14,
        x: 12,
        y: 12,
        h: (h) => h - 14,
      },
      Title: {
        y: 210,
        x: 65,
        alpha: 0,
        text: {
          fontFace: 'Bold',
          lineHeight: 48,
          fontSize: fontsizes.viewMore,
          textColor: colors.itemTitle,
          maxLines: 1,
          wordWrapWidth: (w) => w - 30,
          textAlign: 'center',
        },
      },
      ViewAllImg: {
        alpha: 0,
        src: Utils.asset(viewMoreImage),
        x: 90,
        y: 120
      },
    }
  }


  set item(itemInfo) {
    this._item = itemInfo
    this.width = 215
    this.height = 322.5
    this.patch({
      w: this.width,
      h: this.height,
      Background: {
        alpha: 0,
        texture: Lightning.Tools.getRoundRect(
          this.width,
          this.height,
          0,
          0,
          colors.itemBackground,
          true,
          colors.itemBackground
        ),
      },
      LazyBackground: {
        w: (w) => w,
        x: 12,
        y: 12.4,
        h: (h) => h,
        rect: true,
        color: colors.seeAllCardColor,
      },
      Poster: {
        w: (w) => w,
        x: 12,
        y: 12.4,
        h: (h) => h,
      },
    })
    if (itemInfo.content_id == 'see-all') {
      return this.patch({
        Title: {
          alpha: 1,
          text: { text: itemInfo.title }
        },
        ViewAllImg: { alpha: 1 }
      })
    }
    this.patchPoster(itemInfo)
  }

  patchPoster(data) {
    const checkForPoster = data.poster_image || data.item.poster_image
    const src = checkForPoster
      ? Utils.asset(contentImagesFolder + checkForPoster)
      : Utils.asset(fallBackBanner)
    this.tag('Poster').texture = Img(src).original()
  }

  get item() {
    return this._item
  }

  _focus() {
    this.tag('Background').patch({
      alpha: 1,
      texture: Lightning.Tools.getRoundRect(
        this.width + 20,
        this.height + 20,
        0,
        3,
        colors.focusBorderColor,
        true,
        colors.focusFillColor
      ),
    })
    this.fireAncestors('$onItemFocus', { item: this._item })
  }

  _unfocus() {
    this.tag('Background').alpha = 0
  }

  static get width() {
    return 215
  }

  static get height() {
    return 322.5
  }
}
