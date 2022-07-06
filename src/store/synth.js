import { writable } from 'svelte/store'

export const synthLoaded = writable(false)
/** @type { import('@tonejs/piano').Piano } */
export let synth

export async function loadSynth () {
  console.log('loading synth...')
  const start = Date.now()
  const { Piano } = await import('@tonejs/piano')
  synth = new Piano({
    velocities: 5 // 1 - 16
  })
  //connect it to the speaker output
  synth.toDestination()

  await synth.load()
  synthLoaded.set(true)
  console.log('synth loaded!')
  synth.keyDown({
    note: 'C4'
  })
  console.log('synth loading time:', (Date.now() - start) / 1000)
}

// export const piano = new Piano({
//   velocities: 5 // 1 - 16
// })
// //connect it to the speaker output
// piano.toDestination()

// piano.load().then(() => {
//   console.log('piano loaded!')
//   piano.keyDown({
//     note: 'C4'
//   })
// })

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