/** @param {String} text */
export function fromHex (text) {
  return text.split(' ').map(x => parseInt(x, 16))
}

/** @param {Number[]} arr */
export function toHex (arr) {
  const values = Array.isArray(arr) ? arr : [arr]
  return values.map(x => x.toString(16).padStart(2, '0')).join(' ').toUpperCase()
}

/** @param {String} text */
export function toAscii (text) {
  if (typeof text !== 'string') return []
  return[...text].map(s => s.charCodeAt(0))
}

/** @param {Number} index */
export function getNote (index) {
  const i = index + 12
  const notes = 'C C# D D# E F F# G G# A A# B'.split(' ')
  const octave = Math.floor(i / 12)
  const note = notes[i % 12] + octave
  return note
}
