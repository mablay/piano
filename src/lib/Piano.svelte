<div class="piano">
  <svg width="100vw" viewBox="0 0 980 120">
    <defs>
      <linearGradient id="gradBlack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stop-color="#222"/>
          <stop offset="1" stop-color="#666"/>
      </linearGradient>
      <linearGradient id="gradWhite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffff0"/>
        <stop offset="1" stop-color="#CCC"/>
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

</div>

<script>
  import { onDestroy } from 'svelte'
  import PianoKey from './PianoKey.svelte'
  import { getNote } from './util'
  import { inMsg } from '../store/midi.js'
  import { synth } from '../store/synth.js'
  import { activeKeys } from '../store/piano.js'

  const indices = [...new Array(84)].map((x, i) => i)

  /**
   * @typedef PianoKeyEvent
   * @property {String} [command] // keyup
   * @property {String} note // C#4
   * @property {Number} [tone] // decimal representation of note: 48
   * @property {Number} velocity // 0 - 127
   * @property {String} source // virtual, keyboard, midi
   *//** */

  const unsubscribe = inMsg.subscribe(value => {
    if (!value) return
    const source = 'midi'
    const [cmd, tone, vel] = value.data
    const note = getNote(tone - 24)
    if (cmd === 144) {
      const velocity = vel / 127
      keyDown({ note, velocity, source, tone })
    } else if (cmd === 128) {
      const velocity = vel / 127
      keyUp({ note, velocity, source, tone })
    }
  })

  onDestroy(() => unsubscribe())

  /** @param {any} event */
	function virtualKeyUp(event) {
    keyUp(event.detail)
	}
  /** @param {any} event */
	function virtualKeyDown(event) {
    keyDown(event.detail)
	}

  /** @param {PianoKeyEvent} event */
  function logKeyEvent ({ note, velocity, source, command = '' }) {
    const src = { virtual: '👆', keyboard: '🔤', midi: '🎹' }[source] || '?'
    const dir = { keydown: '⬇️', keyup: '⬆️' }[command] || '?'
    const force = '▁▂▃▄▅▆▇█'.split('')[Math.floor(velocity * 7)]
    console.log([dir, src, force, ' ', note].join(''))
  }

  /** @param {PianoKeyEvent} event */
	function keyUp({ note, tone, velocity, source }) {
    logKeyEvent({ note, velocity, source, command: 'keyup' })
    synth.keyUp({ note })
    activeKeys.update(x => {
      x.delete((tone || 25) - 24)
      return x
    })
	}
  /** @param {PianoKeyEvent} event */
	function keyDown({ note, tone, velocity, source }) {
    logKeyEvent({ note, velocity, source, command: 'keydown' })
    synth.keyDown({ note, velocity })
    activeKeys.update(x => {
      x.add((tone || 25) - 24)
      return x
    })
    // console.log($activeKeys)
	}
</script>

<style>

</style>
