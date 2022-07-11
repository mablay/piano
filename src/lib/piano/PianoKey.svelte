<polygon
  on:mousedown={keyDown}
  on:mouseenter={mouseEnter}
  on:mouseup={keyUp}
  on:mouseleave={mouseLeave}
  bind:this={el}
  class="piano-key"
  class:black="{key.black}"
  class:active="{key.active}"
  x-note={key.note}
  points={key.points}
/>

<script>
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()

/** @type {boolean} indicates key color */
// export let black = false
/** @type {number} indicates key position */
// export let index = 0

/** @typedef KeyInfo
 * @property {String} note MIDI name of the note: C4, D#6, Eb3, Ab-1
 * @property {String} name C, C#, D, D#, E, F, F#, G, G#, A, A#, B
 * @property {Number} idx index of the key within the octave 0 - 11
 * @property {Number} octave MIDI octave of the note: -2, 4, 7
 * @property {Number} [tone] MIDI controller value corresponding to MIDI note
 * @property {Number} position piano key position from left to right
 * @property {Number} offset individual key offset in pixel, since they are not equally distributed
 * @property {Boolean} black true: black key, false: white key, default: false
 * @property {String} shape visual shape: C, D, E, F, G, A, B, BLACK, A0, C7
*/

/** @type {import('./key-props').IKeyProp} */
export let key
/** @type {Boolean} */
// export let active

/** @type {any} */
let el
// $: active = $activeKeys.has(index)
// $: tone = key.tone
// $: points = key.shape.map(([x, y]) => `${x + key.offset}, ${y}`).join(' ')
$: note = key.note

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
    el.style.display = 'none'
    el.style.display = 'block'
  }
}

function keyDown () {
  key.active = true
  dispatch('virtualkeydown', {
    // tone,
    note,
    velocity: 0.5,
    source: 'virtual'
  })
}

function keyUp () {
  key.active = false
  dispatch('virtualkeyup', {
    // tone,
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