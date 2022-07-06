<script>
	import Header from '$lib/header/Header.svelte'
	import '../app.css'
  import { initMidi } from '../store/midi.js'
  import { loadSynth } from '../store/synth.js'
  loadSynth()
  initMidi()
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<!-- footer -->
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
