<rect
  class="tone-event"
  x={x}
  y={0}
  transform="translate(0,{y})"
  width={width}
  height={height}
/>

<script lang="ts">
export let time = 0
export let tone = 60
export let width = 24 * 7 / 12
export let start:number
export let end = 0
// let color = 'green'
const scaleY = 20
$: x = 6 + (tone - 21) * width
$: y = 200 + (start - time) / scaleY
$: height = end ? (end - start) / scaleY : 200 - y
</script>

<style>
.tone-event {
  fill: skyblue;
  stroke-width: 0;
  /* stroke: white; */
}
</style>