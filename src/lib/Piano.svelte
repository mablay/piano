<div class="piano">
  <svg width="100vw" viewBox="0 0 980 120">
    <defs>
      <linearGradient id="gradBlack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stop-color="#222"/>
          <stop offset="1" stop-color="#666"/>
      </linearGradient>
      <linearGradient id="gradWhite" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffff0"/>
        <stop offset="1" stop-color="#CCC"/>
    </linearGradient>
  </defs>    
    {#each indices as index}
    <PianoKey index={index}/>
    {/each}
  </svg>

</div>

<script>
  import PianoKey from './PianoKey.svelte'
  // import { Piano } from '@tonejs/piano'
  import { onMount } from 'svelte'


  onMount(async () => {
    console.log('onMount')
  })

  const indices = [...new Array(84)].map((x, i) => i)
  /** @param {Event} event */
	function keyPress(event) {
    console.log('key press', event)
		return true
	}
</script>

<style>

</style>
