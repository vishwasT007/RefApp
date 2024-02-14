import { Lightning, Registry, Router } from '@lightningjs/sdk'
import App from '../../App.js'
import { colors } from '../../Themes/theme.js'

export default class ScrollList extends Lightning.Component {
  static _template() {
    return {
      zIndex: 2,
      x: 220,
      y: 260,
      w: App.width - 100 - App.sideMargin * 2,
      h: App.height - 210 - 50,
      ScrollContainer: {
        x: 0,
        y: 0,
        Lines: {
          flex: { direction: 'column' },
          flexItem: { maxWidth: App.width - 200 - App.sideMargin * 2, grow: 1, shrink: 1 }
        },
        h: App.height - 240 - 50,
        w: App.width - 100 - App.sideMargin * 2,
        clipping: true
      },
    }
  }

  set items(staticPageData) {
    this.offsetYposition = 0
    this.lines = staticPageData
    this._index = 0
    let newlines = []
    for (let index = 0; index < this.lines.length; index++) {
      const nextIndex = index + 1
      if (this.lines[index] == "" && this.lines[nextIndex]) {
        newlines.push("\r")
      } else if (this.lines[index]) {
        newlines.push(this.lines[index])
      }
    }
    this.lines = newlines
    const children = this.lines.map((item) => {
      let item1 = item
      if (item.length > 0) {
        item1 = this.rtrim(item1)
        item1 = this.ltrim(item1)
      }
      if (item1.length > 0) {
        item = item1
      }
      return {
        text: {
          text: item,
          textColor: colors.fontColor,
          wordWrapWidth: 1650,
          fontSize: 25,
          lineHeight: 28,
          fontFace: 'Regular',
        }
      }
    })

    this.tag('Lines').patch({
      children: children,
      y: this.offsetYposition
    })
    this.tag('Lines').loadTexture()
  }

  rtrim(str) {
    if (!str) return str
    return str.replace(/\s+$/g, '')
  }

  ltrim(str) {
    if (!str) return str
    return str.replace(/^\s+/, '')
  }

  _handleUp() {
    if (this.lines.length > this._index && this._index > 0) {
      this._index--
      this.offsetYposition = this.offsetYposition + this.tag('Lines').children[this._index].finalH
      this.tag('Lines').children[this._index].alpha = 1
    } else if (this._index === 0) {
      this.tag('Lines').children[this._index].alpha = 1
      this.offsetYposition = 0
      Router.focusWidget('ProfileButtons')
    }
    this.tag('Lines').patch({ y: this.offsetYposition })
  }

  _handleDown() {
    if (this.lines.length - 1 > this._index &&
      -(this.tag('Lines').finalY - 800) <=
      this.tag('Lines').finalH
    ) {
      this.offsetYposition = this.offsetYposition - this.tag('Lines').children[this._index].finalH
      this.tag('Lines').patch({ y: this.offsetYposition })
      this.tag('Lines').children[this._index].alpha = 0
      this._index++
    }
  }

  _handleLeft() { Router.focusWidget('Menu') }

  _handleBack() { Router.back() }

  _handleKey() { return }

}
