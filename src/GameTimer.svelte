<script>
  export let timer
  $: remaining = 120 - $timer
  $: timer_text = `${ Math.floor( remaining / 60 ) }:${ remaining % 60 < 10 ? "0" + ( remaining % 60 ) : remaining % 60 }`
</script>

<section>
  Timer: { remaining < 0 ? "0:00" : timer_text }
</section>

<style type="text/scss">
</style>
