<script>
  import { getGameTimer } from "./stores.mjs"

  const elapsed = getGameTimer()
  $: remaining = 120 - $elapsed
  $: timer = `${ Math.floor( remaining / 60 ) }:${ remaining % 60 < 10 ? "0" + ( remaining % 60 ) : remaining % 60 }`
</script>

<section>
  Timer: { remaining < 0 ? "0:00" : timer }
</section>

<style>
</style>
