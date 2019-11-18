<script>
  import { matched_words } from './stores.mjs';
  let matched_words_value;

	const unsubscribe = matched_words.subscribe( value => {
		matched_words_value = value;
	});
</script>

<section class="score_card">
  This is Score card
  <ul>
    {#each matched_words_value as word}
      <li><span>{ word }</span></li>
    {/each}
  </ul>
</section>

<style>
</style>
