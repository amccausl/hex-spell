<script>
  export let score_card

  import {
    getWordScore,
  } from "$lib/helpers"

</script>

<section class="score-card">
  <div class="text-2xl">Score: { score_card.score }</div>
  <ul class="word-list list-none text-xl">
    {#each score_card.matched_words as word}
      <li class="flex flex-row justify-between">
        <span class="text-left">{ word }</span>
        <span class="text-right">{ getWordScore( word ) }</span>
      </li>
    {/each}
  </ul>
</section>

<style type="text/scss">
  .word-list {
    padding-inline-start: 0;
  }
</style>
