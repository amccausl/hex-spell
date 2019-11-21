import { derived, readable, writable } from "svelte/store"

export const AVAILABLE_TILES = [
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

export const BOARD_WIDTH = 7
export const BOARD_HEIGHT = 6

export const WORD_SCORES = [
  10, // Length 3
  20,
  40,
  70,
  100,
  130,
  160,
  200,
]

function shuffleArray( array ) {
  for( let i = array.length - 1; i > 0; i-- ) {
    const j = Math.floor( Math.random() * ( i + 1 ) );
    [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
  }
}

export function generateTiles( seed ) {
  // @todo use seed
  const tiles = [ ...AVAILABLE_TILES ]
  shuffleArray( tiles )

  const result = []
  for( let i = 0; i < BOARD_WIDTH; i++ ) {
    result.push( tiles.splice( tiles.length - BOARD_HEIGHT, BOARD_HEIGHT ) )
  }

  return result
}

function createScoreCard() {
  const { subscribe, set, update } = writable( { score: 0, matched_words: [] } );

  return {
    subscribe,
    push: ( word ) => update( ( { score, matched_words } ) =>
      ( { score: score += getWordScore( word ), matched_words: [ ...matched_words, word ] } )
    ),
    reset: () => set( { score: 0, matched_words: [] } )
  }
}

export const time = readable( new Date(), function start( set ) {
  const interval = setInterval(
    () => {
      set( new Date() )
    },
    1000
  )

  return function stop() {
    clearInterval( interval )
  }
})

export function getGameTimer() {
  const start = new Date();

  return derived(
    time,
    $time => Math.round( ( $time - start ) / 1000 )
  )
}

export function getTileIndexPosition( tile_index ) {
  const row_index = Math.floor( tile_index / BOARD_WIDTH )
  const col_index = tile_index % BOARD_WIDTH
  return [ row_index, col_index ]
}

export function getTilePositionIndex( row_index, col_index ) {
  return row_index * BOARD_WIDTH + col_index
}

export function getWordScore( word ) {
  console.info('getWordScore', word)
  let score_index = word.length - 3
  let offset = 0
  while( true ) {
    let search_index = word.indexOf( "QU", offset )
    if( search_index === -1 ) {
      break
    }
    score_index--
    offset = search_index + 1
  }

  return WORD_SCORES[ score_index ]
}

export function isAdjacent( a_tile_index, b_tile_index ) {
  const [ a_row_index, a_col_index ] = getTileIndexPosition( a_tile_index )
  const [ b_row_index, b_col_index ] = getTileIndexPosition( b_tile_index )

  // Check for above and below
  if( a_col_index === b_col_index ) {
    return Math.abs( a_row_index - b_row_index ) === 1
  }
  // Check for beside
  if( a_row_index === b_row_index || a_row_index - b_row_index === 1 - 2 * ( a_col_index % 2 ) ) {
    return Math.abs( a_col_index - b_col_index ) === 1
  }
  return false
}

export function isWord( text ) {
  // @todo
  return true
}

export function startGame( options ) {
  const board_tiles = writable( [] )
  board_tiles.set( generateTiles( Math.random() ) )

  const score_card = createScoreCard()
  const timer = getGameTimer()

  const game = {
    board_tiles,
    score_card,
    timer,
  }

  return game
}
