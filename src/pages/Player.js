import { Lightning, VideoPlayer, Router } from '@lightningjs/sdk'
import { colors } from '../Themes/theme.js'
import {
  forwardImage, pauseHighlight,
  pauseImageCenter, pausePlain,
  playbackURL, playHighlight,
  playImageCenter, playPlain, rewindImage
} from '../helper/globalConstants.js'
import App from '../App.js'
import Dash from './Dash.js'

export default class Player extends Lightning.Component {
  static _template() {
    return {
      alpha: 1,
      rect: true,
      color: colors.background,
      w: App.width,
      h: App.height,
    }
  }

  _init() {
    VideoPlayer.consumer(this)
  }

  _focus() {
    this.patch({ alpha: 1 })
  }

  _unfocus() {
    this.patch({ alpha: 0 })
  }

  initializePlayback() {
    this.widgets.progressbar.ClearTimeInterval()
    this.widgets.playercontrols.patchTitle = ''
    this.widgets.loader.alpha = 0
    this.widgets.progressbar.dimensions = [Player.width, Player.height]
    this.playing = true
    this.skipLength = 10
    this.buttonData = this.buttonsdata()
    this.widgets.playercontrols.setIndexToDefault()
    this.widgets.playercontrols.data = { data: this.buttonData, index: 0 }
    this.widgets.progressbar.dimensions = [Player.width, Player.height]
    this.widgets.progressbar.alpha = 1
    this.status = 'loaded'
    this.dash = Dash.MediaPlayer().create()
    this.videoEl = VideoPlayer._videoEl
    this.play()
  }

  buttonsdata() {
    const buttonData = [
      {
        action: 'play',
        y: 50,
        mountX: 0.5,
        mountY: 0.5,
        color: colors.focusBorderColor,
      },
      {
        action: 'centerButtons',
        alpha: this.widgets.loader.alpha ? 0 : 1,
        src: rewindImage,
      },
      {
        action: 'centerButtons',
        alpha: this.widgets.loader.alpha ? 0 : 1,
        src: this.playing ? pauseImageCenter : playImageCenter
      },
      {
        action: 'centerButtons',
        alpha: this.widgets.loader.alpha ? 0 : 1,
        src: forwardImage,
      },
    ]

    const playButton = buttonData[0]

    if (this.playing) {
      playButton.src = this.actionFocussed === 'play'
        ? pauseHighlight
        : pausePlain
    } else {
      playButton.src = this.actionFocussed === 'play'
        ? playHighlight
        : playPlain
    }

    return buttonData
  }

  iconChangeOnFocusedFunc(action) {
    this.actionFocussed = action
    this.buttonData = this.buttonsdata()
    this.widgets.playercontrols.updateBtns = {
      data: this.buttonData,
    }
  }

