import { Lightning, Language, Storage, Router } from '@lightningjs/sdk'
import { activeCategory, bannerKey, categories, emptyPageIcon, stateInfo } from '../helper/globalConstants.js'
import { getCategory } from '../Services/contentApis.js'

export default class Category extends Lightning.Component {
  _focus() {
    Storage.set('state', 'Videos')
    this.patch({ alpha: 1 })
    this.widgets.menu.alpha = 0
    this.widgets.iconmenu.alpha = 1
  }

  _init() {
    this._focus()
  }

  async prepareData(categoryId) {
    const categoryRes = await getCategory(categoryId)


    this.patchingBanner(categoryRes) // used for displaying banner widget

    const completeHomedata = categoryRes.filter(Obj => Obj.key !== bannerKey) // filtered array w/o banner Object

    const data = completeHomedata.filter(val => { return val?.list?.length > 0 })

    this.patchingDataToTemplate(data)
  }

  patchingBanner(categoryRes) {
    this.bannerVideos = []
    this.bannerAvail = categoryRes.filter(Obj => Obj.key == bannerKey)
    this.checkOtherCatExceptBanner = categoryRes.filter(Obj => Obj.key != bannerKey)
    if (
      this.bannerAvail.length === 0 &&
      this.checkOtherCatExceptBanner.length > 0
    ) {
      this.widgets.banneritem.alpha = 1
      this.widgets.banner.alpha = 0
      Router.focusWidget('VideoSlider')
      return
    }
    this.bannerVideos = categoryRes.find(Obj => Obj.key === bannerKey)
    if (this.bannerVideos?.list.length > 0) {
      this.widgets.banner.data = this.bannerVideos
      this.widgetsVisibility(bannerKey)
      Router.focusWidget('Banner')
    }
  }

  widgetsVisibility(bannerTypes) {
    this.widgets.banner.alpha = bannerTypes === bannerKey ? 1 : 0
    this.widgets.banneritem.alpha = bannerTypes === 'banneritem' ? 1 : 0
    this.widgets.emptypage.alpha = 0
  }

  patchingDataToTemplate(data) {
    this.widgets.loader.alpha = 0
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

    this.checkCatLen = data.length

    this.stateInfo = Storage.get(stateInfo) ? JSON.parse(Storage.get(stateInfo)) : null
    if (this.checkCatLen > 0) {
      this.widgets.emptypage.alpha = 0
      this.widgets.videoslider.alpha = 1
      this.widgets.videoslider.data = data
      const isBannerVisible = this.bannerVideos?.list?.length > 0 && (!this.stateInfo || this.stateInfo?.banner)
      this.widgets.banner.alpha = isBannerVisible ? 1 : 0
      this.widgets.banneritem.alpha = isBannerVisible ? 0 : 1
      Router.focusWidget(isBannerVisible ? 'Banner' : 'VideoSlider')
    } else {
      this.widgets.videoslider.alpha = 0
      this.widgets.banner.alpha = 0
      this.widgets.banneritem.alpha = 0
      this.widgets.emptypage.data = {
        status: true,
        Message: Language.translate('no_content_found_string'),
        Image: emptyPageIcon
      }
      Router.focusWidget('EmptyPage')
    }
  }

  _getFocused() {
    this.widgets.banner.alpha ? Router.focusWidget('Banner') : this.focusVideoSlider()
  }

  focusVideoSlider() {
    if (this.checkCatLen > 0) {
      this.widgets.banner.alpha = 0
      this.widgets.banneritem.alpha = 1
      Router.focusWidget('VideoSlider')
    } else Router.focusWidget('EmptyPage')
  }

  _handleBack() { Router.back() }

  _handleUp() {
    if (this.bannerAvail.length === 0 &&
      this.checkOtherCatExceptBanner.length > 0)
      return
    this.widgets.banneritem.alpha = 0
    this.widgets.banner.alpha = 1
    this.widgets.banner.data = this.bannerVideos
    Router.focusWidget('Banner')
  }
}
