# Learn Piano

**Motivation**  
I have a MIDI controller keyboard and am staring to learn playing the piano.
Looking for a free / open source piano learning experience, I found
a lot of great resources on the web. Yet somehow, I had the feeling that sth. is missing.

## Features 

Simulate a piano supporting inputs:

* MIDI controller keyboard - starting with an *Arturia KeyLab Essential 88*
* Computer Keyboard - more for testing than for actually playing
* Mouse click on virtual keyboard - again, this is for testing

output

* Sampled *Salamander Grand Piano* synth


## Run

```bash
npm run dev
```

## Possible features
Here's a list of possible features.

- [ ] sustain pedal
- [ ] clean code (separate rendering from function)
- [ ] clean MIDI controller life cycle
- [ ] tutorial mechanics
- [ ] Practice mode: Notes, chords, inversions, sheet music, rhythm / timing
- [ ] animated keypress history, see [Shared Piano](https://musiclab.chromeexperiments.com/Shared-Piano)
- [ ] record & playback
- [ ] multiplayer support (WebSocket or better WebRTC)
- [ ] other instruments

## Development

The app is written in JavaScript using [Svelte Kit](https://kit.svelte.dev/) as application framework.
