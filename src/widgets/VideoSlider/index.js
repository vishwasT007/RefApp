import { Lightning, Storage, Router } from '@lightningjs/sdk'
import ListEndless from '../List/ListEndless.js'
import App from '../../App'
import { stateInfo } from '../../helper/globalConstants.js'

export default class VideoSlider extends Lightning.Component {
  static _template() {
    return {
      alpha: 1,
      zIndex: 5,
      clipping: true,
      forceZIndexContext: true,
      x: 170,
      y: 660,
      h: App.height - 500,
      w: 1755,
      signals: { exitList: '_exitList' },
      Grid: {
        alpha: 1,
        zIndex: 5,
        forceZIndexContext: true,
        type: ListEndless,
      },
    }
  }

  _init() {
    this._index = 0
    this._previousIndex = 0
  }

  _focus() {
    Storage.set('state', 'Videos')
    this.patch({ alpha: 1 })
  }

  set data(data) {
    this._index = 0
    this._previousIndex = 0
    this.tag('Grid').y = 0

    const content = []
    let listIdx = 0
    let carouselYPos = 0
    this.CategoryVideos = data.filter(obj => obj.list?.length > 0)
    this.CategoryVideos.map((d) => {
      content.push({
        items: {
          sliderIndex: listIdx,
          orientation: d.orientation || 2,
          videos: d.list || d.videos,
          title: d.title || d.category_title,
          key: d.slug || d.key,
        },
        type: ListEndless,
        y: carouselYPos,
        sliderIndex: listIdx,
      })

      listIdx++
      carouselYPos += Router.getActivePage().widgets.listendless.calculateHeightOfCarousel() + 80
    })
    this.tag('Grid').children = content
    if (Storage.get(stateInfo)) {
      const stateData = JSON.parse(Storage.get(stateInfo))
      this._index = stateData.slider || 0
      this.tag('Grid').y = stateData.carouselYPosition
    }
  }

  get list() {
    return this.tag('Grid').children
  }

  get active() {
    return this.list[this._index]
  }

  get previousIndex() {
    return this._previousIndex
  }

  set previousIndex(index) {
    this._previousIndex = index
  }

  resetGridIndex() {
    this._index = 0
  }

  get focusedItem() {
    return this.tag('Grid').children[this.index].focusedItem
  }

  _getFocused() {
    return this.active
  }

  _handleUp() {
    this._previousIndex = this._index
    this._index > 0 ? this.fire('select', { index: this._index - 1 }) : Router.getActivePage()._handleUp()
    return false
  }

  _handleDown() {
    this._previousIndex = this._index
    if (this._index < this.list.length - 1) {
      this.fire('select', { index: this._index + 1 })
    } else return false
  }

  select({ index }) {
    this._index = index
    const listStartingYPos = this.list[this._index].y
    this.tag('Grid').setSmooth('y', index === 0 ? 0 : -listStartingYPos, {
      duration: 0.5,
      timingFunction: 'ease',
    })
  }

  $onReachedZeroIndex() {
    Router.focusWidget('Menu')
  }

  $onVideoHovered(item) {
    Router.getActivePage().widgets.banneritem.item = item.item
  }

  _handleBack() {
    Router.getActivePage()._handleBack()
  }

  async $onItemSelect({ item }) {
    const gridYPos = this.tag('Grid').y
    Storage.set(stateInfo,
      JSON.stringify({
        slider: this._index,
        card: item.index,
        banner: 0,
        home: Router.getActiveHash().includes('home') ? 1 : 0,
        carouselYPosition: gridYPos,
      })
    )
    item.content_id === 'see-all'
      ? Router.navigate(`subcategory/${item.key}`)
      : Router.navigate(`details/${item.content_id}`)
    Router.getActivePage().widgets.loader.alpha = 1
  }
}
