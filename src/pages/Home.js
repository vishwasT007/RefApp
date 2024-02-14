import { Lightning, Language, Storage, Router } from '@lightningjs/sdk'
import { activeCategory, bannerKey, categories, emptyPageIcon, stateInfo } from '../helper/globalConstants'
import { getHome } from '../Services/contentApis.js'

export default class Home extends Lightning.Component {

  _focus() {
    this.widgets.menu.alpha = 0
    this.widgets.iconmenu.alpha = 1
  }

  _init() {
    this._focus()
  }

  async prepareData() {
    const homeVideos = await getHome()
    const data = this.stitchingBanners(homeVideos)
    this.patchingDataToTemplate(data)
  }

  patchingDataToTemplate(data) {
    if (categories && !this.widgets.menu.categories) {
      this.widgets.menu.data = categories
      this.widgets.iconmenu.data = categories
    }
    if (Storage.get(activeCategory)) {
      this.widgets.menu.activeIndex = Storage.get(activeCategory)
      this.widgets.iconmenu.activeIndex = Storage.get(activeCategory)
    }
    this.widgets.loader.alpha = 0
    this._index = 0

    this.checkHomeVideoLen = data.length
    if (Storage.get(stateInfo)) {
      this.stateInfo = JSON.parse(Storage.get(stateInfo))
    }
    if (data.length > 0) {
      this.widgets.videoslider.alpha = 1
      this.widgets.videoslider.data = data
      this.widgets.emptypage.alpha = 0
      const isBannerVisible = this.bannerVideos?.list?.length > 0 && (!this.stateInfo || this.stateInfo?.banner)
      this.widgets.banner.alpha = isBannerVisible ? 1 : 0
      this.widgets.banneritem.alpha = isBannerVisible ? 0 : 1
      Router.focusWidget(isBannerVisible ? 'Banner' : 'VideoSlider')
    } else {
      this.widgets.videoslider.alpha = 0
      this.widgets.banner.alpha = 0
      this.widgets.emptypage.data = {
        status: true,
        Message: Language.translate('no_content_found_string'),
        Image: emptyPageIcon
      }
      Router.focusWidget('EmptyPage')
    }
  }

  stitchingBanners(homeVideos) {
    if (homeVideos.length == 0) return homeVideos
    this.bannerVideos = homeVideos.find((Obj) => Obj.key === bannerKey)
    const homeDataWithoutBanner = homeVideos.filter((Obj) => Obj.key !== bannerKey)
    this.widgets.banner.data = this.bannerVideos
    Router.focusWidget('Banner')
    return homeDataWithoutBanner
  }

  _handleBack() {
    this.widgets.popup.showExitPopUp()
    Router.focusWidget('Popup')
  }

  _getFocused() {
    this.widgets.banner.alpha ? Router.focusWidget('Banner') : this.focusVideoSlider()
  }

  focusVideoSlider() {
    if (this.checkHomeVideoLen > 0) {
      this.widgets.banner.alpha = 0
      this.widgets.banneritem.alpha = 1
      Router.focusWidget('VideoSlider')
    } else Router.focusWidget('EmptyPage')
  }

  _handleUp() {
    this.widgets.banneritem.alpha = 0
    this.widgets.banner.alpha = 1
    this.widgets.banner.data = this.bannerVideos
    Router.focusWidget('Banner')
  }
}
