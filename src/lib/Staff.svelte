<div id="staveContainer">
  <div
    id="activeNoteLabel"
    class:match="{$notesMatch}"
  >
    {$activeNote}
  </div>
  <div bind:this="{stave}" id="stave" />
</div>

<script>
import { onDestroy, onMount } from 'svelte'
import Vex from 'vexflow'

export let staffNote
export let activeNote
export let notesMatch

let stave
let unsubscribe = () => {}

onMount(() => {
  unsubscribe = staffNote.subscribe(note => {
    // console.log('STAFF:DRAW', note)
    drawNote(note)
  })
})

onDestroy(unsubscribe)

function drawNote (note) {
  // clear previously drawn SVGs
  stave.innerHTML = ''

  // draw the new stave
  const { Factory, Barline, Formatter, StaveNote } = Vex.Flow
  const factory = new Factory({
    renderer: {
      elementId: 'stave',
      width: 300,
      height: 300
    }
  })
  
  const score = factory.EasyScore()
  const system = factory.System({ width: 120 })

  const octave = parseInt(note.substring(note.length - 1))
  const clef = octave > 3 ? 'treble' : 'bass'
  // console.log('note:', note)

  const notes = score.notes(`C4/q, ${note}/h, C4/q`, { clef, stem: 'up' })
  notes[0].render_options.draw = false
  notes[2].render_options.draw = false
  const voices = [score.voice(notes)]
  system
    .addStave({ voices })
    .addClef(clef)
  factory.getContext().scale(2, 2)
  factory.draw()
}

/*
  // const system = factory.System({ width: 500 })
  // const stave = factory.Stave()
  //   .setClef('treble')
  //   .setKeySignature('C')
  //   .setBegBarType(Barline.type.NONE)

  // const notes = [
  //   new StaveNote({keys: [`${note}`],  duration: "q"}),
  //   new StaveNote({keys: [`${note}`],  duration: "q"}),
  //   new StaveNote({keys: [`${note}`],  duration: "q"}),
  //   new StaveNote({keys: [`${note}`],  duration: "q"})
  // ]
  // const voice = factory.Voice({ num_beats: 4, beat_value: 4 })
  // voice.addTickables(notes)
  // // new Formatter().joinVoices([voice]).format([voice], 50)
  // system.addStave({ stave, voices: [voice] })
  // factory.draw()
*/
</script>

<style>
#staveContainer {
  position: relative;
}
#stave > svg {
  transform: scale(2);
  z-index: 10;
}
#activeNoteLabel {
  position: absolute;
  top: 92px;
  width: 100%;
  z-index: -1;
  color: #DDD;
  text-align: center;
  line-height: 100px;
  font-size: 100px;
}
#activeNoteLabel.match {
  color: green;
}
</style>
