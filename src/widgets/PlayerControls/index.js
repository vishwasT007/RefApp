import { Lightning, Utils, Router } from '@lightningjs/sdk'
import { colors } from '../../Themes/theme'
export default class PlayerControls extends Lightning.Component {
  static _template() {
    return {
      zIndex: 5,
      x: 25,
      Background: {
        alpha: 0,
        w: 300,
        h: 100,
      },
      PlayerButtons: {
        y: 980,
      },
      Play: {
        x: 650,
        y: 450,
        flex: { direction: 'row' },
      },
      ContentTitle: {
        x: 30,
        y: 40,
        text: {
          fontSize: 36,
          textColor: colors.fontColor,
          wordWrapWidth: 700,
          fontFace: 'Bold',
          maxLines: 1,
          maxLinesSuffix: '...',
        },
      }
    }
  }

  _init() {
    this.btnActionArray = null
  }

  set data(playerButtons) {
    this.updateControls(playerButtons)
    const playButton = playerButtons.data.filter((obj) => obj.action === 'centerButtons')
    this.tag('Play').children = playButton.map(button => {
      return {
        type: PlayButton,
        button,
        flexItem: { marginRight: 200 },
        alpha: 1
      }
    })
  }

  set patchTitle(title) {
    this.tag('ContentTitle').patch({
      text: { text: title }
    })
  }

  set updateBtns(controls) {
    this.updateControls(controls)
  }

  setIndexToDefault() {
    this._index = 0
  }

  updateControls(playerControls) {
    this.tag('Background').alpha = 1
    this.tag('PlayerButtons').alpha = 1
    this.tag('Play').alpha = 1
    this._index = this._index > 0 ? this._index : 0
    this.isPlaying = true
    this.buttonsData = playerControls.data.filter((obj) => obj.action !== 'centerButtons')
    this.btnActionArray = this.buttonsData.map((obj) => obj.action)
    let x = 80
    this.tag('PlayerButtons').children = this.buttonsData.map((button, index) => {
      if (index != 0) x = x + 100
      if (button.action == playerControls.action) this._index = index
      button.x = x
      return { type: PlayerButton, button }
    })
    this.tag('Background').patch({
      w: this.buttonsData.length * 100,
      alpha: 1,
    })
    this.tag('PlayerButtons').patch({
      w: this.buttonsData.length * 100,
      alpha: 1,
    })
  }

  _focus() {
    this.patch({ alpha: 1 })
    Router.getActivePage().widgets.progressbar.setSmooth('alpha', 1)
  }

  _unfocus() {
    Router.getActiveHash().includes('player') && Router.getActivePage().iconChangeOnFocusedFunc(this.btnActionArray[null])
  }

  _handleStop() {
    this._handleBack()
  }

  // keeping handleEnter for testing purposes
  _handleEnter() {
    this.$handleFunctionality('enter')
  }

  $handleFunctionality(checkFunction) {
    if (Router.getActivePage().widgets.playercontrols.alpha) {
      switch (checkFunction) {
        case 'enter': {
          Router.getActivePage().$playPause(this.buttonsData[this._index].action)
          break
        }
        case 'left': {
          clearTimeout(this.timer)
          this.patch({ alpha: 1 })
          Router.getActivePage().widgets.progressbar.setSmooth('alpha', 1)
          if (this._index > 0) this._index--
          this.hideProgressBar()
          break
        }
        case 'right': {
          clearTimeout(this.timer)
          this.patch({ alpha: 1 })
          Router.getActivePage().widgets.progressbar.setSmooth('alpha', 1)
          if (this._index < this.buttonsData.length - 1) this._index++
          this.hideProgressBar()
          break
        }
        case 'show|hide': {
          clearTimeout(this.timer)
          this.hideProgressBar()
          break
        }
        default:
          break
      }
    } else {
      clearTimeout(this.timer)
      this.patch({ alpha: 1 })
      Router.getActivePage().widgets.progressbar.setSmooth('alpha', 1)
      this.hideProgressBar()
    }
  }

  hideProgressBar() {
    this.timer = setTimeout(() => {
      this.patch({ alpha: 0 })
      Router.getActivePage().widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

  _handleLeft() {
    this.$handleFunctionality('left')
  }
  _handleRight() {
    this.$handleFunctionality('right')
  }

  _play() {
    clearTimeout(this.timer)
    this.isPlaying = true
    this.timer = setTimeout(() => {
      this.patch({ alpha: 0 })
      Router.getActivePage().widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

  _pause() {
    clearTimeout(this.timer)
    this.isPlaying = false
    this.timer = setTimeout(() => {
      this.patch({ alpha: 0 })
      Router.getActivePage().widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

  _handlePlayPause() {
    Router.getActivePage().$playPause('play')
  }

  _handleForward() {
    Router.getActivePage().$playPause('forward')
  }

  _handleRewind() {
    Router.getActivePage().$playPause('rewind')
  }

  _handlePlay() {
    Router.getActivePage()._handlePlay()
  }

  _handlePause() {
    Router.getActivePage()._handlePause()
  }

  _handleBack() {
    Router.getActivePage()._handleBack()
  }

  _getFocused() {
    Router.getActiveHash().includes('player') && Router.getActivePage().iconChangeOnFocusedFunc(this.btnActionArray[this._index])
    if (this.buttonsData.length != 0) return this.tag('PlayerButtons').children[this._index]
  }
  _handleKey() {
    this.showOrHideButtons()
  }

  _handleUp() {
    this.showOrHideButtons()
    Router.focusWidget('ProgressBar')
  }

  _handleDown() {
    this.showOrHideButtons()
  }

  showOrHideButtons() {
    this.$handleFunctionality('show|hide')
  }
}

class PlayerButton extends Lightning.Component {
  static _template() {
    return {
      Image: {
        mount: 0.5,
      },
    }
  }
  set button(button) {
    this.buttonData = button
    this.patch({
      Image: {
        x: this.buttonData.x,
        y: this.buttonData.y,
        mountX: this.buttonData.mountX,
        mountY: this.buttonData.mountY,
        src: Utils.asset(this.buttonData.src),
      },
    })
  }
}

class PlayButton extends Lightning.Component {
  static _template() {
    return {
      Icon: { },
    }
  }
  set button(button) {
    this.patch({
      Icon: {
        alpha: button.alpha,
        src: Utils.asset(button.src),
      },
    })
  }
}
