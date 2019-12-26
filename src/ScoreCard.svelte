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
  <div class="score-total">Score: { score_value }</div>
  <ul class="word-list">
    {#each matched_words_value as word}
      <li class="word-list__item">
        <span class="word-list__item-text">{ word }</span>
        <span class="word-list__item-score">{ getWordScore( word ) }</span>
      </li>
    {/each}
  </ul>
</section>

<style type="text/scss">
  .score-total {
    font-size: 26px;
  }

  .word-list {
    font-size: 18px;
    list-style: none;
    padding-inline-start: 0;

    &__item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    &__item-text {
      text-align: left;
    }

    &__item-score {
      text-align: right;
    }
  }
</style>
