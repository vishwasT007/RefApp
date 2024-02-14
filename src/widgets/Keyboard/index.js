import { Lightning, Router, Storage } from '@lightningjs/sdk'
import KeyboardTemplate from './KeyboardTemplate.js'
import KeyboardButton from './KeyboardButton.js'
import { colors } from '../../Themes/theme.js'

export default class Keyboard extends Lightning.Component {
  static _template() {
    return {
      zIndex: 4,
      texture: Lightning.Tools.getRoundRect(560, 728, 0, 3, colors.searchKeyColor, true, colors.searchKeyColor),
    }
  }

  get keyboardTemplate() {
    return KeyboardTemplate
  }

  get keyboardButton() {
    return KeyboardButton
  }

  get maxCharacters() {
    return this._layout == 'search' ? 16 : 32
  }

  set value(val) {
    if (val.length <= this.maxCharacters) {
      this._value = val
      this.signal('valueChanged', { value: val })
    }
  }

  get value() {
    return this._value
  }

  get rows() {
    return this.children
  }

  get rowLength() {
    return this.rows[this.rowIndex].children.length
  }

  get currentKey() {
    const currentRow = this.children[this.rowIndex]
    return currentRow?.children[this.colIndex] || currentRow?.children[--this.colIndex]
  }

  set layout(layout) {
    this._layout = layout
    this._update()
    this.fireAncestors('$keyboardLayoutUpdate')
  }

  set type(inputType) {
    this.inputType = inputType
  }

  get layout() {
    return this._layout
  }

  _getFocused() {
    // here generic method is used.
    return this.currentKey
  }

  _navigate(dir, value) {
    dir = dir === 'up' || dir === 'down' ? 'vertical' : 'horizontal'
    if (
      dir === 'horizontal' &&
      this.colIndex + value < this.rowLength &&
      this.colIndex + value > -1
    ) {
      this.previous = null
      return (this.colIndex += value)
    } else if (
      dir === 'vertical' &&
      this.rowIndex + value < this.rows.length &&
      this.rowIndex + value > -1
    ) {
      const currentColIndex = this.colIndex
      const targetRow = this.rowIndex + value
      if (this.previous && this.previous.row === targetRow) {
        const tmp = this.previous.col
        this.previous.col = this.colIndex
        this.colIndex = tmp
      } else {
        const targetRow = this.children[this.rowIndex + value]
        const targetItems = targetRow.children
        const ck = this.currentKey
        let target = 0

        for (const targetItem of targetItems) {
          const ckx = this.children[this.rowIndex].x + ck.x
          const tix = targetRow.x + targetItem.x
          if (
            (ckx >= tix && ckx <= tix + targetItem.w) ||
            (tix >= ckx && tix <= ckx + ck.w)
          ) {
            target = targetItems.indexOf(targetItem)
            break
          }
        }
        this.colIndex = target
      }
      this.previous = { col: currentColIndex, row: this.rowIndex }
      return (this.rowIndex += value)
    }
    return false
  }

  _update() {
    if (this._layout && this.keyboardTemplate.layouts[this._layout] === undefined) {
      this._layout = null
    }
    if (!this._layout) {
      this._layout = Object.keys(this.keyboardTemplate.layouts)[0]
    }
    const { keyWidth, keyHeight, horizontalSpacing = 0, verticalSpacing = 0, layouts } = this.keyboardTemplate

    this.children = layouts[this._layout].rows.map((row, rowIndex) => {
      let keyOffset = 0
      const { x = 0, rowVerticalSpacing = verticalSpacing, rowHorizontalSpacing = horizontalSpacing, keys = [] } = row
      return {
        y: keyHeight * rowIndex + rowIndex * rowVerticalSpacing + 40,
        x,
        children: keys.map((key) => {
          key = Object.assign({ action: 'input' }, key)
          const prevOffset = keyOffset
          const { w = keyWidth, h = keyHeight, action, toLayout } = key
          keyOffset += w + rowHorizontalSpacing
          return { key, action, toLayout, x: prevOffset + 40, w, h, type: this.keyboardButton }
        }),
      }
    })
  }

  reset() {
    this.colIndex = 0
    this.rowIndex = 0
    this._value = ''
    this.previous = null
  }

  _active() {
    this.reset()
    this._update()
  }

  _handleRight() {
    if (
      (Router.getActiveHash().includes('search') && this.colIndex == 5) ||
      (Router.getActiveHash().includes('search') && this.rowIndex == 6 && this.colIndex == 2)
    ) {
      Router.getActivePage()._handleRight()
    }
    return this._navigate('right', 1)
  }

  _handleLeft() {
    if (this.colIndex == 0 && Storage.get('mainCategory')) {
      Router.getActivePage().onkeyboardExitLeft()
    } else {
      return this._navigate('left', -1)
    }
  }

  _handleUp() {
    if (this.rowIndex == 0) return
    return this._navigate('up', -1)
  }

  _handleDown() {
    if (this.layout === 'search' && this.rowIndex >= 6) {
      this.signal('onKeyboardExitDown')
    } else if (
      this.layout !== 'abc' &&
      this.rowIndex >= 7
    ) {
      this.signal('onKeyboardExitDown')
    } else {
      return this._navigate('down', 1)
    }
  }

  _handleEnter() {
    const key = this.currentKey
    switch (key.action) {
      case 'input':
        if (this.value.length < this.maxCharacters - 1) this.value = key.c
        break
      case '.com':
      case '@gmail.com':
      case '@hotmail.com':
      case '@yahoo.com':
        this.value = key.c
        break
      case 'backspace':
        if (this.value.length > 0) {
          this.value = 'backspace'
        }
        break
      case 'space':
        if (this.value.length > 0 && this.value.length < this.maxCharacters - 1) {
          this.value = ' '
        }
        break
      case 'delete':
        if (this.value.length > 0) {
          this.value = ''
        }
        break
      case 'toggleToLayout':
        this.layout = key.toLayout
        break
      default:
        this.signal(key.action)
        break
    }
    if (key.action != 'toggleToLayout') Router.getActivePage().onKeyboardInputUpdate(this.value, key.action)

    if (Router.getActiveHash().includes('authenticate')) {
      Router.getActivePage().onCodeUpdate(this.value)
    }
  }

  _disable() {
    this.reset()
  }

  set clearCode(_data) {
    this.value = ''
    Router.getActivePage().onCodeUpdate(this.value)
  }

  _handleBack() {
    Router.getActivePage()._handleBack()
  }

  _handleKey(key) {
    if (/^\d$/.test(key.key)) {
      this.value = key.key
      Router.getActivePage().onKeyboardInputUpdate(this.value, 'keypadNum')
    }
  }
}
