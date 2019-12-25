<script>
  import { GAME_TIMER } from "./store.mjs"
  export let timer
  $: remaining = GAME_TIMER - $timer
  $: timer_text = `${ Math.floor( remaining / 60 ) }:${ remaining % 60 < 10 ? "0" + ( remaining % 60 ) : remaining % 60 }`
</script>

<section>
  Timer: { remaining < 0 ? "0:00" : timer_text }
</section>

<style type="text/scss">
</style>
