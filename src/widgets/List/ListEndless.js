import { Lightning, Storage, Router, Language } from '@lightningjs/sdk'
import Item from './Item.js'
import ListComponent from './ListComponent.js'
import { colors, fontsizes } from '../../Themes/theme.js'
import { stateInfo } from '../../helper/globalConstants.js'


export default class EndlessList extends Lightning.Component {
  static _template() {
    return {
      Title: {
        zIndex: 5,
        x: 22,
        height: 30,
        y: 18,
        mountY: 0.5,
        text: {
          fontFace: 'Bold',
          fontSize: fontsizes.videoSliderTitle,
          fontWeight: 700,
          textColor: colors.fontColor,
        },
      },
      Slider: {
        clipbox: false,
        zIndex: 5,
        y: 45,
        x: 10,
        type: ListComponent,
        w: 1735,
        itemSize: 355,
        clipping: true,
        horizontal: true,
        visible: true,
      },
    }
  }

  set items(carouselData) {
    this.traverseIndex = 0
    this.sliderIndex = carouselData.sliderIndex
    this.tag('Title').text.text = carouselData.title || ''

    if (carouselData.x) {
      this.patch({ x: carouselData.x, y: carouselData.y })
    }
    if (carouselData.w) {
      this.tag('Slider').patch({ w: carouselData.w })
    }

    // changing height and width

    this.width = 215
    this.height = 322.5
    this.tag('Slider').patch({
      h: this.height + 100,
      itemSize: this.width + 25,
    })

    const viewMore = {
      content_id: 'see-all',
      orentitation: 1,
      key: carouselData.key,
      title: Language.translate('view_more')
    }

    this.videos = carouselData.videos.length > 10
      ? carouselData.videos.slice(0, 10).concat(viewMore)
      : carouselData.videos

    const children = this.videos.map((item, index) => {
      item.id = index + 1
      item.orientation = carouselData.orientation
      return { type: Item, item }
    })
    this.tag('Slider').items = children

    this.setStateManagement()
  }

  setStateManagement() {
    const stateData = Storage.get(stateInfo)
    if (stateData) {
      const parsedStateInfo = JSON.parse(stateData)
      this._index = parsedStateInfo.card

      if (!parsedStateInfo.banner &&
        this.sliderIndex === parsedStateInfo.slider &&
        this.videos.length > this._index) {
        this.focusCarouselByIndex(this._index, this.sliderIndex)
        return
      }
    }
    this.tag('Slider').setIndex(0)
  }

  focusCarouselByIndex(cardIndex, sliderIndex) {
    this.traverseIndex = cardIndex
    this.setGridYPos(sliderIndex)
  }

  setGridYPos(indexValue) {
    const stateData = JSON.parse(Storage.get(stateInfo))
    if (stateData.seeAll) {
      Router.getActivePage().widgets.videoslider.select({ index: indexValue })
    }
  }

  get slider() {
    return this.tag('Slider')
  }

  get active() {
    return this.tag('Slider').getElement(this.traverseIndex)
  }

  get tiles() {
    return this._items.tiles
  }

  _handleLeft() {
    if (this.traverseIndex > 0) {
      this.traverseIndex--
      this.tag('Slider').setPrevious()
    } else if (this.traverseIndex == 0) {
      Router.focusWidget('Menu')
    }
    if (Router.getActiveHash().includes('home')) Storage.remove(stateInfo)
  }

  _handleRight() {
    if (this.traverseIndex < this.videos.length - 1) {
      this.traverseIndex++
      this.tag('Slider').setNext()
    }
    if (Router.getActiveHash().includes('home')) Storage.remove(stateInfo)
  }

  _handleEnter() {
    const item = this.videos[this.traverseIndex]
    item.index = this.traverseIndex
    Router.getActivePage().widgets.videoslider.$onItemSelect({ item })
  }

  _handleDown() {
    this.removeStateInfo()
    Router.getActivePage().widgets.videoslider._handleDown()
  }

  removeStateInfo() {
    if (Storage.get(stateInfo)) {
      const stateData = JSON.parse(Storage.get(stateInfo))
      !stateData.banner && !stateData.railbanner ? Storage.remove(stateInfo) : ''
    }
  }

  _handleUp() {
    this.removeStateInfo()
    Router.getActivePage().widgets.videoslider._handleUp()
  }

  _getFocused() {
    this.fireAncestors('$onVideoHovered', { item: this.videos[this.traverseIndex] })
    if (
      Storage.get(stateInfo) &&
      (Router.getActiveHash().includes('home') ||
        Router.getActiveHash().includes('category'))
    ) {
      this.tag('Slider').reload()
      this.tag('Slider').setIndex(this.traverseIndex)
    }
    return this.active
  }

  _handleBack() {
    Router.getActiveHash().includes('home') ? Router.getActivePage()._handleBack() : Router.back()
  }

  calculateHeightOfCarousel() {
    let height = 0
    height = 400
    return height
  }
}
