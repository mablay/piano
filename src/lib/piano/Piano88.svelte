<svelte:window
  on:keydown={keyboardHandler}
  on:keyup={keyboardHandler}
/>

<div class="piano">
  <Timeline88 />
  <svg class="key-layout" viewBox="0 0 1248 112">
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
    {#each keys as key}
    <PianoKey
      key={key}
      on:virtualkeyup={virtualKeyUp}
      on:virtualkeydown={virtualKeyDown}
    />
    {/each}
  </svg>
</div>


<script>
  import Timeline88 from './Timeline88.svelte'
  import PianoKey from './PianoKey.svelte'
  import { journalTone, time } from './timeline'
  import { getNote } from '../util'
  import { writable } from 'svelte/store'
  import { keys } from './key-layout-88'
  import { synth } from '../../store/synth.js'
  
  export const activeKeys = writable(new Set())

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

  /*
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
  */

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
    const tone = i + 12 * 5 - 4
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
    const keyIndex = keys.findIndex(key => key.note === event.note)
    if (~keyIndex) keys[keyIndex].active = false
    journalTone(event.tone, $time, true)
	}
  /** @param {PianoKeyEvent} event */
	function keyDown(event) {
    logKeyEvent({ ...event, command: 'keydown' })
    synth.keyDown(event)
    const keyIndex = keys.findIndex(key => key.note === event.note)
    if (~keyIndex) keys[keyIndex].active = true
    journalTone(event.tone, $time)
	}
</script>

<style>
.piano {
  position: fixed;
  bottom: 0;
  width: 100vw;
}

.key-layout {
  width: 100%;
  display: block;
}
</style>
