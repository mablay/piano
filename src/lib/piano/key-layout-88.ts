import { range } from '../util'
  
// define piano key shapes
const w = 24 // width of a white key
const h0 = 0 // start of key
const h1 = 70 // black key height
const h2 = 112 // white key height
const black0 = [[0, h0], [0, h1 - 1], [16, h1 - 1], [16, h0]]
// left end of the 88 keyboard
const whiteA0 = [[0, h0], [0, h2], [w, h2], [w, h1], [18, h1], [18, h0]] // └
// regular white octave
const whiteC = [[0, h0], [0, h2], [w, h2], [w, h1], [13, h1], [13, h0]] // └
const whiteD = [[7, h0], [7, h1], [0, h1], [0, h2], [w, h2], [w, h1], [17, h1], [17, h0]] // ┴
const whiteE = [[w, h0], [w, h2], [0, h2], [0, h1], [11, h1], [11, h0]] // ┘
const whiteF = [[0, h0], [0, h2], [w, h2], [w, h1], [11, h1], [11, h0]] // └
const whiteG = [[5, h0], [5, h1], [0, h1], [0, h2], [w, h2], [w, h1], [15, h1], [15, h0]] // ┴
const whiteA = [[9, h0], [9, h1], [0, h1], [0, h2], [w, h2], [w, h1], [18, h1], [18, h0]] // ┴
const whiteB = [[w, h0], [w, h2], [0, h2], [0, h1], [12, h1], [12, h0]] // ┘
// right end of the 88 keyboard
const whiteC7 = [[w, h0], [w, h2], [0, h2], [0, h0]] // |

function shape2points (shape:number[][], offset:number) {
  return shape.map(([x, y]) => `${x + offset}, ${y}`).join(' ')
}

const octave = [
  { name: 'C', black: false, shape: whiteC, offset: 6 },
  { name: 'C#', black: true, shape: black0, offset: 6 },
  { name: 'D', black: false, shape: whiteD, offset: 2 },
  { name: 'D#', black: true, shape: black0, offset: 6 },
  { name: 'E', black: false, shape: whiteE, offset: -2 },
  { name: 'F', black: false, shape: whiteF, offset: 8 },
  { name: 'F#', black: true, shape: black0, offset: 6 },
  { name: 'G', black: false, shape: whiteG, offset: 4 },
  { name: 'G#', black: true, shape: black0, offset: 6 },
  { name: 'A', black: false, shape: whiteA, offset: 0 },
  { name: 'A#', black: true, shape: black0, offset: 5 },
  { name: 'B', black: false, shape: whiteB, offset: -4 },
]
// first key: A0 | idx: 9
/** @type {import('./key-props').IKeyProp[]} */
const allkeys = range(88).map(index => {
  // MIDI index: 0 = C-2
  // MIDI index: 21 = A0
  const tone = index + 21
  const idx = tone % 12
  const iOctave = Math.floor(tone / 12) - 1
  const { offset, shape, name, black } = octave[idx]
  const dx = offset + index * 14 // 14 = 7 / 12 * 24
  /** @type {import('./key-props').IKeyProp} */
  const key = {
    note: `${name}${iOctave}`,
    // name,
    black,
    // index,
    active: false,
    // tone,
    points: shape2points(shape, dx),
  }
  // replace keys at the edges of the keyboard
  if (index === 0) key.points = shape2points(whiteA0, dx)
  if (index === 87) key.points = shape2points(whiteC7, dx)
  return key
})

export function getKey (note:string) {
  return allkeys.find(key => key.note === note)
}

export const keys = [
  ...allkeys.filter(key => !key.black),
  ...allkeys.filter(key => key.black)
]
