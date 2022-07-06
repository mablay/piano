import WebMidi from "webmidi"
import { writable } from 'svelte/store'
import { toHex } from '../lib/util.js'

/**
 * @typedef MidiMessage
 * @property {String} name
 * @property {String} [type]
 * @property {Number} timestamp
 * @property {Number[]} data
 * @property {String} hex
 * 
 */

/** @type {import('svelte/store').Writable<MidiMessage>} */
export const inMsg = writable()
export const dawOut = writable(null)
export const midi = writable()

export async function initMidi () {
  // await WebMidi.enable({ sysex: true, software: false })
  await new Promise((resolve, reject) => {
    WebMidi.enable(error => {
      if (error) return reject(error)
      return resolve(null)
    })
  })

  if (WebMidi.inputs.length < 1) {
    console.warn("No device detected.")
    return
  }

  for (const input of WebMidi.inputs) {
    console.log('+ MIDI INPUT: ', input.id.toString().padStart(12), '|', input.name)
    input.addListener('midimessage', 1, onMessage)
  }
  for (const output of WebMidi.outputs) {
    console.log('+ MIDI OUTPUT:', output.id.toString().padStart(12), '|', output.name)
  }

  midi.set(WebMidi)
}

/** @param {any} event */
function onMessage (event) {
  const data = [...event.data]
  const msg = {
    name: event.target.name,
    type: event.target.type,
    timestamp: Math.floor(event.timestamp),
    data,
    hex: toHex(data)
  }
  // logMessage(msg)
  inMsg.set(msg)
}

/** @param {any} msg */
function logMessage (msg) {
  const { name, type, timestamp, hex } = msg
  console.log(name, '>', timestamp, '|', hex)
}
