import { Lightning, Router, Storage } from '@lightningjs/sdk'
import App from '../../App'
import { colors } from '../../Themes/theme'
import CircleIndicator from './CircleIndicator'
import BannerItem from './BannerItem'

export default class Banner extends Lightning.Component {
  static _template() {
    return {
      signals: { exitBanner: '_exitBanner' },
      Items: {
        w: App.width,
        h: 400,
        rect: true,
        color: colors.background,
      },
      IndicatorBox: {
        x: 180,
        w: App.width - 180,
        h: 50,
        y: 480,
        Indicators: {
          zIndex: 2,
        },
      },
    }
  }
  set data(data) {
    let xPosition = (App.width - 180) / 2 - (data.list.length / 2) * 60
    xPosition = 20
    this.banneritems = data.list
    data.list.forEach((item) => (item.showMoreInfo = true))
    this.tag('Items').children = data.list.map((item) => {
      return { type: BannerItem, alpha: 0, item }
    })
    this.tag('Indicators').children = data.list.map((item) => {
      xPosition = xPosition + 50
      return { type: CircleIndicator, alpha: 1, x: xPosition, item }
    })
    if (Storage.get('stateInfo')) {
      this.stateInfo = JSON.parse(Storage.get('stateInfo'))
      this.index = this.stateInfo.banner ? this.stateInfo.card : 0
    } else {
      this.index = 0
    }
    this.totalIndex = 0
    this.tag('Indicators').alpha = data.list.length <= 1 ? 0 : 1
    this.previousItem = this.tag('Items').children[this.index]
    this.previousItem.alpha = 1
    this.updateIndicator(this.index)
  }

  _getFocused() {
    return this.tag('Items').children[this.index]
  }

  _handleLeft() {
    if (this.index == 0) {
      Router.focusWidget('Menu')
      this.index = 0
      this.tag('Items').children[this.index].alpha = 1
      this.previousItem = this.tag('Items').children[this.index]
    } else if (this.index <= this.banneritems.length) {
      this.index--
      this.previousItem.patch({
        alpha: 0,
      })
      this.tag('Items').children[this.index].patch({
        alpha: 1,
      })
      this.previousItem = this.tag('Items').children[this.index]
    }
    this.updateIndicator(this.index, 'left')
  }

  _handleRight() {
    if (this.index == this.banneritems.length - 1) {
      this.index = this.banneritems.length - 1
      this.tag('Items').children[this.index].alpha = 1
      this.previousItem = this.tag('Items').children[this.index]
    } else if (this.index < this.banneritems.length - 1) {
      this.index++
      this.previousItem.alpha = 0
      this.tag('Items').children[this.index].alpha = 1
      this.previousItem = this.tag('Items').children[this.index]
    }
    this.updateIndicator(this.index, 'right')
  }

  _handleEnter() {
    this.storeStateInfo()
    Router.navigate(`details/${this.banneritems[this.index].content_id}`)
    Router.getActivePage().widgets.loader.alpha = 1
  }

  storeStateInfo() {
    Storage.set('stateInfo',
      JSON.stringify({
        card: this.index,
        banner: 1,
        home: Router.getActiveHash().includes('home') ? 1 : 0,
        carouselYPosition: 0,
      })
    )
  }

  updateIndicator(index, direction) {
    const orgIndex = index - this.totalIndex
    this.tag('Indicators').children[orgIndex].patch({
      RoundRectangle: {
        texture: Lightning.Tools.getRoundRect(24, 24, 12, 2, colors.focusBorderColor, true, colors.focusBorderColor),
      },
    })
    if (this.previousIndex == 0 && direction === 'right') {
      this.previousIndex = 0
      this.tag('Indicators').children[this.previousIndex].patch({
        RoundRectangle: {
          texture: Lightning.Tools.getRoundRect(24, 24, 12, 2, colors.fontColor, true, colors.fontColor),
        },
      })
    } else if (this.previousIndex == this.totalIndex && direction === 'left') {
      this.previousIndex = this.totalIndex
    } else if (this.previousIndex >= 0) {
      this.tag('Indicators').children[this.previousIndex].patch({
        RoundRectangle: {
          texture: Lightning.Tools.getRoundRect(24, 24, 12, 2, colors.fontColor, true, colors.fontColor),
        },
      })
    }
    this.previousIndex = orgIndex
    this.tag('Indicators').children[orgIndex].patch({
      RoundRectangle: {
        texture: Lightning.Tools.getRoundRect(24, 24, 12, 2, colors.focusBorderColor, true, colors.focusBorderColor),
      },
    })
  }

  _handleUp() { return }

  _handleDown() {
    this.patch({ alpha: 0 })
    Router.getActivePage().widgets.banneritem.alpha = 1
    Router.focusWidget('VideoSlider')
  }

  _handleBack() {
    Router.getActivePage().widgets.popup.showExitPopUp()
    Router.focusWidget('Popup')
  }
}
