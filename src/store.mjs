import { derived, readable, writable } from "svelte/store"

export const BOARD_WIDTH = 8
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

function createMatchedWords() {
  const { subscribe, set, update } = writable( [] );

  return {
    subscribe,
    push: ( word ) => update( arr => [ ...arr, word ] ),
    reset: () => set( [] )
  }
}

export const matched_words = createMatchedWords()

export const board_tiles = writable( [] )

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

  console.info( `checking ${a_row_index},${a_col_index} and ${b_row_index},${b_col_index}` )

  // Check for above and below
  if( a_col_index === b_col_index ) {
    return Math.abs( a_row_index - b_row_index ) === 1
  }
  // Check for beside
  // if( a_row_index === b_row_index || ( a_col_index % 2 ? a_row_index - b_row_index : b_row_index - a_row_index ) === 1 ) {
  if( a_row_index === b_row_index || b_row_index - a_row_index === 1 - 2 * ( a_col_index % 2 ) ) {
    return Math.abs( a_col_index - b_col_index ) === 1
  }
  return false
}

export function isWord( text ) {
  // @todo
  return true
}
