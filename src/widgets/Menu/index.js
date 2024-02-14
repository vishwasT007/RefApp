import { Language, Lightning, Storage, Router, Utils } from '@lightningjs/sdk'
import App from '../../App'
import { colors, fontsizes } from '../../Themes/theme'
import { activeCategory, setScroll, stateInfo } from '../../helper/globalConstants'

export default class Menu extends Lightning.Component {
  static _template() {
    return {
      Logo: {
        zIndex: 9,
        x: 700,
        y: 800,
        mountY:0.5,
        src: Utils.asset("images/menu_open.png"),
      },
      TransparentBg: {
        zIndex: 8,
        rect: true,
        w: 360,
        h: 200,
        x: 0,
        y: 0,
        color: colors.background,
      },
      MenuWrapper: {
        zIndex: 6,
        w: 360,
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
        zIndex: 5,
        color: colors.menuShadowColor,
        x: 303,
        y: -50,
        texture: Lightning.Tools.getShadowRect(40, 1100, 10, 16),
      },
    }
  }

  _init() {
    this._index = 0
  }

  _getFocused() {
    return this.tag('Items').children[this._index]
  }

  _focus() {
    this.patch({
      alpha: 1,
    })
  }

  _unfocus() {
    this.patch({
      alpha: 0,
    })
  }

  set data(categoriesData) {
    this._items = []
    if (this.tag('Items').children.length) this.tag('Items').children = []

    if (!Array.isArray(this._items) || (this._items && this._items.length === 0)) {
      this._items = []
    }
    this._items = categoriesData || []
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
      return { type: MenuItem, item, flexItem: { marginBottom: 30 } }
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
    this._index = index
  }

  _handleRight() {
    Router.focusPage()
  }

  _handleEnter() {
    if (!Storage.get('mainCategory') || this._index != Storage.get(activeCategory)) {
      Storage.remove(stateInfo)
      this.selectedId = this._index
      Storage.set(activeCategory, this._index)
      switch (this._items[this._index].slug) {
        case 'home': {
          Router.navigate('home')
          break
        }
        case 'search': {
          Router.navigate('search')
          break
        }
        case 'profile': {
          Router.navigate('profile')
          break
        }
        case 'movies': {
          Router.navigate('category')
          break
        }
        default: break
      }
      Router.getActivePage().widgets.loader.alpha = 1
      this._refocus()
    } else {
      Router.focusPage()
    }
  }

  _handleDown() {
    this.setNext()
  }

  _handleUp() {
    this.setPrevious()
  }

  setPrevious() {
    if (this.tag('Items').children[this._index - 1] && this.tag('Items').children[this._index - 1].visible === false) {
      this.setIndex(this._index - 1)
    }
    if (this._index != 0) {
      this.setIndex(this._index - 1)
    }
    this.scroll('up')
    Router.getActivePage().widgets.iconmenu.scroll()
  }

  setNext() {
    if (this._index < this._items.length - 1) {
      this._index++
      this.scroll('down')
      Router.getActivePage().widgets.iconmenu.scroll()
    }
  }

  scroll(dir) {
    if (this._items.length > 6) {
      if (this._index > 5 || (this._index === 5 && dir === 'up')) {
        const i = this._index - 5
        this.tag('MenuWrapper').patch({
          smooth: {
            y: -(i * 83),
          },
        })
        setScroll(-(i * 83))
      }
    }
  }

  scrollToSpecificItem() {
    if (this._index == this._items.length) {
      Router.getActivePage().widgets.iconmenu.scroll()
      return
    } // this is for signIn/profile menuItem

    if (this._items.length > 6) {
      if (this._index > 5) {
        const i = this._index - 5
        this.tag('MenuWrapper').patch({
          smooth: {
            y: -(i * 83)
          }
        })
        setScroll(-(i * 83))
      } else {
        //settingToZero
        this.tag('MenuWrapper').patch({
          smooth: { y: 0 }
        })
        setScroll(0)
      }
    }
    Router.getActivePage().widgets.iconmenu.scroll()
  }

  removeActiveindex() {
    const items = this.tag('Items').children
    for (const item of items) {
      item.patch({
        Focus: {
          texture: Lightning.Tools.getRoundRect(390, 60, 15, 0, colors.focusBorderColor, false),
        },
        Title: {
          ImageHome: {
            color: colors.fontColor,
          },
        },
      })
    }

  }

  updateIndex(position) {
    this.tag('Items').children[position].patch({
      Focus: {
        texture: Lightning.Tools.getRoundRect(390, 60, 1, 3, colors.focusBorderColor, true, colors.focusFillColor),
      },
      Title: {
        ImageHome: {
          color: colors.focusBorderColor,
        },
      },
    })
  }

  set activeIndex(index) {
    this._index = index
    this.scrollToSpecificItem()
    this.removeActiveindex()
    for (const _item of this.tag('Items').children) {
      this.updateIndex(this._index)
    }
    this._refocus()
  }

  _handleLeft() { return }

  _handleKey() { return }

  _handleBack() {
    Router.getActivePage().widgets.popup.prompt = {
      action: 'exit',
      h: 660,
      w: 550,
      bh: 660,
      text: Language.translate('exit_alert'),
      button: {
        ok: Language.translate('alert_yes'),
        no: Language.translate('alert_no'),
      },
    }
    Router.focusWidget('Popup')
  }
}
class MenuItem extends Lightning.Component {
  static _template() {
    return {
      h: 60,
      Focus: {
        texture: Lightning.Tools.getRoundRect(360, 60, 0, 0, colors.menuItemFocusColor, false),
        h: 60,
        w: 360,
        y: 0,
        x: 0,
      },
      ImageHome: {
        x: 40,
        y: 10,
        paddingLeft: 20,
        verticalAlign: 'middle',
        alpha: 1,
      },
      Label: {
        y: 13,
        text: {
          fontFace: 'Regular',
          fontSize: fontsizes.menuItemText,
          textColor: colors.fontColor,
          textAlign: 'center',
          verticalAlign: 'middle',
          paddingLeft: 120,
          wordWrapWidth: 200,
          maxLines: 1,
          maxLinesSuffix: '...',
        },
      },
    }
  }

  set item(label) {
    this.patch({
      ImageHome: {
        w: label.slug == 'movies' ? 34 : 36,
        h: label.slug == 'movies' ? 34 : 36,
        src: Utils.asset(label.icon)
      },
      Label: {
        text: { text: label.title }
      }
    })
  }

  _focus() {
    this.tag('Focus').patch({
      texture: Lightning.Tools.getRoundRect(360, 60, 1, 3, colors.focusBorderColor, true, colors.focusFillColor),
    })
  }

  _unfocus() {
    this.tag('Focus').patch({
      texture: Lightning.Tools.getRoundRect(325, 60, 0, 0, colors.menuItemFocusColor, false),
    })
  }
}

