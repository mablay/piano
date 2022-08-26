<div>
  <Staff
    staffNote={staffNote}
    activeNote={activeNote}
    notesMatch={notesMatch}
  />
</div>

<script>
import Staff from '$lib/Staff.svelte'
import { onDestroy } from 'svelte'
import { activeKeys } from '../store/piano.js'
import { getNote } from './util.js'
import { writable } from 'svelte/store'

const staffNote = new writable('C4')
const activeNote = new writable('')
const notesMatch = new writable(false)

const rnd = (low, hi) => low + Math.floor(Math.random() * (1 + hi - low))
let tone, note
randomizeNote()
function randomizeNote () {
  tone = rnd(38, 83) // 38:D2 - 83:B5
  note = getNote(tone)
  staffNote.set(note)
}

let key
const unsubscribe = activeKeys.subscribe(x => {
  // check if user pressed the correct key
  key = [...x.values()].map(k => k.note)
  // console.log('target:', note, 'user pressed:', key)
  if ($notesMatch) {
    notesMatch.set(false)
    randomizeNote()
  } else if (x.has(tone)) {
    notesMatch.set(true)
  }
  // update active note
  activeNote.set(key[key.length - 1] || '')
})

onDestroy(unsubscribe)

</script>

<style>

</style>