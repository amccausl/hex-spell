<script>
  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    startGame,
  } from "./store.mjs"
  import GameTimer from "./GameTimer.svelte"
  import ScoreCard from "./ScoreCard.svelte"
  import TileBoard from "./TileBoard.svelte"

  const game = startGame()

  let board_tiles
  game.board_tiles.subscribe( value => {
    board_tiles = value
  })
</script>

<main class="page">
  <h1 class="page-title">HexSpell</h1>
  <div class="page-layout">
    <TileBoard game={ game } />
    <div class="right-pane">
      <GameTimer timer={ game.timer } />
      <ScoreCard score_card={ game.score_card } />
    </div>
  </div>
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
  }
</style>
