import { Language, Lightning, Utils } from '@lightningjs/sdk'
import App from '../../App'
import { colors, fontsizes } from '../../Themes/theme'
import DynamicButton from '../ProfileButtons/DynamicButton'
import { InlineContent } from '@lightningjs/ui-components'
import { fallBackBanner, contentImagesFolder, commaSeparatedwithSpaces } from '../../helper/globalConstants'

export default class BannerItem extends Lightning.Component {
  static _template() {
    return {
      BannerBgImage: {
        x: 761.7,
        w: 1158.3,
        h: 625,
        y: 0,
        zIndex: 2,
      },
      TopGradient: {
        zIndex: 1,
        x: 160,
        y: 0,
        w: 1920,
        h: 654,
        rect: true,
        color: colors.background,
      },
      BottomGradient: {
        x: 160,
        y: 618,
        w: App.width,
        h: 640,
        rect: true,
        color: colors.background,
      },
      TopLeftGradient: {
        zIndex: 2,
        x: 761.7,
        y: 0,
        w: 800,
        h: 654,
        rect: true,
        colorRight: colors.bannerImgGradient,
        colorLeft: colors.background,
      },
      ContentContainer: {
        x: 250,
        y: 200,
        zIndex: 3,
        flex: { direction: 'column' },
        Title: {
          text: {
            fontSize: fontsizes.bannerItemTitle,
            textColor: colors.fontColor,
            maxLines: 1,
            maxLinesSuffix: '...',
            wordWrapWidth: 700,
            fontFace: 'Bold',
          },
          flexItem: { marginBottom: 10 }
        },
        TitleEN: {
          text: {
            fontSize: 40,
            textColor: colors.fontColor,
            maxLines: 1,
            maxLinesSuffix: '...',
            wordWrapWidth: 700,
            fontFace: 'Bold',
          },
          flexItem: { marginBottom: 10 }
        },
        TagsData: {
          type: InlineContent,
          justify: 'flex-start',
          content: [],
          customStyleMappings: {
            textStyle: {
              fontSize: fontsizes.bannerItemMetaContainer,
              textColor: colors.fontColor,
              textAlign: 'left',
              fontFace: 'Regular',
            },
          },
          flexItem: { marginBottom: 30 }
        },
        Description: {
          text: {
            wordWrapWidth: 750,
            textColor: colors.fontColor,
            fontSize: fontsizes.bannerItemMetaContainer,
            lineHeight: 30,
            maxLines: 3,
            maxLinesSuffix: '...',
          },
          flexItem: { marginBottom: 10 }
        },
        MoreDetails: {},
      },
    }
  }

  _getFocused() {
    return this.tag('MoreDetails').children[this._index]
  }

  set item(data) {
    if (data.showMoreInfo) {
      this._index = 0
      this.bData = [
        {
          height: 64,
          width: 186,
          radius: 10,
          text: Language.translate('view_more'),
          color: colors.fontColor,
          layout: 'rect',
        },
      ]
      this.tag('MoreDetails').children = this.bData.map((button) => {
        return {
          type: DynamicButton,
          h: 55,
          borderRadius: 2,
          textPadding: 30,
          label: button.text,
          withoutTexture: false,
          flexItem: { margin: 20, alignSelf: 'stretch', maxHeight: 100 },
        }
      })
    }
    const slicedTags = data.tags?.split(',').slice(0, 3).join(',')
    const tagsData = data.tags ? commaSeparatedwithSpaces(slicedTags) : ''
    this.patch({
      BannerBgImage: {
        src: data.banner_image
          ? Utils.asset(contentImagesFolder + data.banner_image)
          : Utils.asset(fallBackBanner),
      },
      ContentContainer: {
        Title: {
          visible: data.title ? true : false,
          text: {
            text: data.title || '',
            wordWrapWidth: 700
          },
        },
        TitleEN: {
          visible: data.title_en ? true : false,
          text: {
            text: data.title_en || '',
            wordWrapWidth: 700
          },
        },
        TagsData: {
          content: [
            { text: data.publish_time, style: 'textStyle' },
            {
              text: tagsData ? ` |  ${tagsData}` : '',
              style: 'textStyle',
            },
            {
              text: data.duration ? ` |  ${data.duration}` : '',
              style: 'textStyle',
            }
          ],
        },
        Description: {
          visible: data.description && data.is_livechannel ? true : false,
          text: { text: data.description },
        }
      }
    })
  }

}
