import { Lightning, Language, Storage, Router } from '@lightningjs/sdk'
import App from '../App.js'
import KeyBoardinputDisplay from '../widgets/Keyboard/KeyboardInputDisplay'
import { searchVideo } from '../Services/contentApis.js'
import { colors, fontsizes } from '../Themes/theme.js'
import { activeCategory, categories } from '../helper/globalConstants.js'
export default class Search extends Lightning.Component {
  static _template() {
    return {
      w: App.width,
      h: App.height,
      signals: {
        openMenu: '_openMenu',
      },
      Background: {
        w: 1920,
        h: 1080,
        color: colors.background,
        rect: true
      },
      SearchForm: {
        type: KeyBoardinputDisplay,
        x: 100,
        y: 100,
        w: 480,
        props: {
          isDark: true,
          fields: [
            {
              id: 'query',
              label: 'Zoeken',
              value: '',
              isMasked: false,
            },
          ],
        },
      },
      Message: {
        x: 910,
        y: 200,
        alpha: 0,
        Toast: {
          w: 915,
          x: 450,
          mountX: 0.5,
          text: {
            fontFace: 'Regular',
            fontSize: fontsizes.searchPageToastMessage,
            textColor: colors.focusBorderColor,
            wordWrapWidth: 900,
            textAlign: 'left',
          },
        },
        AdditionalToast: {
          y: 100,
          w: 915,
          x: 450,
          mountX: 0.5,
          text: {
            text: Language.translate('maybe_something_else_definition'),
            fontFace: 'Regular',
            fontSize: fontsizes.searchPageToastMessage,
            textColor: colors.fontColor,
            wordWrapWidth: 900,
            textAlign: 'left',
          },
        },
      },
      KeyboardBgShadow: {
        x: 200,
        y: 72,
        alpha: 0,
        color: colors.popupBlurColor,
        texture: Lightning.Tools.getShadowRect(500 + 20, 570 + 20, 10, 16),
      },
    }
  }

  _focus() {
    Storage.set('state', 'Search')
    this.patch({ alpha: 1 })
    this.patch({
      Message: { Toast: { text: Language.translate('no_results') + `"` + this.searchTerm || '' + `"` } },
    })
    this.widgets.menu.alpha = 0
    this.widgets.iconmenu.alpha = 1
  }

  _init() {
    this._index = 1
    this.searchData = []
    this.searchTerm = ''
    this.searchVal = ''
    this.widgets.keyboard.layout = 'search'
    this.tag('SearchForm').displayType = 'search'
    this.widgets.iconmenu.alpha = 1
    this.widgets.menu.alpha = 0
  }

  _enable() {
    if (categories && !this.widgets.menu.categories) {
      this.widgets.menu.data = categories
      this.widgets.iconmenu.data = categories
      this.widgets.menu.activeIndex = Storage.get(activeCategory) || null
      this.widgets.iconmenu.activeIndex = Storage.get(activeCategory) || null
    }
    this.widgets.loader.alpha = 0
    this._index = 1
    this.focusItem = 'KeyBoard'
    this.patch({ Message: { alpha: 0 } })
    if (Storage.get('prevsearchkey') != '') {
      this._index = 3
      this.searchTerm = Storage.get('prevsearchkey')
      Storage.set('prevsearchkey', '')
      this.widgets.searchresults.alpha = 1
      this.tag('Message').setSmooth('alpha', 0)
      this.tag('SearchForm').input = this.searchTerm
      this.handleSearch(this.searchTerm, 'prevsearch')
      this.widgets.keyboard.value = this.searchTerm
    } else {
      this.tag('SearchForm').input = Language.translate('what_to_watch')
      this.widgets.searchresults.alpha = 0
      this.tag('Message').setSmooth('alpha', 0)
      this.searchData = []
    }
    this.widgets.keyboard.x = 220 + 20
    this.widgets.keyboard.y = 109
    this.widgets.keyboard.layout = 'search'
    this._index == 3 ? Router.focusWidget('SearchResults') : Router.focusWidget('Keyboard')
  }

  _handleRight() {
    if (this.widgets.searchresults.alpha) {
      this._index = 3
      this.focusItem = 'SearchResults'
      Router.focusWidget('SearchResults')
    }
  }

  $focusKeyboard() {
    this._index = 1
    this.focusItem = 'KeyBoard'
    this._index == 3 ? Router.focusWidget('SearchResults') : Router.focusWidget('Keyboard')
  }

  _handleUp() {
    if (this._index > 1) {
      this._index--
      if (this._index == 1) {
        this.focusItem = 'KeyBoard'
      }
    }
  }

