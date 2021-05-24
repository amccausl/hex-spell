<script context="module" lang="ts">
  export const prerender = false
</script>

<script lang="ts">
  import {
    getTimeText,
    getWordScore,
  } from "$lib/helpers"
  import {
    getHighScores,
  } from "$lib/localstorage"

  const high_scores = getHighScores()
</script>

<section class="flex flex-col items-center text-center p-4 my-0 mx-auto">
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
          {#if game_type.score > 0}
            <tr>
              <td class="border px-4 py-1">{ getTimeText( game_type.time_limit ) }</td>
              <td class="border px-4 py-1">{ game_type.score }</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {/if}
</section>
