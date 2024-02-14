import { Lightning, Router, Storage } from '@lightningjs/sdk'
import { Grid } from '@lightningjs/ui'
import { colors } from '../../Themes/theme'
import Item from '../List/Item'
import App from '../../App'
import { gridStateInfo } from '../../helper/globalConstants'

export default class ViewMoreGrid extends Lightning.Component {
  static _template() {
    return {
      visible: true,
      ViewMore: {
        zIndex: 4,
        x: 135 + App.sideMargin,
        y: 580,
        Title: {
          color: colors.fontColor,
          text: {
            fontSize: 50,
            fontFace: 'Bold',
          }
        },
        Grid: {
          alpha: 1,
          y: 80,
          w: 1730,
          h: 420,
          clipping: true,
          direction: 'column',
          columns: 7,
          crossSpacing: 30,
          mainSpacing: 35,
          itemType: Item,
          type: Grid,
        },
      }
    }
  }

  _active() {
    this.tag('Grid').setSmooth('alpha', 1)
    this._refocus()
  }

  _init() {
    this.tag('Grid').clear()
    this._refocus()
  }

  set data(viewMoreData) {
    Router.getActivePage().widgets.loader.alpha = 0
    this.totalvideos = []
    this.keyword = viewMoreData.key
    const index = Storage.get(gridStateInfo) || 0
    this.totalCount = viewMoreData.total_count
    this.totalvideos.push(...viewMoreData.list)

    const children = this.totalvideos.map(item => {
      item.orientation = 2
      return { type: Item, item }
    })
    this.tag('Title').text.text = viewMoreData.title
    this.tag('Grid').clear()
    this.tag('Grid').add(children)
    this.tag('Grid').setIndex(index)
    Router.getActivePage().widgets.loader.alpha = 0
    this.tag('Grid').scroll = { after: 1 }
  }

  _getFocused() {
    Router.getActivePage().widgets.banneritem.item = this.totalvideos[this.tag('Grid').index]
    return this.tag('Grid')
  }

  _handleDown() {
    if (this.tag('Grid')._lines?.[this.tag('Grid')._lines.length - 1].includes(this.tag('Grid')._index))
      return
    this.tag('Grid').last()
  }

  _handleEnter() {
    this.selectedIndex = this.tag('Grid').index
    Storage.set(gridStateInfo, this.selectedIndex)
    this.currentItem = this.totalvideos[this.selectedIndex]
    Router.navigate(`details/${this.currentItem.content_id}`)
    Router.getActivePage().widgets.loader.alpha = 1
  }

  _handleLeft() {
    Router.focusWidget('Menu')
  }

  _handleBack() {
    if (Router.getActivePage().widgets.loader.alpha == 0) {
      Storage.remove(gridStateInfo)
      Router.getActivePage().widgets.loader.alpha = 1
      Router.back()
    }
  }

  _handleKey() { return }

  _handleUp() { return }

  _handleRight() {
    this.tag('Grid').next()
  }
}
