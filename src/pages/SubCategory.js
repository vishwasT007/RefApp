import { Lightning, Language, Router, Storage } from '@lightningjs/sdk'
import { activeCategory, categories, emptyPageIcon } from '../helper/globalConstants.js'
import { homePageInfo } from '../Services/tv2zApi'

export default class SubCategory extends Lightning.Component {

  _init() {
    this.widgets.loader.alpha = 1
  }

  _focus() {
    this.patch({ alpha: 1 })
  }

  prepareData(collectionKey) {
    const selectedCollection = homePageInfo.find(collection => collection.key == collectionKey)

    if (categories && !this.widgets.menu.categories) {
      this.widgets.menu.data = categories
      this.widgets.iconmenu.data = categories
      this.widgets.menu.alpha = 0
      this.widgets.iconmenu.alpha = 1
      if (Storage.get(activeCategory)) {
        this.widgets.menu.activeIndex = Storage.get(activeCategory)
        this.widgets.iconmenu.activeIndex = Storage.get(activeCategory)
      }
    }
    this.widgets.loader.alpha = 0
    this.dataLength = selectedCollection.list.length
    if (this.dataLength > 0) {
      this.widgets.emptypage.alpha = 0
      this.widgets.banneritem.alpha = 1
      this.widgets.videogrid.data = selectedCollection
      this.widgets.videogrid.alpha = 1
      Router.focusWidget('VideoGrid')
    } else
      this.showEmptyPage()
  }

  showEmptyPage() {
    this.widgets.videogrid.alpha = 0
    this.widgets.banneritem.alpha = 0
    this.widgets.emptypage.data = {
      status: true,
      Message: Language.translate('no_content_found_string'),
      Image: emptyPageIcon,
    }
    Router.focusWidget('EmptyPage')
  }

  _getFocused() {
    this.dataLength > 0
      ? Router.focusWidget('VideoGrid')
      : Router.focusWidget('EmptyPage')
  }

  _handleBack() {
    Router.back()
  }
}
