<svg class="timeline" viewBox="0 0 1248 200">
  <defs>
    <linearGradient id="fadeGrad" y2="1" x2="0">
      <stop offset="0" stop-color="white" stop-opacity="0"/>
      <stop offset="0.5" stop-color="white" stop-opacity="1"/>
    </linearGradient>

    <mask id="fade" maskContentUnits="userSpaceOnUse">
      <rect width="1248" height="200" fill="url(#fadeGrad)"/>
    </mask>
  </defs>
  <g mask="url(#fade)">
    {#each $toneEvents as te}
    <ToneEvent
      time={$time}
      tone={te.tone}
      start={te.start}
      end={te.end}
    />
    {/each}
  </g>
</svg>

<script lang="ts">
import { onDestroy, onMount } from 'svelte'
import ToneEvent from './ToneEvent.svelte'
import { toneEvents, time } from './timeline'

let stopAnimation
let mountTime = 0
onMount(() => {
  mountTime = Date.now()
  animate()
})
function animate () {
  stopAnimation = requestAnimationFrame(animate)
  $time = Date.now() - mountTime
}
onDestroy(() => cancelAnimationFrame(stopAnimation))

</script>

<style>
.timeline {
  width: 100%;
  display: block;
}
</style>