  play() {
    this.seeked = false
    this.dash.initialize(this.videoEl, null, false)
    this.dash.attachView(this.videoEl)
    this.dash.attachSource(playbackURL)

    this.videoEl.onplay = () => {
      Router.getActivePage().widgets.progressbar.showOrHideProgressBarDot(false)
    }

    this.videoEl.onloadstart = () => {
      Router.getActivePage().widgets.progressbar.showOrHideProgressBarDot(false)
    }

    this.videoEl.onloadedmetadata = () => {
      Router.getActivePage().widgets.progressbar.updateData([VideoPlayer.duration, VideoPlayer.currentTime])
      Router.getActivePage().widgets.progressbar.showOrHideProgressBarDot(false)
      VideoPlayer.show()
      VideoPlayer.play()
      setTimeout(() => {
        this.patch({ rect: false })
      }, 1000)
      this.buttonData = this.buttonsdata()
      this.widgets.playercontrols.data = {
        data: this.buttonData,
        index: 0,
      }
      Router.focusWidget('PlayerControls')
    }

    this.videoEl.ontimeupdate = () => {
      this.widgets.progressbar.updateData([VideoPlayer.duration, VideoPlayer.currentTime])
      this.barTime = VideoPlayer.currentTime
    }

    this.videoEl.onended = () => {
      Router.getActivePage().widgets.progressbar.showOrHideProgressBarDot(false)
      VideoPlayer.close()
      this.patch({ rect: true })
      Router.back()
      this.dash.destroy()
    }

    this.videoEl.onplaying = () => {
      Router.getActivePage().widgets.progressbar.showOrHideProgressBarDot(true)
    }

    const videoDate = new Date()
    this.videoStartTime = videoDate
    setTimeout(() => {
      this.widgets.playercontrols.setSmooth('alpha', 0)
      this.widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

  _handleBack() {
    this.widgets.loader.alpha = 1
    this.buttonData = this.buttonsdata()
    this.widgets.playercontrols.data = { data: this.buttonData, index: 0 }
    this.widgets.progressbar.alpha = 0
    this.widgets.playercontrols.alpha = 0
    this.dash.destroy()
    VideoPlayer.close()
    this.patch({ rect: true })
    Router.back()
  }

  $backDetails() {
    this.dash.destroy()
    VideoPlayer.close()
    this.patch({ rect: true })
  }

  _getFocused() {
    return Router.focusWidget('PlayerControls')
  }

  _handlePlay() {
    clearTimeout(this.timer)
    this.widgets.loader.alpha = 0
    this.widgets.progressbar.setSmooth('alpha', 1)
    this.widgets.playercontrols.setSmooth('alpha', 1)
    this.widgets.playercontrols._play()
    VideoPlayer.play()
    this.status = 'play'
    this.playing = true
    this.hideControls()
  }

  hideControls() {
    this.buttonData = this.buttonsdata()
    this.widgets.playercontrols.data = { data: this.buttonData, index: 0 }
    this.timer = setTimeout(() => {
      this.widgets.playercontrols.setSmooth('alpha', 0)
      this.widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

  _handlePause() {
    clearTimeout(this.timer)
    this.widgets.loader.alpha = 0
    this.widgets.progressbar.setSmooth('alpha', 1)
    this.widgets.playercontrols.setSmooth('alpha', 1)
    this.widgets.playercontrols._pause()
    VideoPlayer.pause()
    this.status = 'pause'
    this.playing = false
    this.hideControls()
  }

  _handlePlayPause() {
    this.status = this.status == 'pause' ? 'play' : 'pause'
    clearTimeout(this.timer)
    this.widgets.loader.alpha = 0
    this.widgets.progressbar.setSmooth('alpha', 1)
    this.widgets.playercontrols.setSmooth('alpha', 1)

    if (this.status == 'pause') {
      VideoPlayer.pause()
      this.playing = false
    } else {
      VideoPlayer.play()
      this.playing = true
    }
    this.buttonData = this.buttonsdata()
    this.widgets.playercontrols.data = { data: this.buttonData, index: 0 }
    this.timer = setTimeout(() => {
      this.widgets.playercontrols.setSmooth('alpha', 0)
      this.widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

  _handleStop() {
    clearTimeout(this.timer)
    this.widgets.progressbar.setSmooth('alpha', 1)
    this.widgets.playercontrols.setSmooth('alpha', 1)
    VideoPlayer.close()
    this.patch({ rect: true })
    this.timer = setTimeout(() => {
      this.widgets.playercontrols.setSmooth('alpha', 0)
      this.widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

  _handleRewind() {
    this.showControls()
    this.barTime = VideoPlayer.currentTime - this.skipLength
    VideoPlayer.pause()
    if (VideoPlayer.currentTime <= 0 || this.barTime < 0) {
      this.widgets.progressbar.updateData([VideoPlayer.duration, 0])
      VideoPlayer.seek(0)
    } else {
      this.widgets.progressbar.updateData([VideoPlayer.duration, this.barTime])
      VideoPlayer.seek(Math.ceil(this.barTime))
    }
    this.startPlayback()
  }

  _handleForward() {
    this.showControls()
    VideoPlayer.pause()
    if (VideoPlayer.currentTime + this.skipLength >= VideoPlayer.duration - 5) {
      this.widgets.progressbar.updateData([VideoPlayer.duration, VideoPlayer.duration - 5])
      VideoPlayer.seek(VideoPlayer.duration - 5)
    } else {
      this.barTime = VideoPlayer.currentTime + this.skipLength
      VideoPlayer.seek(this.barTime)
      this.widgets.progressbar.updateData([VideoPlayer.duration, this.barTime])
    }
    this.startPlayback()
  }

  showControls() {
    clearTimeout(this.timer)
    this.widgets.progressbar.setSmooth('alpha', 1)
    this.widgets.playercontrols.setSmooth('alpha', 1)
    this.widgets.loader.alpha = 1
  }

  startPlayback() {
    this.playing = true
    this.buttonData = this.buttonsdata()
    this.widgets.playercontrols.data = { data: this.buttonData, index: 0 }
    this.timer = setTimeout(() => {
      this.widgets.loader.alpha = 0
      VideoPlayer.play()
      this.status = 'play'
      this.playing = true
      this.widgets.playercontrols.setSmooth('alpha', 0)
      this.widgets.progressbar.setSmooth('alpha', 0)
    }, 2000)
  }

  $playPause(value) {
    switch (value) {
      case 'play': {
        this._handlePlayPause()
        break
      }
      case 'rewind': {
        this._handleRewind()
        break
      }
      case 'forward': {
        this._handleForward()
        break
      }
      default: {
        break
      }
    }
  }

  $videoPlayerEnded() {
    setTimeout(() => {
      VideoPlayer.close()
      this.dash.destroy()
      Router.back()
    }, 1000)
  }

  $videoPlayerPlay() {
    this.widgets.playercontrols._play()
  }

  $videoPlayerPause() {
    this.widgets.playercontrols._pause()
  }

  static get width() {
    return 1820
  }

  static get height() {
    return 7
  }

  clearTimer() {
    clearTimeout(this.timer)
    this.widgets.progressbar.setSmooth('alpha', 1)
    this.widgets.playercontrols.setSmooth('alpha', 1)
    this.timer = setTimeout(() => {
      this.widgets.playercontrols.setSmooth('alpha', 0)
      this.widgets.progressbar.setSmooth('alpha', 0)
    }, 5000)
  }

}
