<script>
  import {
    getHighScores,
    getTimeText,
    getWordScore,
  } from "./store.mjs"

  const high_scores = getHighScores()
</script>

<section class="high-score-section">
  {#if high_scores != null}
    <h2 class="text-2xl">High Scores</h2>
    <div class="py-1">
      <span class="text-gray-500 px-2 text-l">Best Word:</span> <span>{ high_scores.best_word } ({ getWordScore( high_scores.best_word ) } points!)</span>
    </div>
    <table class="table-auto py-2">
      <thead>
        <tr>
          <th class="px-4 py-1">Time</th>
          <th class="px-4 py-1">Best Score</th>
        </tr>
      </thead>
      <tbody>
        {#each high_scores.game_types as game_type}
          <tr>
            <td class="border px-4 py-1">{ getTimeText( game_type.time_limit ) }</td>
            <td class="border px-4 py-1">{ game_type.score }</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>

<style type="text/scss">
  .high-score-section {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
