import { Lightning, Router, Language, Storage } from '@lightningjs/sdk'
import { Grid } from '@lightningjs/ui'
import App from '../../App.js'
import { searchVideo } from '../../Services/contentApis.js'
import { colors } from '../../Themes/theme.js'
import Item from '../List/Item.js'

export default class SearchResults extends Lightning.Component {
  static _template() {
    return {
      w: App.width,
      h: 400,
      x: 550,
      y: 160,
      Header: {
        x: 355,
        y: 40,
        text: {
          fontFace: 'Regular',
          fontSize: 26,
          textColor: colors.fontColor,
          maxLines: 1,
        },
      },
      SecondHeader: {
        x: 255,
        y: 70,
        text: {
          fontFace: 'Regular',
          fontSize: 26,
          textColor: colors.focusBorderColor,
          maxLines: 1,
        },
      },
      visible: true,
      Grid: {
        alpha: 1,
        x: 340,
        y: 90,
        w: 1120,
        h: App.height - 210,
        clipping: true,
        direction: 'column',
        columns: 4,
        crossSpacing: 30,
        mainSpacing: 25,
        itemType: Item,
        type: Grid,
        requestThreshold: 3,
        signals: { onRequestItems: true },
      },
    }
  }
  _active() {
    this.tag('Grid').setSmooth('alpha', 1)
    this.index = 0
  }
  _init() {
    this.tag('Grid').clear()
    this.index = 0
    this.total_count = null
  }

  set data(searchResults) {
    Router.getActivePage().widgets.loader.alpha = 0
    this.values = searchResults
    const index = 0
    this.searchContentslength = searchResults.res[0]?.total
    this.totalvideos = searchResults.res[0].list
    const children = this.totalvideos.map((item) => {
      item.x = 1
      item.y = 1
      item.w = 320
      item.h = 180
      item.orientation = 1
      return { type: Item, item }
    })
    this.tag('Grid').clear()
    this.tag('Grid').add(children)
    const stateStorage = Storage.get('stateInfo')
    if (stateStorage) {
      this.stateInfo = JSON.parse(stateStorage)
      this._index = this.stateInfo.card ? this.stateInfo.card : 0
      this.tag('Grid').setIndex(this._index)
    } else {
        this.tag('Grid').setIndex(index)
    }
    this.tag('Header').patch({
      text: {
        text:
          Language.translate("search_results_part_1") +
          " " +
          this.searchContentslength +
          " " +
          Language.translate("search_results_part_2") +
          " " +
          " " +
          `"` +
          searchResults.key +
          `"`,
      },
    })
    this.tag('Grid').scroll = { after: 1 }
  }

  async onRequestItems() {
    this.tag('Grid').requestThreshold = 3
    const skip = this.tag('Grid').items.length
    await searchVideo(Storage.get('prevsearchkey'), skip).then((response) => {
      const searchResultsArray = response.data.contents[0]
      const children = searchResultsArray.list.map((item) => {
        this.totalvideos.push(item)
        item.x = 1
        item.y = 1
        item.w = 320
        item.h = 180
        item.orientation = 1
        return { type: Item, item }
      })
      this.tag('Grid').addAt(children, this.tag('Grid').items.length)
      return response.items
    })
    this._refocus()
  }

  _getFocused() {
    return this.tag('Grid')
  }

  _handleEnter() {
    if (this.backSelected) {
      this.backSelected = false
      this.fireAncestors('$backToHome', {
        exit: false,
      })
    } else {
      this.selectedIndex = this.tag('Grid').index
      this.currentItem = this.totalvideos[this.selectedIndex].item
      Router.navigate(`details/${this.currentItem.content_id}`)
      Router.getActivePage().widgets.loader.alpha = 1
    }
  }


  _handleLeft() {
    Storage.remove('stateInfo')
    Router.getActivePage().$focusKeyboard()
  }

  _handleRight() {
    this.tag('Grid').next()
  }

  _handleDown() {
    this.tag('Grid').next()
  }

  _handleBack() {
    Storage.remove('stateInfo')
    Router.back()
  }
}
