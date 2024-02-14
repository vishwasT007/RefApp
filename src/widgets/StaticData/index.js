import { Lightning, Router } from '@lightningjs/sdk'
import App from '../../App.js'
import { colors } from '../../Themes/theme'

export default class StaticData extends Lightning.Component {
    static _template() {
        return {
            alpha: 0,
            zIndex: 3,
            w: App.width,
            h: App.height,
            Background: {
                alpha: 1,
                w: 1920,
                h: 1080,
                color: colors.background
            },
            Heading: {
                y: 271,
                x: 176 + App.sideMargin,
                w: App.width - 200,
                alpha: 0,
                text: {
                    textColor: colors.fontColor,
                    fontSize: 30,
                    lineHeight: 35,
                    fontFace: 'Bold',
                    paddingBottom: 50
                }
            }
        }
    }

    set data(data) {
        this._data = data
        Router.getActivePage().widgets.loader.alpha = 0
        this.tag('Heading').patch({
            text: { text: this._data.data.heading }
        })
        Router.getActivePage().widgets.scrolllist.items = this._data.data.page_array
        this.patch({
            alpha: 1
        })
    }

    onHandleDown() {
        if (this._data.data.page_array.length > 13) Router.focusWidget('ScrollList')
    }

    _handleBack() {
        Router.back()
    }

    _getFocused() {
        Router.focusWidget('ProfileButtons')
    }
}
