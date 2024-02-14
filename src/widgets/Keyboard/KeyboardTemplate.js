const template = {
  keyWidth: 70,
  keyHeight: 70,
  horizontalSpacing: 12,
  verticalSpacing: 28,
  layouts: {
    search: {
      rows: [
        {
          keys: [{ c: 'a' }, { c: 'b' }, { c: 'c' }, { c: 'd' }, { c: 'e' }, { c: 'f' }],
        },
        {
          keys: [{ c: 'g' }, { c: 'h' }, { c: 'i' }, { c: 'j' }, { c: 'k' }, { c: 'l' }],
        },
        {
          keys: [{ c: 'm' }, { c: 'n' }, { c: 'o' }, { c: 'p' }, { c: 'q' }, { c: 'r' }],
        },
        {
          keys: [{ c: 's' }, { c: 't' }, { c: 'u' }, { c: 'v' }, { c: 'w' }, { c: 'x' }],
        },
        {
          keys: [{ c: 'y' }, { c: 'z' }, { c: '1' }, { c: '2' }, { c: '3' }, { c: '4' }],
        },
        {
          keys: [{ c: '5' }, { c: '6' }, { c: '7' }, { c: '8' }, { c: '9' }, { c: '0' }],
        },
        {
          keys: [
            { action: 'backspace', w: 140, source: 'images/backspace.png' },
            { action: 'space', source: 'images/space.png', w: 140 },
            { action: 'delete', w: 120, source: 'images/trash.png' },
          ],
        },
      ],
    }
  }
}

export default template
