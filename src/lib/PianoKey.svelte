<polygon
  on:mousedown={keyDown}
  on:mouseenter={mouseEnter}
  on:mouseup={keyUp}
  on:mouseleave={mouseLeave}
  bind:this={polygon}
  class="piano-key"
  class:black="{black}"
  class:active="{active}"
  x-data={index}
  x-note={note}
  points={points}
/>

<script>
import { activeKeys } from '../store/piano.js'
import { createEventDispatcher } from 'svelte'
import { getNote } from './util.js';
const dispatch = createEventDispatcher()

/** @type {boolean} indicates key color */
// export let black = false
/** @type {number} indicates key position */
export let index = 0
const tone = index + 21
const note = getNote(tone)

/** @type {any} */
let polygon
$: active = $activeKeys.has(index)

/** @param {any} event */
function mouseEnter (event) {
  if (event.which === 1) {
    // console.log('mouseEnter', event)
    keyDown()
  }
}

/** @param {any} event */
function mouseLeave (event) {
  if (event.which === 1) {
    // console.log('mouseleave')
    keyUp()
    polygon.style.display = 'none'
    polygon.style.display = 'block'
  }
}

const blackKey = { black: true, polygon: [[4, 1], [4, 69], [16, 69], [16, 1]] }
// left end of the 88 keyboard
const whiteA0 = { black: false, polygon: [[1, 1], [1, 111], [20, 111], [20, 70], [14, 70], [14, 1]] } // └
const whiteB0 = { black: false, polygon: [[20, 1], [20, 111], [0, 111], [0, 70], [8, 70], [8, 1]] } // ┘
// regular white octave
const whiteC = { black: false, polygon: [[0, 1], [0, 111], [20, 111], [20, 70], [12, 70], [12, 1]] } // └
const whiteD = { black: false, polygon: [[6, 1], [6, 70], [0, 70], [0, 111], [20, 111], [20, 70], [14, 70], [14, 1]] } // ┴
const whiteE = { black: false, polygon: [[20, 1], [20, 111], [0, 111], [0, 70], [8, 70], [8, 1]] } // ┘
const whiteF = { black: false, polygon: [[0, 1], [0, 111], [20, 111], [20, 70], [11, 70], [11, 1]] } // └
const whiteG = { black: false, polygon: [[5, 1], [5, 70], [0, 70], [0, 111], [20, 111], [20, 70], [13, 70], [13, 1]] } // ┴
const whiteA = { black: false, polygon: [[7, 1], [7, 70], [0, 70], [0, 111], [20, 111], [20, 70], [15, 70], [15, 1]] } // ┴
const whiteB = { black: false, polygon: [[20, 1], [20, 111], [0, 111], [0, 70], [9, 70], [9, 1]] } // ┘
// right end of the 88 keyboard
const whiteC7 = { black: false, polygon: [[20, 1], [20, 111], [0, 111], [0, 1]] } // |

const octaveKeys = [
  { ...whiteC, offset: 0 },
  { ...blackKey, offset: 9 },
  { ...whiteD, offset: 20 },
  { ...blackKey, offset: 31 },
  { ...whiteE, offset: 40 },
  { ...whiteF, offset: 60 },
  { ...blackKey, offset: 68 },
  { ...whiteG, offset: 80 },
  { ...blackKey, offset: 90 },
  { ...whiteA, offset: 100 },
  { ...blackKey, offset: 112 },
  { ...whiteB, offset: 120 }
]

const { points, black } = getKey(index)

/**
 * index 0  = A0 = tone 21
 * index 87 = C8 = tone 108
 * The Arturia KeyLab Essential 88 begins with A0
 * one octave has 7 white keys (70px)
 * @param {number} i key index
 */
function getKey (i) {
  let key
  if (i === 0) {
    key = { ...whiteA0, offset: 140 }
  } else if (i === 1) {
    key = { ...blackKey, offset: 151 }
  } else if (i === 2) {
    key = { ...whiteB0, offset: 160 }
  } else if (i === 87) {
    key = { ...whiteC7, offset: +40 }
  } else {
    key = octaveKeys[(i - 3) % 12]
    key.offset = key.offset + 40
  }
  const { offset, black, polygon } = key
  const dx = Math.floor((i - 3) / 12) * 7 * 20 + offset
  const points = polygon.map(([x, y]) => `${x + dx}, ${y}`).join(' ')
  return { points, black }
}

function keyDown () {
  dispatch('virtualkeydown', {
    tone,
    note,
    velocity: 0.5,
    source: 'virtual'
  })
}

function keyUp () {
  dispatch('virtualkeyup', {
    tone,
    note,
    velocity: 0,
    source: 'virtual'
  })
}
</script>

<style>
.piano-key {
  position: relative;
  cursor: pointer;
  fill:ivory;
  stroke:#AAA;
  stroke-width:1;
  /* fill-rule:evenodd; */
}
.piano-key:hover {
  /* fill: url(#gradWhite); */
  stroke:#888;
}
/* .piano-key:active,  */
.piano-key.active {
  /* fill: skyblue; */
  fill: url(#gradWhite);
}


.piano-key.black {
  filter: drop-shadow( 1px 2px 2px rgba(0, 0, 0, .7));
  fill: url(#gradBlack);
  stroke: black;
}
.piano-key.black:hover {
  /* fill:#222; */
  stroke: #222;
}
/* .piano-key.black:active,  */
.piano-key.black.active {
  /* fill: black; */
  fill: url(#gradBlackPressed);
  filter: drop-shadow( 1px 1px 2px rgba(0, 0, 0, .7));

  /* fill: skyblue; */
  /* filter: none; */
}
</style>