<script context="module" lang="ts">
  export const prerender = true
</script>

<script lang="ts">
  import {
    TIME_LIMIT_OPTIONS,
    getTimeText,
  } from "$lib/helpers"

  import HighScores from "$lib/HighScores/index.svelte"

  let time_limit = TIME_LIMIT_OPTIONS[ 2 ]
</script>

<svelte:head>
  <title>Hex-Spell</title>
</svelte:head>

<div class="flex justify-center">
  <div class="flex flex-col items-center justify-center">
    <form class="w-full max-w-sm inline-block align-middle">
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/2">
          <label class="md:text-right md:mb-0 block text-black mb-1 pr-4" for="options_time_limit">
            Time Limit
          </label>
        </div>
        <div class="md:w-1/2">
          <select bind:value={ time_limit } id="options_time_limit" class="input-select">
            {#each TIME_LIMIT_OPTIONS as time_limit_option}
              <option value={ time_limit_option }>{ getTimeText( time_limit_option ) }</option>
            {/each}
          </select>
        </div>
      </div>
      <a class="button button-primary" href="/play?time={ time_limit }">Start Game</a>
    </form>

    <HighScores />
  </div>
</div>

<style type="text/scss">
  .input-select {
    @apply
      bg-gray-200
      appearance-none
      border-2
      border-gray-200
      w-full
      py-2
      px-4
      text-gray-700
      leading-tight;

    &:focus {
      @apply
        outline-none
        bg-white;
        // border-selected;
    }
  }
</style>
