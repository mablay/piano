export interface IKeyProp {
  note: string // MIDI name of the note: C4, D#6, Eb3, Ab-1
  // name: string // C, C#, D, D#, E, F, F#, G, G#, A, A#, B
  // index: number // piano key position from left to right
  // offset: number // individual key offset in pixel, since they are not equally distributed
  black: Boolean // true: black key, false: white key, default: false
  points: string // visual shape: C, D, E, F, G, A, B, BLACK, A0, C7
  active: Boolean // true: key is pressed, false: key is not pressed
  // tone?: number //] MIDI controller value corresponding to MIDI note
  // idx?: number // index of the key within the octave 0 - 11
  // octave?: number // MIDI octave of the note: -2, 4, 7
  // shape?: number[][] // visual shape: C, D, E, F, G, A, B, BLACK, A0, C7
}
