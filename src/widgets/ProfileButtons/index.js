import { Lightning, Router, Storage } from '@lightningjs/sdk'
import ProfileDynamicButton from './DynamicButton.js'

export default class ProfileButtons extends Lightning.Component {
  static _template() {
    return {
      zIndex: 1,
      Wrapper: {
        w: 1600,
        paddingLeft: 200,
        ButtonList: {
          x: 185,
          y: 90,
          w: 1600,
          h: 200,
          flex: { direction: 'row', wrap: true, padding: 30, justifyContent: 'flex-start', alignContent: 'space-between' },
        },
      },
    }
  }

  _init() {
    Storage.remove('selectedBtn')
  }

  set data(buttons) {
    this.buttonData = buttons
    this.tag('ButtonList').children = this.buttonData.map((item, index) => {
      return {
        type: ProfileDynamicButton,
        h: 66,
        borderRadius: 2,
        textPadding: 30,
        btnId: index + 1,
        withoutTexture: false,
        label: item.heading,
        flexItem: { marginRight: 40, alignSelf: 'stretch', maxHeight: 100 },
      }
    })
    this.index = Storage.get('setting_index') || 0
  }

  set listVisibility(value) {
    this.tag('ButtonList').alpha = value
  }

  _handleRight() {
    if (this.index < this.buttonData.length - 1) {
      this.index++
    }
  }

  _handleLeft() {
    this.index > 0 ? this.index-- : Router.focusWidget('Menu')
  }

  _handleEnter() {
    const buttonType = this.buttonData[this.index].type
    const buttonLength = this.tag('ButtonList').children.length
    Storage.set('selectedBtn', this.index + 1)

    for (let index = 0; index < buttonLength; index++) {
      if (index !== this.index) {
        this.tag('ButtonList').children[index].updateBtn()
      }
    }
    Router.getActivePage().getButtonSelection(buttonType, this.index)
  }

  _getFocused() {
    return this.tag('ButtonList').children[this.index]
  }

  _handleUp() { return }

  _handleDown() {
    Router.getActivePage().widgets.staticdata.onHandleDown()
  }

  _handleBack() { Router.back() }
}
