<script>
  import Navago from "navigo"

  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    TIME_LIMIT_OPTIONS,
    createGame,
    getDefaultOptions,
    setDefaultTimeLimit,
    getTimeText,
  } from "./store.mjs"
  import AppBar from "./AppBar.svelte"
  import GameTimer from "./GameTimer.svelte"
  import HighScores from "./HighScores.svelte"
  import LoginPage from "./LoginPage.svelte"
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

  const router = new Navago( "", true )

  let current_page = null
  router
    .on({
      "login"() {
        console.info('login')
        current_page = "login"
      },
      "*"() {
        console.info('run main')
        current_page = "start"
      },
    })
    .resolve()
</script>

<AppBar />
<main class="page text-center my-0 mx-auto p-4">
  {#if current_page === "login"}
    <LoginPage/>
  {:else if is_playing}
    <div class="flex justify-center">
      <TileBoard game={ game } />
      <div class="right-pane pl-8">
        <GameTimer timer={ $game.timer_text } />
        <ScoreCard score_card={ $game.score_card } />
      </div>
    </div>
  {:else}
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
              <select bind:value={ game_options.time_limit } id="options_time_limit" class="input-select">
                {#each TIME_LIMIT_OPTIONS as time_limit_option}
                  <option value={ time_limit_option }>{ getTimeText( time_limit_option ) }</option>
                {/each}
              </select>
            </div>
          </div>
          <button class="button button-primary" on:click={ clickStartGame }>Start Game</button>
        </form>

        <HighScores />
      </div>
    </div>
    {#if is_finished}
      <div class="board-overlay flex flex-row items-center justify-center w-full h-full fixed inset-0">
        <div class="board-score flex flex-row items-center justify-center p-16">
          <button class="button button-primary" on:click={ clickRestart }>Restart</button>
        </div>
      </div>
    {/if}
  {/if}
</main>
<Tailwindcss />

<style type="text/scss">
  @media (min-width: 640px) {
    .page {
      max-width: none;
    }
  }

  .right-pane {
    width: 250px;
  }

  .board-overlay {
    background-color: rgba(0, 0, 0, 0.25);
  }

  .board-score {
    min-width: 30%;
    background-color: white;
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
        border-selected;
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

      &:focus {
        @apply border-selected;
      }
    }
  }
</style>
