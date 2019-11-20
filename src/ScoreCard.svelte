<script>
  import {
    matched_words,
    getWordScore,
  } from "./store.mjs"
  let matched_words_value

  const unsubscribe = matched_words.subscribe( value => {
    matched_words_value = value
  })
</script>

<section class="score-card">
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
  .word-list {
    list-style: none;

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
