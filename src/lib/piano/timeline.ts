import { writable } from 'svelte/store'

export const time = writable(0)
// let $time
// time.subscribe(value => $time = value)

export const toneEvents = writable([
  // { tone: 60, start: 100, end: 800 },
  // { tone: 40, start: 400, end: 1600 },
  // { tone: 60, start: 2000, end: 3000 }
])

export function journalTone (tone:number, time:number, stop = false) {
  toneEvents.update(events => {
    if (stop) {
      const i = events.map(x => x.tone === tone).lastIndexOf(true)
      if (i < 0) return events
      events[i].end = time
    } else {
      events.push({ tone, start: time })
    }
    // prune out of sight tones
    for (let i=events.length - 1; i >= 0; i--) {
      if (events[i].end < time - 5000) {
        console.log('[timeline] jounal size:', events.length)
        events.splice(i, 1)
      }
    }
    return events
  })
}
