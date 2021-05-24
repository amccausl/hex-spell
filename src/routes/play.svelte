<script context="module" lang="ts">
  export const prerender = false
  export const ssr = false

  import {
    getDefaultTimeLimit,
  } from "$lib/localstorage"

  export async function load( { page } ) {
    const response = await fetch( "https://hex-spell.com/data/wordlist.txt" )
    const wordlist = await response.text()
    const word_set = new Set( wordlist.split( "\n" ) )
    const dictionary = {
      isWord: ( text ) => {
        return word_set.has( text )
      }
    }

    return {
      props: {
        dictionary,
        time_limit: parseInt( page.query.get( "time" ), 10 ) || getDefaultTimeLimit(),
      }
    }
  }
</script>

<script lang="ts">
  export let time_limit: number
  export let dictionary

  import { onDestroy } from "svelte"

  import { setDefaultTimeLimit } from "$lib/localstorage"
  import { game } from "$lib/store"

  import GameTimer from "$lib/GameTimer/index.svelte"
  import ScoreCard from "$lib/ScoreCard/index.svelte"
  import TileBoard from "$lib/TileBoard/index.svelte"

  setDefaultTimeLimit( time_limit )
  game.start( { time_limit } )

  function clickRestart() {
    game.start( { time_limit } )
  }

  onDestroy( () => game.quit() )
</script>

<svelte:head>
  <title>Hex-Spell: Play</title>
</svelte:head>

<div class="flex justify-center">
  <TileBoard dictionary={ dictionary } game={ game } />
  <div class="right-pane pl-8">
    <GameTimer timer={ $game.timer_text } />
    <ScoreCard score_card={ $game.score_card } />
  </div>
  {#if $game.is_finished}
    <div class="board-overlay flex flex-row items-center justify-center w-full h-full fixed inset-0">
      <div class="board-score flex flex-row items-center justify-center p-16">
        <a class="button button-primary" href="/">Options</a>
        <button class="button button-primary" on:click={ clickRestart }>Play Again</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .board-overlay {
    background-color: rgba(0, 0, 0, 0.25);
  }

  .board-score {
    min-width: 30%;
    background-color: white;
  }

  .right-pane {
    width: 250px;
  }
</style>
