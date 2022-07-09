<svelte:window
  on:keydown={keyboardHandler}
  on:keyup={keyboardHandler}
/>

<svg class="piano" viewBox="0 0 1040 112">
  <defs>
    <linearGradient id="gradBlack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.7" stop-color="#222"/>
        <stop offset="1" stop-color="#666"/>
    </linearGradient>
    <linearGradient id="gradBlackPressed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.2" stop-color="#222"/>
      <stop offset="1" stop-color="#888"/>
  </linearGradient>
  <linearGradient id="gradWhite" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.2" stop-color="#fffff0"/>
      <stop offset="1" stop-color="#DDD"/>
  </linearGradient>
</defs>    
  {#each indices as index}
  <PianoKey
    index={index}
    on:virtualkeyup={virtualKeyUp}
    on:virtualkeydown={virtualKeyDown}
  />
  {/each}
</svg>

<script>
  import { onDestroy } from 'svelte'
  import PianoKey from './PianoKey.svelte'
  import { getNote } from './util'
  import { inMsg } from '../store/midi.js'
  import { synth } from '../store/synth.js'
  import { activeKeys } from '../store/piano.js'

  /** @param {Number} len */
  const range = len => [...new Array(len)].map((_, i) => i)
  /*
  To align key index mapping with MIDI tones:

  | Hz      | Note   | Tone  | Index
  |---------|--------|-------|------
  |   27.50 |   A0   |   21  |   0
  |  261.63 |   C4   |   60  |  39
  | 4186.01 |   C8   |  108  |  87

  Hz: physical frequency
  Note: name of the note by MIDI standard, not Yamaha!
  Tone: The midi tone value as sent by an Arturia KeyLab Essential 88 keyboard conroller
  Index: position of the piano key from left to right
  */
  
  // Piano keys in this component are rendered via SVG polygons.
  // Black keys shall drop shadows on the white keys using CSS.
  // That requires us to put the black key SVG elements after the
  // white key SVG elements in the DOM. Otherwise the CSS filter: drop-shadow(...)
  // rule will cast incorrect shadows.
  // That's why we shuffle the indices in such a funny way.
  // Notice:
  // The piano keys and their indices are only shuffled in the DOM,
  // on screen they are neatly in order from left to right 0 - 87.

  /** shuffle piano key DOM order so black keys cast correct shadows. */
  const indices = [
    0, 2, 1,
    ...range(7).flatMap((_, i) => [0, 2, 4, 5, 7, 9, 11, 1, 3, 6, 8, 10].map(y => 3 + y + i * 12)),
    87
  ]
  // const indices = [...new Array(7)].flatMap((x, i) => [0, 2, 4, 5, 7, 9, 11, 1, 3, 6, 8, 10].map(y => 24 + y + i * 12))
  // indices.unshift(21, 23, 22)
  // indices.push(108)
  

  /**
   * @typedef PianoKeyEvent
   * @property {String} [command] // keyup
   * @property {String} note // C#4
   * @property {Number} [tone] // decimal representation of note: 48
   * @property {Number} velocity // 0 - 127
   * @property {String} source // virtual, keyboard, midi
   *//** */

  /* *************************************** 
    - MIDI Keyboard -
    Events usually caused by an external USB keyboard controller
    Tested with Arturia KeyLab Essential 88
  *************************************** */

  const unsubscribe = inMsg.subscribe(value => {
    if (!value) return
    const source = 'midi'
    const [cmd, ctrltone, vel] = value.data
    if (cmd === 144) {
      const velocity = vel / 127
      const tone = ctrltone
      const note = getNote(tone) // TODO: check if tone mapping is accurate
      keyDown({ note, velocity, source, tone })
    } else if (cmd === 128) {
      const velocity = vel / 127
      const tone = ctrltone
      const note = getNote(tone) // TODO: check if tone mapping is accurate
      keyUp({ note, velocity, source, tone })
    }
  })
  onDestroy(() => unsubscribe())

  /* *************************************** 
    - Virtual Keyboard -
    Events caused by clicking or tapping on
    the PianoKey.svelte components
  *************************************** */

  /** @param {any} event */
	function virtualKeyUp(event) {
    keyUp(event.detail)
	}
  /** @param {any} event */
	function virtualKeyDown(event) {
    keyDown(event.detail)
	}

  /* *************************************** 
    - Keyboard -
    Events from your computer keyboard
    QWERTY & QWERTZ compatible mapping:
        Keyboard                Note
      r t   u i o    =>   C# D#    F# G# A#
     d f g h j k l   =>  C  D  E  F  G  A  B
  *************************************** */

  /** @param {any} event */
  function keyboardHandler (event) {
    if (event.repeat) return
    if (!['keyup', 'keydown'].includes(event.type)) return
    const source = 'keyboard'
    const command = event.type
    const i = 'qawsdrftghujikol'.split('').indexOf(event.key)
    if (i < 0) return
    const tone = i + 12 * 7 - 4
    const note = getNote(tone)
    const velocity = 0.6
    // console.log('keyboardHandler', event)
    if (command === 'keyup') keyUp({ note, tone, velocity, source })
    if (command === 'keydown') keyDown({ note, tone, velocity, source })
  }

  /** @param {PianoKeyEvent} event */
  function logKeyEvent ({ note, velocity, source, command = '', tone }) {
    const src = { virtual: '👆', keyboard: '🔤', midi: '🎹' }[source] || '?'
    const dir = { keydown: '⬇️', keyup: '⬆️' }[command] || '?'
    const force = '▁▂▃▄▅▆▇█'.split('')[Math.floor(velocity * 7)]
    console.log([dir, src, force, ' ', note].join(''), 'tone:', tone)
  }

  /** @param {PianoKeyEvent} event */
	function keyUp(event) {
    logKeyEvent({ ...event, command: 'keyup' })
    synth.keyUp(event)
    activeKeys.update(x => {
      x.delete((event.tone || 25) - 21)
      return x
    })
	}
  /** @param {PianoKeyEvent} event */
	function keyDown(event) {
    logKeyEvent({ ...event, command: 'keydown' })
    synth.keyDown(event)
    activeKeys.update(x => {
      x.add((event.tone || 25) - 21)
      return x
    })
    // console.log($activeKeys)
	}
</script>

<style>
.piano {
  position: fixed;
  bottom: 0;
  width: 100vw;
}
</style>