  _handleDown() {
    if (this._index == 0) {
      this._index++
      this.focusItem = 'KeyBoard'
    }
  }

  _getFocused() {
    if (this._index >= 0 && this._index != 2 && !Storage.get('stateInfo')) {
      if (this.focusItem == 'KeyBoard') return Router.focusWidget('Keyboard')
    }
    if (this._index == 3 || Storage.get('stateInfo')) return Router.focusWidget('SearchResults')
  }

  _disable() {
    if (this._index != 3) {
      this._index = 1
      this.focusItem = 'KeyBoard'
    }
  }

  async handleSearch(query, type = '') {
    if (query !== '') {
      this.widgets.loader.positions = true
      this.widgets.loader.alpha = 1
      const searchData = searchVideo(query, 0)
      this.searchData = searchData?.contents.filter((val) => {
        return val.list.length > 0
      })
      searchData ? this.sendDataToWidget(searchData, type, query) : this.showNoResults()
    } else {
      this.tag('SearchForm').input = Language.translate('what_to_watch')
      this.widgets.searchresults.alpha = 0
      this.tag('Message').setSmooth('alpha', 0)
      this.searchData = []
    }
  }

  sendDataToWidget(searchData, type, query) {
    this.widgets.loader.alpha = 0
    this.searchTerm = type == 'prevsearch' ? query : this.searchTerm
    Storage.set('prevsearchkey', this.searchTerm)
    this.widgets.searchresults.alpha = 1
    this.tag('Message').setSmooth('alpha', 0)
    // passing data to searchresults
    this.widgets.searchresults.data = {
      res: searchData.contents,
      key: this.searchTerm,
    }
    this.widgets.loader.alpha = 0
    this.focusItem = 'KeyBoard'
    if (Router.getActiveHash().includes('search'))
      this._index == 3 ? Router.focusWidget('SearchResults') : Router.focusWidget('Keyboard')
  }

  showNoResults() {
    this.widgets.searchresults.alpha = 0
    this.tag('Message').setSmooth('alpha', 1)
    this.patch({
      Message: { Toast: { text: Language.translate('no_results') + ' ' + `"` + this.searchTerm + `"` } },
    })
    this.widgets.loader.alpha = 0
    this.focusItem = 'KeyBoard'
    Router.focusWidget('Keyboard')
  }

  onKeyboardInputUpdate(value, keyAction) {
    if (this.timer) clearTimeout(this.timer)

    switch (keyAction) {
      case 'backspace':
        this.handleBackspace()
        break
      case 'delete':
        this.handleDelete()
        break
      default:
        this.handleOtherKeyActions(value, keyAction)
    }
  }

  handleBackspace() {
    if (this.searchVal.length > 0) {
      this.searchVal = this.searchTerm = this.searchVal.slice(0, -1)
      this.updateSearchForm()
    }
    if (this.searchVal.length < 3 && this.searchVal.length !== 0) {
      this.hideSearchResults()
    } else if (this.searchVal.length === 0) {
      this.clearSearchForm()
    } else {
      this.prepareSearchData()
    }
  }

  handleDelete() {
    this.clearSearchForm()
    this.hideSearchResults()
    this.resetSearchData()
  }

  handleOtherKeyActions(value, keyAction) {
    if (this.searchVal.length > 23) return
    this.searchVal += keyAction === 'space' ? ' ' : value
    this.searchTerm = this.searchVal
    this.updateSearchForm()
    if (this.searchTerm.length === 0) {
      this.resetSearchResults()
    } else if (this.searchTerm.length > 2) {
      this.prepareSearchData()
    } else {
      this.resetSearchResults()
    }
  }

  updateSearchForm() {
    this.tag('SearchForm').input = this.searchVal
    this.tag('SearchForm').title = ''
  }

  clearSearchForm() {
    this.searchVal = this.searchTerm = ''
    this.tag('SearchForm').input = ''
    this.tag('SearchForm').input = Language.translate('what_to_watch')
  }

  hideSearchResults() {
    this.resetSearchResults()
    this.focusOnKeyboard()
    this.tag('Message').setSmooth('alpha', 0)
  }

  resetSearchResults() {
    this.widgets.searchresults.alpha = 0
    this.searchData = []
  }

  focusOnKeyboard() {
    this.focusItem = 'KeyBoard'
  }

  prepareSearchData() {
    this.searchData = []
    this.timer = setTimeout(() => {
      this.handleSearch(this.searchTerm)
    }, 1000)
  }

  resetSearchData() {
    this.searchData = []
    this.tag('SearchForm').input = Language.translate('what_to_watch')
  }

  onkeyboardExitLeft() {
    Router.focusWidget('Menu')
  }

  _handleBack() {
    Router.back()
  }

}
