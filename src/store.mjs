import { derived, readable, writable } from "svelte/store"

export const BOARD_WIDTH = 8
export const BOARD_HEIGHT = 6

function createMatchedWords() {
	const { subscribe, set, update } = writable( [] );

	return {
    subscribe,
    push: ( word ) => update( arr => [ ...arr, word ] ),
		reset: () => set( [] )
	};
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

export function isAdjacent( a_tile_index, b_tile_index ) {
  const [ a_row_index, a_col_index ] = getTileIndexPosition( a_tile_index )
  const [ b_row_index, b_col_index ] = getTileIndexPosition( b_tile_index )

  console.info( `checking ${a_row_index},${a_col_index} and ${b_row_index},${b_col_index}` )

  if( a_row_index === b_row_index ) {
    return Math.abs( b_col_index - a_col_index ) === 1
  }
  if( a_col_index === b_col_index ) {
    return Math.abs( b_col_index - a_col_index ) === 1
  }
  // @todo add logic for odd or even adjacency
  return false
}

export function isWord( text ) {
  // @todo
  return true
}
