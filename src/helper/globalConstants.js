import { Language } from '@lightningjs/sdk'
import { colors } from '../Themes/theme'

export const emptyPageIcon = 'globe.png'
export const contentImagesFolder = 'content_images/'
export const imagesFolder = 'images/'
export const fallBackPoster = 'images/fallback_poster.png'
export const fallBackBanner = 'images/fallback_banner.png'
export const backIcon = 'backIcon.png'
export const playbackURL = 'https://cdn.bitmovin.com/content/assets/art-of-motion-dash-hls-progressive/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'
export const activeCategory = 'activeCategory'
export const stateInfo = 'stateInfo'
export const bannerKey = 'banner'
export const gridStateInfo = 'gridStateInfo'
export const rewindImage = 'images/rewind-center.png'
export const forwardImage = 'images/forward-center.png'
export const pauseImageCenter = 'images/pause-center.png'
export const playImageCenter = 'images/play-center.png'
export const pauseHighlight = 'images/highlight_pause.png'
export const playHighlight = 'images/highlight_play.png'
export const playPlain = 'images/plain_play.png'
export const pausePlain = 'images/plain_pause.png'
export const viewMoreImage = 'images/view_more.png'

export let scroll = 0

export function setScroll(inputVal) {
  scroll = inputVal
}

export let categories = []

export function setCategories(inputData) {
  categories = inputData
}

export const getButtons = () => {
  return [{
    text: Language.translate('watch_now_text'),
    layout: 'border',
    Icon: '',
    x: 90,
    y: 430,
    h: 62,
    w: 280,
    color: colors.fontColor,
    borderRadius: ''
  }]
}

export const commaSeparatedwithSpaces = (string) => {
  return string.split(',').map(tag => tag.trim()).join(', ')
}
