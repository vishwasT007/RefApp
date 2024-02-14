import { Utils, Router } from '@lightningjs/sdk'
import routes from './routes.js'
import {
  Menu,
  Banner,
  IconMenu,
  VideoSlider,
  BannerItem,
  ButtonsList,
  PlayerControls,
  Loader,
  ListEndless,
  ProfileButtons,
  Popup,
  Keyboard,
  EmptyPage,
  ProgressBar,
  SearchResults,
  DetailsBtns,
  StaticData,
  ScrollList,
  VideoGrid,
} from './widgets'

export default class App extends Router.App {
  static getFonts() {
    return [
      { family: 'Bold', url: Utils.asset('fonts/Catamaran-Bold.ttf') },
      {
        family: 'Regular',
        url: Utils.asset('fonts/Catamaran-Regular.ttf'),
      },
    ]
  }

  static language() {
    return {
      file: Utils.asset('locale/Translations.json'),
      language: 'en-US',
    }
  }

  _setup() {
    Router.startRouter(routes, this)
  }

  _construct() {
    this.height = App.height
    this.width = App.width
  }

  static get width() {
    return 1920
  }

  static get height() {
    return 1080
  }

  static get sideMargin() {
    return 60
  }

  static _template() {
    return {
      w: App.width,
      h: App.height,
      Pages: {
        forceZIndexContext: true,
      },
      ...super._template(),
      Widgets: {
        Menu: {
          type: Menu,
        },
        Banner: {
          type: Banner,
        },
        IconMenu: {
          type: IconMenu,
        },
        VideoSlider: {
          type: VideoSlider,
        },
        BannerItem: {
          type: BannerItem,
        },
        ButtonsList: {
          type: ButtonsList,
        },
        PlayerControls: {
          type: PlayerControls,
        },
        Loader: {
          type: Loader,
        },
        Popup: {
          type: Popup,
        },
        EmptyPage: {
          type: EmptyPage,
        },
        ListEndless: {
          type: ListEndless,
        },
        ProfileButtons: {
          type: ProfileButtons,
        },
        Keyboard: {
          type: Keyboard,
        },
        ProgressBar: {
          type: ProgressBar,
        },
        SearchResults: {
          type: SearchResults,
        },
        DetailsBtns: {
          type: DetailsBtns,
        },
        StaticData: {
          type: StaticData
        },
        ScrollList: {
          type: ScrollList
        },
        VideoGrid: {
          type: VideoGrid
        }
      }
    }
  }

  _handleAppClose() {
    Router.focusPage()
  }

  static get widgets() {
    return this.tag('Widgets')
  }
}
