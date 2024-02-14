import {Lightning, Router, Storage } from '@lightningjs/sdk'
import App from '../App'
import { colors } from '../Themes/theme'
import { getStaticPageDetails } from '../Services/contentApis'
import { categories } from '../helper/globalConstants'

export default class UserProfile extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: App.width,
        h: App.height,
        rect: true,
        color: colors.background,
      },
    }
  }

  _init() {
    this.widgets.iconmenu.alpha = 1
    this.widgets.menu.alpha = 0
    this.getButtonSelection('terms', 0)
    Storage.remove('selectedBtn')
  }

  _getFocused() {
    return Router.focusWidget('ProfileButtons')
  }

  _active() {
    this.widgets.loader.alpha = 0
  }

  prepareData() {
    this.widgets.loader.alpha = 0
    if (categories) {
      this.widgets.menu.data = categories
      this.widgets.iconmenu.data = categories
    }
    const buttonsArray = [
      { heading: 'Terms and Conditions', type: 'terms' },
      { heading: 'Privacy Policy', type: 'privacy' }
    ]

    this.widgets.profilebuttons.data = buttonsArray
    Router.focusWidget('ProfileButtons')
    this.widgets.profilebuttons.listVisibility = 1
  }

  async getButtonSelection(value, index) {
    const staticRes = await getStaticPageDetails(value)
    this.widgets.staticdata.data = staticRes
    this.widgets.staticdata.alpha = 1
    Storage.set('setting_index', index)
  }

  _handleBack() {
    Router.back()
  }
}
