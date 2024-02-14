import { Lightning, Router } from '@lightningjs/sdk'
import { colors } from '../../Themes/theme.js'
import App from '../../App'

export default class ProgressBar extends Lightning.Component {
  static _template() {
    return {
      zIndex: 2,
      w: App.width,
      h: App.height,
      TopGradient: {
        rect: true,
        alpha: 1,
        y: 0,
        x: 0,
        w: App.width,
        h: 150,
        colorTop: colors.playerTopGradientColorUp,
        colorBottom: colors.playerTopGradientColorDown,
      },
      BottomGradient: {
        alpha: 1,
        rect: true,
        x: 0,
        y: 930,
        w: App.width,
        h: 150,
        colorBottom: colors.playerBottomGradientColorDown,
        colorTop: colors.playerBottomGradientColorUp,
      },
      RoundRectangleFirst: {
        x: 80.6,
        y: 969.8,
      },

      RoundRectangleSecond: {
        x: 80.6,
        y: 969.8,
        w: 0,
      },

      ProgressBarIndicator: {
        zIndex: 4,
        alpha: 0,
        mountY: 0.5,
        y: 973,
        texture: Lightning.Tools.getRoundRect(15, 15, 7.5),
        color: colors.fontColor,
      },
      MiniProgressBarIndicator: {
        alpha: 0,
        zIndex: 3,
        mountY: 0.5,
        y: 973,
        x: 63,
        texture: Lightning.Tools.getRoundRect(15, 15, 7.5),
        color: colors.fontColor,
      },

      RunningDuration: {
        x: 1560,
        y: 1007.2,
        text: {
          fontSize: 28,
          textColor: colors.fontColor,
          wordWrapWidth: 1060,
          lineHeight: 30,
          fontFace: 'Bold',
        },
      },

      TotalDuration: {
        x: 1675,
        y: 1007.2,
        text: {
          fontSize: 28,
          textColor: colors.fontColor,
          wordWrapWidth: 1060,
          lineHeight: 30,
          fontFace: 'Bold',
        },
      },
    }
  }

  placeDotToStart() {
    this.patch({
      MiniProgressBarIndicator: {
        x: 63,
      },
    })
  }

  _focus() {
    this.tag('ProgressBarIndicator').patch({
      color: colors.focusBorderColor,
      alpha: 1,
      texture: Lightning.Tools.getRoundRect(20, 20, 10),
    })
    this.tag('MiniProgressBarIndicator').alpha = 0
  }

  _unfocus() {
    this.tag('ProgressBarIndicator').patch({
      smooth: {
        texture: Lightning.Tools.getRoundRect(14, 14, 7),
        alpha: 0,
        color: colors.fontColor,
      },
    })
    this.tag('MiniProgressBarIndicator').alpha = 1
  }

  _handleEnter() {
    if (!Router.getActivePage().widgets.playercontrols.alpha) {
      clearTimeout(this.timer)
      this.patch({ alpha: 1 })
      Router.getActivePage().widgets.playercontrols.setSmooth('alpha', 1)
      this.timer = setTimeout(() => {
        this.patch({ alpha: 0 })
        Router.getActivePage().widgets.playercontrols.setSmooth('alpha', 0)
      }, 5000)
    }
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

  _handleLeft() {
    Router.getActivePage()._handleRewind()
  }

  _handleRight() {
    Router.getActivePage()._handleForward()
  }

  _handleUp() {
    Router.getActivePage().widgets.playercontrols.showOrHideButtons()
  }

  _handleDown() {
    Router.focusWidget('PlayerControls')
  }

  _handleKey() {
    /* TODO document why this method '_handleKey' is empty */
  }

  _handleBack() {
    Router.getActivePage()._handleBack()
  }
  set updatePosition(position) {
    this.patch({
      RoundRectangleFirst: {
        y: position,
      },
      RoundRectangleSecond: {
        y: position,
      },
      RunningDuration: {
        y: position + 50,
      },
      TotalDuration: {
        y: position + 50,
      },
    })
  }

  set dimensions(playerInfo) {
    this.playerWidth = playerInfo[0]
    this.playerHeight = playerInfo[1]
    this.tag('RoundRectangleFirst').patch({
      w: playerInfo[0],
      h: playerInfo[1],
      texture: Lightning.Tools.getRoundRect(playerInfo[0], playerInfo[1], 0, 0, true),
    })
    this.tag('RoundRectangleSecond').patch({
      h: playerInfo[1],
      texture: Lightning.Tools.getRoundRect(0, playerInfo[1], 0, 0, colors.focusBorderColor, true, colors.focusBorderColor),
    })
  }

  updateData(durationData) {
    let playedPercentage
    const currentTimeFormated = this.getTimeFormat(Math.floor(durationData[1]))
    const totalDurationFormated = this.getTimeFormat(Math.floor(durationData[0]))
    this.tag('RoundRectangleFirst').setSmooth('alpha', 0)
    this.tag('RoundRectangleSecond').setSmooth('alpha', 0)
    if (Math.floor(durationData[0]) != 'Infinity') {
      this.tag('RoundRectangleFirst').setSmooth('alpha', 1)
      this.tag('RoundRectangleSecond').setSmooth('alpha', 1)

      this.tag('TotalDuration').patch({
        text: { text: ' / ' + totalDurationFormated },
      })
      this.tag('RunningDuration').patch({
        text: { text: currentTimeFormated },
      })
      const percentage = (Math.floor(durationData[1]) / Math.floor(durationData[0])) * 100
      playedPercentage = this.roundNumber((percentage / 100) * this.playerWidth, 2)
      this.tag('RoundRectangleSecond').patch({
        texture: Lightning.Tools.getRoundRect(
          playedPercentage - 3,
          this.playerHeight,
          0,
          0,
          colors.focusBorderColor,
          true,
          colors.focusBorderColor
        ),
      })
      this.tag('ProgressBarIndicator').x = playedPercentage + 65
      this.tag('MiniProgressBarIndicator').x = playedPercentage + 65
    }
    this.tag('RunningDuration').alpha = 1
    this.tag('TotalDuration').alpha = 1
  }

  getTimeFormat(timeInSeconds) {
    const pad = function (num, size) {
      return ('000' + num).slice(size * -1)
    }
    const time = parseFloat(timeInSeconds).toFixed(3)
    const hours = Math.floor(time / 60 / 60)
    const minutes = Math.floor(time / 60) % 60
    const seconds = Math.floor(time - minutes * 60)
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2)
  }

  roundNumber(num, scale) {
    if (!('' + num).includes('e')) {
      return +(Math.round(num + 'e+' + scale) + 'e-' + scale)
    } else {
      const arr = ('' + num).split('e')
      let sig = ''
      if (+arr[1] + scale > 0) {
        sig = '+'
      }
      const i = +arr[0] + 'e' + sig + (+arr[1] + scale)
      const j = Math.round(i)
      return +(j + 'e-' + scale)
    }
  }

  ClearTimeInterval() {
    this.tag('RunningDuration').patch({
      text: { text: ' ' },
    })
    this.tag('TotalDuration').patch({
      text: { text: ' ' },
    })
  }

  showOrHideProgressBarDot(value) {
    const dotValue = value ? 1 : 0
    this.tag('MiniProgressBarIndicator').alpha = dotValue
    this.tag('ProgressBarIndicator').alpha = dotValue
  }
}
