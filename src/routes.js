
import {
  Splash,
  Home,
  Category,
  Details,
  Player,
  UserProfile,
  Search,
  SubCategory
} from './pages'
import { Storage, Router, VideoPlayer } from '@lightningjs/sdk'
import { activeCategory, categories, gridStateInfo, stateInfo } from './helper/globalConstants'

export default {
  boot: () => {
    Storage.remove(activeCategory)
    Storage.remove(stateInfo)
    Storage.remove(gridStateInfo)
    Storage.set('mainCategory', true)
  },
  root: 'home',
  routes: [
    {
      path: 'home',
      component: Home,
      before: async (page) => {
        if (Storage.get(stateInfo)) {
          const stateData = JSON.parse(Storage.get(stateInfo))
          if (stateData.home == 0) {
            Storage.remove(stateInfo)
          }
        }
        page.widgets.loader.alpha = 1
        Storage.set(activeCategory, '0')

        return page.prepareData()
      },
      widgets: [
        'IconMenu',
        'Menu',
        'Banner',
        'VideoSlider',
        'Loader',
        'EmptyPage',
        'Popup',
        'BannerItem',
      ],
    },
    {
      path: 'category',
      component: Category,
      before: async (page, { categoryId }) => {
        if (Storage.get(stateInfo)) {
          const stateData = JSON.parse(Storage.get(stateInfo))
          if (stateData.home == 1) {
            Storage.remove(stateInfo)
          }
        }
        page.widgets.loader.alpha = 1

        Storage.set(activeCategory, 2)

        return page.prepareData(categoryId)
      },
      widgets: [
        'IconMenu',
        'Menu',
        'BannerItem',
        'Banner',
        'VideoSlider',
        'Loader',
        'EmptyPage',
        'Popup',
      ],
    },
    {
      path: 'details/:videoId',
      component: Details,
      before: async (page, { videoId }) => {
        page.prepareData(videoId)
      },
      widgets: [
        'ButtonsList',
        'Loader',
        'Popup',
        'DetailsBtns',
      ],
    },
    {
      path: 'player',
      component: Player,
      before: async (page) => {
        return page.initializePlayback()
      },
      widgets: [
        'PlayerControls',
        'Popup',
        'ProgressBar',
        'Loader',
      ],
    },
    {
      path: 'search',
      component: Search,
      on: async (page) => {
        page.widgets.loader.alpha = 1
        Storage.set(activeCategory, '1')
        page.widgets.menu.data = categories
        page.widgets.iconmenu.data = categories
        page.widgets.menu.activeIndex = Storage.get(activeCategory)
        page.widgets.iconmenu.activeIndex = Storage.get(activeCategory)
      },
      widgets: ['IconMenu', 'Menu', 'Loader', 'Popup', 'Keyboard', 'SearchResults'],
    },
    {
      path: 'profile',
      component: UserProfile,
      before: async (page) => {
        page.widgets.loader.alpha = 1
        page.widgets.profilebuttons.listVisibility = 0
        page.prepareData()
        Storage.set(activeCategory, '3')
        page.widgets.menu.activeIndex = Storage.get(activeCategory)
        page.widgets.iconmenu.activeIndex = Storage.get(activeCategory)

      },
      widgets: ['IconMenu', 'Menu', 'Loader', 'ProfileButtons', 'Popup', 'StaticData', 'ScrollList'],
    },
    {
      path: 'subcategory/:key',
      component: SubCategory,
      before: async (page, { key }) => {
        return page.prepareData(key)
      },
      widgets: ['IconMenu', 'Menu', 'BannerItem', 'VideoGrid', 'Loader', 'EmptyPage'],
    },
    {
      path: '$',
      component: Splash,
    },
  ],

  beforeEachRoute: async (from, to) => {
    if (from != undefined) {
      const fromRoute = from
      const toRoute = to._hash
      Storage.set('route', fromRoute)
      Storage.set('toroute', toRoute)

      if (fromRoute.includes('player')) {
        VideoPlayer.close()
        Router.getActivePage().dash?.reset()
      }

      toRoute == 'home' ||
        toRoute.includes('category') ||
        toRoute == 'profile' ||
        toRoute == 'search'
        ? Storage.set('mainCategory', true)
        : Storage.set('mainCategory', false)

      if (
        (fromRoute.includes('details') &&
          toRoute === 'search') ||
        toRoute.includes('details/')
      ) {
        return true
      }
      if (Storage.get('prevsearchkey') && !toRoute.includes('player')) {
        Storage.set('prevsearchkey', '')
        return true
      }
      return true
    } else {
      Storage.set('prevsearchkey', '')
      return true
    }
  },
}
