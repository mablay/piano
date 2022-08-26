<script context="module">
	export const prerender = true;
</script>

<script>
	import Piano from '$lib/piano/Piano88.svelte'
	import Trainer from '$lib/Trainer.svelte'
</script>

<svelte:head>
	<title>Learn Piano</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
    Play Notes
	</h1>

  <Trainer />
  <!-- <span class="hero-note">C♯-1</span> -->
  <!-- <p>𝄞♩♪♫♬♭♮♯𝄇</p> -->

	<Piano />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

  /* .hero-note {
    text-align: center;
    width: 130px;
    font-family: system-ui;
    font-weight: 100;
    color: azure;
    background: #222;
    background: linear-gradient(0deg, #222 20%, #888 100%);
    font-size: 64px;
    line-height: 130px;
    padding: 24px;
    border-radius: 24px;
  } */
</style>
