import { Lightning } from '@lightningjs/sdk'
import { colors } from '../../Themes/theme'

export default class CircleIndicator extends Lightning.Component {
  static _template() {
    return {
      RoundRectangle: {
        texture: Lightning.Tools.getRoundRect(24, 24, 12, 2, colors.fontColor, true, colors.fontColor),
      },
    }
  }
}
