<polygon
  on:mousedown={keyPress}
  on:mouseup={keyUp}
  class="piano-key"
  class:black="{black}"
  points={points}
/>

<script>
import { synth } from '../store/synth.js'
import { createEventDispatcher } from 'svelte'
import { getNote } from './util.js';
const dispatch = createEventDispatcher()

/** @type {boolean} indicates key color */
// export let black = false
/** @type {number} indicates key position */
export let index = 0

const whiteLeft = { black: false, polygon: [[1, 2], [1, 79], [19, 79], [19, 50], [12, 50], [12, 2]] } // └
const whiteMiddle = { black: false, polygon: [[6, 2], [6, 50], [1, 50], [1, 79], [19, 79], [19, 50], [14, 50], [14, 2]] } // ┴
const whiteRight = { black: false, polygon: [[19, 2], [19, 79], [1, 79], [1, 50], [8, 50], [8, 2]] } // ┘
const blackKey = { black: true, polygon: [[4, 2], [4, 49], [16, 49], [16, 2]] }

const octaveKeys = [
  { ...whiteLeft, offset: 0 },
  { ...blackKey, offset: 10 },
  { ...whiteMiddle, offset: 20 },
  { ...blackKey, offset: 30 },
  { ...whiteRight, offset: 40 },
  { ...whiteLeft, offset: 60 },
  { ...blackKey, offset: 70 },
  { ...whiteMiddle, offset: 80 },
  { ...blackKey, offset: 90 },
  { ...whiteMiddle, offset: 100 },
  { ...blackKey, offset: 110 },
  { ...whiteRight, offset: 120 }
]

const { points, black } = getKey(index)

/**
 * one octave has 7 white keys (70px)
 * @param {number} i key index
 */
function getKey (i) {
  const { offset, black, polygon } = octaveKeys[i % 12]
  const dx = Math.floor(i / 12) * 7 * 20 + offset
  const points = polygon.map(([x, y]) => `${x + dx}, ${y * 1.4}`).join(' ')
  return { points, black }
}

/** @param {Event} event */
function keyPress (event) {
  dispatch('virtualkeydown', {
    note: getNote(index),
    velocity: 1,
    source: 'virtual'
  })
  // console.log(`🖱️${note}⬇️`)
  // console.log(`🔤${note}⬇️`)
  // console.log(`🎹${note}⬇️`)
  // synth.keyDown({ note })
}

/** @param {Event} event */
function keyUp (event) {
  dispatch('virtualkeyup', {
    note: getNote(index),
    velocity: 0,
    source: 'virtual'
  })
  // console.log(`🖱️${note}⬆️`)
  // console.log(`🔤${note}⬆️`)
  // console.log(`🎹${note}⬆️`)
  // synth.keyUp({ note })
}
</script>

<style>
.piano-key {
  cursor: pointer;
  fill:ivory;
  stroke:grey;
  stroke-width:1;
  /* fill-rule:evenodd; */
}
.piano-key:hover {
  fill: url(#gradWhite);
}
.piano-key:active {
  fill: skyblue;
}


.piano-key.black {
  fill:#222;
  stroke:black;
}
.piano-key.black:hover {
  fill: url(#gradBlack);
}
.piano-key.black:active {
  fill: skyblue;
}
</style>