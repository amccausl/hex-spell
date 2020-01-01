<script>
  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    createGame,
    getDefaultOptions,
    setDefaultTimeLimit,
  } from "./store.mjs"
  import GameTimer from "./GameTimer.svelte"
  import ScoreCard from "./ScoreCard.svelte"
  import Tailwindcss from "./Tailwindcss.svelte"
  import TileBoard from "./TileBoard.svelte"

  let is_playing = false
  let is_finished = false
  let game = createGame()
  let board_tiles
  let game_options = getDefaultOptions()

  let unsubscribe = null
  game.subscribe( value => {
    if( unsubscribe ) {
      unsubscribe()
    }

    const unsubscribeTiles = $game.board_tiles && $game.board_tiles.subscribe( value => {
      board_tiles = value
    })
    const unsubscribeFinished = $game.is_finished && $game.is_finished.subscribe( value => {
      if( value ) {
        is_finished = true
      } else {
        is_playing = true
      }
    })

    unsubscribe = () => {
      if( unsubscribeTiles ) unsubscribeTiles()
      if( unsubscribeFinished ) unsubscribeFinished()
      unsubscribe = null
    }
  })

  function clickStartGame() {
    setDefaultTimeLimit( game_options.time_limit )
    game.start( game_options )
    is_finished = false
  }

  function clickRestart() {
    window.location.reload( false )
  }
</script>

<main class="page">
  <h1 class="page-title">Hex-Spell</h1>
  <div class="page-layout">
    {#if ! is_playing}
      <form class="w-full max-w-sm inline-block align-middle">
        <div class="md:flex md:items-center mb-6">
          <div class="md:w-1/2">
            <label class="input-label md:text-right md:mb-0" for="options_time_limit">
              Time Limit
            </label>
          </div>
          <div class="md:w-1/2">
            <select bind:value={ game_options.time_limit } id="options_time_limit" class="input-select">
              <option value={ 60 }>1:00</option>
              <option value={ 120 }>2:00</option>
              <option value={ 180 }>3:00</option>
              <option value={ 240 }>4:00</option>
              <option value={ 300 }>5:00</option>
            </select>
          </div>
        </div>
        <button class="button button-primary" on:click={ clickStartGame }>Start Game</button>
      </form>
    {:else}
      <TileBoard game={ game } />
      <div class="right-pane">
        <GameTimer timer={ $game.timer_text } />
        <ScoreCard score_card={ $game.score_card } />
      </div>
    {/if}
  </div>
  {#if is_finished}
    <div class="board-overlay">
      <div class="board-score">
        <button class="button button-primary" on:click={ clickRestart }>Restart</button>
      </div>
    </div>
  {/if}
</main>
<Tailwindcss />

<style type="text/scss">
  .page {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  .page-title {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    .page {
      max-width: none;
    }
  }

  .page-layout {
    display: flex;
    justify-content: center;
  }

  .right-pane {
    width: 250px;
    padding-left: 20px;
  }

  .board-overlay {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .board-score {
    min-width: 30%;
    padding: 40px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .input-label {
    @apply
      block
      text-gray-500
      mb-1
      pr-4;
  }

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
        bg-white
        border-primary;
    }
  }

  .button {
    @apply
      text-2xl
      py-2
      px-4
      border-2
      border-black;

    &-primary {
      @apply bg-primary;

      &:hover {
        @apply bg-selected;
      }
    }
  }
</style>
