<script>
  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    board_tiles,
    matched_words,
  } from './stores.mjs';
  import GameTimer from "./GameTimer.svelte";
  import ScoreCard from "./ScoreCard.svelte";
  import TileBoard from "./TileBoard.svelte";

  const AVAILABLE_TILES = [
    ...Array( 24 ).fill( "E" ),
    ...Array( 16 ).fill( "A" ),
    ...Array( 15 ).fill( "O" ),
    ...Array( 15 ).fill( "T" ),
    ...Array( 13 ).fill( "I" ),
    ...Array( 13 ).fill( "N" ),
    ...Array( 13 ).fill( "R" ),
    ...Array( 10 ).fill( "S" ),
    ...Array( 7 ).fill( "L" ),
    ...Array( 5 ).fill( "U" ),
    ...Array( 8 ).fill( "D" ),
    ...Array( 5 ).fill( "G" ),
    ...Array( 6 ).fill( "C" ),
    ...Array( 6 ).fill( "M" ),
    ...Array( 4 ).fill( "B" ),
    ...Array( 4 ).fill( "P" ),
    ...Array( 5 ).fill( "H" ),
    ...Array( 4 ).fill( "F" ),
    ...Array( 4 ).fill( "W" ),
    ...Array( 4 ).fill( "Y" ),
    ...Array( 3 ).fill( "V" ),
    ...Array( 2 ).fill( "K" ),
    ...Array( 2 ).fill( "J" ),
    ...Array( 2 ).fill( "X" ),
    ...Array( 2 ).fill( "Qu" ),
    ...Array( 2 ).fill( "Z" ),
  ]

  function shuffleArray( array ) {
    for( let i = array.length - 1; i > 0; i-- ) {
      const j = Math.floor( Math.random() * ( i + 1 ) );
      [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
    }
  }

  function generateTiles( seed ) {
    // @todo use seed
    const tiles = [ ...AVAILABLE_TILES ]
    shuffleArray( tiles )

    const result = []
    for( let i = 0; i < BOARD_HEIGHT; i++ ) {
      result.push( tiles.splice( tiles.length - BOARD_WIDTH, BOARD_WIDTH ) )
    }

    console.info( 'result', result)

    return result
  }

  board_tiles.set( generateTiles( Math.random() ) )
</script>

<main>
  <h1>HexSpell</h1>
  <div class="main-layout">
    <TileBoard />
    <div class="right-pane">
      <GameTimer />
      <ScoreCard matched_words={ matched_words } />
    </div>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .main-layout {
    display: flex;
    justify-content: center;
  }

  .right-pane {
    width: 400px;
  }
</style>
