<script>
  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    createGame,
  } from "./store.mjs"
  import GameTimer from "./GameTimer.svelte"
  import ScoreCard from "./ScoreCard.svelte"
  import TileBoard from "./TileBoard.svelte"

  let is_playing = false
  let is_finished = false
  let game = createGame()
  let board_tiles

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
    game.start()
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
      <button class="button" on:click={ clickStartGame }>Start Game</button>
    {:else}
      <TileBoard game={ game } />
      <div class="right-pane">
        <GameTimer timer={ $game.timer } />
        <ScoreCard score_card={ $game.score_card } />
      </div>
    {/if}
  </div>
  {#if is_finished}
    <div class="board-overlay">
      <div class="board-score">
        <button class="button" on:click={ clickRestart }>Restart</button>
      </div>
    </div>
  {/if}
</main>

<style type="text/scss">
  .page {
    text-align: center;
    padding: 1em;
    max-width: 240px;
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

  .button {
    font-size: 26px;
    padding: 16px;
    background-color: #DDC994;
    border-color: #43363D;
    cursor: pointer;
  }
</style>
