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
	import { spring } from 'svelte/motion'
  import PianoKey from './PianoKey.svelte'

  const indices = [...new Array(84)].map((x, i) => i)
  /** @param {Event} event */
	function keyPress(event) {
    console.log('key press', event)
		return true
	}
</script>

<style>
  .piano-key {
    cursor: pointer;
    fill:ivory;
    stroke:grey;
    stroke-width:2;
    /* fill-rule:evenodd; */
  }

  .piano-key.black {
    fill:#222;
    stroke:black;
    stroke-width:2;
  }

	.counter {
		display: flex;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
	}

	.counter button {
		width: 2em;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background-color: transparent;
		touch-action: manipulation;
		color: var(--text-color);
		font-size: 2rem;
	}

	.counter button:hover {
		background-color: var(--secondary-color);
	}

	path {
		vector-effect: non-scaling-stroke;
		stroke-width: 2px;
		stroke: var(--text-color);
	}

	.counter-viewport {
		width: 8em;
		height: 4em;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.counter-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: var(--accent-color);
		font-size: 4rem;
		align-items: center;
		justify-content: center;
	}

	.counter-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
