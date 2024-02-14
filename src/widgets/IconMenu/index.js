import { Lightning, Router, Utils } from '@lightningjs/sdk'
import App from '../../App'
import { colors } from '../../Themes/theme'
import { scroll } from '../../helper/globalConstants'

export default class IconMenu extends Lightning.Component {
  static _template() {
    return {
      Logo: { zIndex: 7, x: 90, y: App.height * 0.13 * 0.5, mount: 0.5, src: Utils.asset('images/logo.png') },
      TransparentBg: {
        zIndex: 6,
        rect: true,
        w: 160,
        h: 200,
        x: 0,
        y: 0,
        color: colors.background,
      },
      TransparentBg2: {
        zIndex: 6,
        rect: true,
        w: 160,
        h: 400,
        x: 0,
        y: 910,
        color: colors.background,
      },
      MenuWrapper: {
        zIndex: 5,
        w: 160,
        h: App.height,
        color: colors.background,
        rect: true,
        clipping: true,

        Items: {
          x: 0,
          y: 280,
          h: App.height,
          flex: {
            direction: 'column',
          },
        },
      },
      Shadow: {
        zIndex: 4,
        color: colors.popupBlurColor,
        x: 102,
        y: -25,
        texture: Lightning.Tools.getShadowRect(40, 1080, 10, 16),
      },
    }
  }

  _init() {
    this.selectedPosition = 0
    this.focusItem = ''
  }

  _getFocused() {
    if (this.selectedPosition == -1 || this.selectedPosition == this._items.length) return
    return this.tag('Items').children[this.selectedPosition]
  }

  set data(data) {
    this._items = []

    if (this.tag('Items').children.length) this.tag('Items').children = []

    if (!Array.isArray(this._items) || (this._items && this._items.length === 0)) {
      this._items = []
    }
    this._items = data

    this._items = this._items.filter(function (navitem) {
      let emptyAfterFilter = false

      if (navitem.items?.length) {
        navitem.items = navitem.items.filter(function (item) {
          return item?.category_id !== undefined && item.category_id !== ''
        })
        emptyAfterFilter = navitem.items.length === 0
      }

      return navitem?.category_id !== undefined && navitem.category_id !== '' && !emptyAfterFilter
    })
    this.tag('Items').children = this._items.map((item) => {
      return { type: IconsItem, item, flexItem: { marginBottom: 30 } }
    })
    this._height = App.height + this.tag('Items').children.length * 82
    this.wrapperHeight = this._height
  }

  set wrapperHeight(height) {
    this.tag('MenuWrapper').patch({
      h: height,
    })
  }

  setIndex(index) {
    this.selectedPosition = index
  }

  _handleRight() {
    Router.focusPage()
  }

  _handleLeft() {
    Router.focusWidget('Menu')
  }

  set activeIndex(selectedPosition) {
    this.selectedPosition = selectedPosition
    this.removeIndicators()
    this.updateCategories(selectedPosition)
  }

  _handleDown() {
    this.setNext()
  }

  _handleUp() {
    this.setPrevious()
  }
  _handleKey() { return }

  setPrevious() {
    if (this.selectedPosition >= 1) {
      if (
        this.tag('Items').children[this.selectedPosition - 1] &&
        this.tag('Items').children[this.selectedPosition - 1].visible === false
      ) {
        this.setIndex(this.selectedPosition - 1)
      }

      this.setIndex(this.selectedPosition - 1)
      this.scroll('up')
    }
  }

  setNext() {
    if (this.selectedPosition === this._items.length - 1) {
      this.selectedPosition = this._items.length - 1
    } else if (this.selectedPosition < this._items.length) {
      this.selectedPosition++
      this.scroll('down')
    }
  }

  scroll() {
    this.tag('MenuWrapper').patch({
      smooth: {
        y: scroll,
      },
    })
  }

  removeIndicators() {
    if (this._items.length > 0) {
      const items = this.tag('Items').children
      for (const item of items) {
        item.patch({
          ImageHome: {
            color: colors.fontColor,
          },
        })
      }
    }
  }

  updateCategories(position) {
    this.tag('Items').children[position]?.patch({
      ImageHome: {
        color: colors.focusBorderColor,
      },
    })
  }
}
class IconsItem extends Lightning.Component {
  static _template() {
    return {
      h: 60,
      ImageHome: {
        w: 35,
        h: 35,
        x: 80,
        mountX: 0.5,
        y: 33,
        mountY: 0.5,
        alpha: 1,
      },
    }
  }

  set item(data) {
    this.tag('ImageHome').patch({
      src: Utils.asset(data.icon),
    })
  }
}
