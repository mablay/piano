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
      keyDown({ note, velocity, source })
    } else if (cmd === 128) {
      const velocity = vel / 127
      keyUp({ note, velocity, source })
    }
  })

  onDestroy(() => unsubscribe())

  const indices = [...new Array(84)].map((x, i) => i)

  /** @param {any} event */
	function virtualKeyUp(event) {
    keyUp(event.detail)
	}
  /** @param {any} event */
	function virtualKeyDown(event) {
    keyDown(event.detail)
	}

  const amplitude = '▁▂▃▄▅▆▇█'.split('')
  /** @type {{ [source:string]: string }} */
  const sourceIcon = {
    virtual: '👆',
    keyboard: '⌨️',
    midi: '🎹'
  }

  /** @param {PianoKeyEvent} event */
  function logKeyEvent ({ note, velocity, source }) {
    const src = sourceIcon[source] || '?'
    const i = Math.floor(velocity * 7)
    const force = amplitude[i]
    console.log(`${src}${note}⬇️${force}`)
  }

  /** @param {PianoKeyEvent} event */
	function keyUp({ note, velocity, source }) {
    logKeyEvent({ note, velocity, source })
    synth.keyUp({ note })
	}
  /** @param {PianoKeyEvent} event */
	function keyDown({ note, velocity, source }) {
    logKeyEvent({ note, velocity, source })
    synth.keyDown({ note, velocity })
	}
</script>

<style>

</style>
