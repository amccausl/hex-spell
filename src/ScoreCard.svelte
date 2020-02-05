<script>
  export let score_card

  import {
    getWordScore,
  } from "./store.mjs"
  let matched_words_value
  let score_value

  const unsubscribe = score_card.subscribe( ( { matched_words, score } ) => {
    score_value = score
    matched_words_value = matched_words
  })
</script>

<section class="score-card">
  <div class="text-2xl">Score: { score_value }</div>
  <ul class="word-list list-none text-xl">
    {#each matched_words_value as word}
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
