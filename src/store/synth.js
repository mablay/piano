import { writable } from 'svelte/store'

export const synthLoaded = writable(false)

/**
 * C4 = 261.63 Hz
 * It seems only Yamaha refers to that frequency as C3.
 * That cost me 3h because it was super confusing.
 * I'm not going with Yamaha here but with the rest of the
 * world and especially with the MIDI standard.
 * @type { import('@tonejs/piano').Piano } */
export let synth

export async function loadSynth () {
  console.log('loading synth...')
  const start = Date.now()
  // @ts-ignore silence tone.js console version logging
  window.TONE_SILENCE_LOGGING = true
  const { Piano } = await import('@tonejs/piano')
  synth = new Piano({
    velocities: 5 // 1 - 16
  })
  //connect it to the speaker output
  synth.toDestination()

  await synth.load()
  synthLoaded.set(true)
  console.log('synth loaded!')
  // synth.keyDown({ note: 'C4' })
  console.log('synth loading time:', (Date.now() - start) / 1000)
}

/**
 * WebAudio can only be initiated as response to a user action
 */
export function loadPianoOnFirstUserAction () {
  const onceListeners = 'mousedown mouseup touchend click'.split(' ')
  function loadPianoOnce () {
    console.log('🎹 Load piano once!')
    onceListeners.forEach(name => document.body.removeEventListener(name, loadPianoOnce))
    loadSynth()
  }
  onceListeners.forEach(name => document.body.addEventListener('click', loadPianoOnce, { once: true }))
}