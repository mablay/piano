import { writable } from 'svelte/store'

export const time = writable(0)
// let $time
// time.subscribe(value => $time = value)

export const toneEvents = writable([])

export function journalTone (tone:number, time:number, stop = false) {
  toneEvents.update(events => {
    closeOpenEvents(events, tone, time)
    if (stop === false) {
      events.unshift({ tone, start: time })
    }
    pruneStaleEvents(events, time)
    return events
  })
}

function closeOpenEvents (events, tone, time) {
  for (let i=events.length - 1; i >= 0; i--) {
    const ev = events[i]
    if (ev.tone === tone && !ev.end) {
      ev.end = time
    }
  }
}

/** if an event has scrolled out of sight, we can remove it */
export function pruneStaleEvents (events, time) {
  let update = false
  for (let i=events.length - 1; i >= 0; i--) {
    if (events[i].end < time - 5000) {
      events.splice(i, 1)
      update = true
    }
  }
  if (update) toneEvents.set(events)

}
