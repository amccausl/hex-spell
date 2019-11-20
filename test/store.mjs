import tap from "tap"

import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  WORD_SCORES,
  getTileIndexPosition,
  getTilePositionIndex,
  getWordScore,
  isAdjacent,
} from "../src/store.mjs"

tap.test( "tile index mapping is 1-1", ( t ) => {
  for( let i = 0; i < BOARD_HEIGHT * BOARD_WIDTH; i++ ) {
    const [ row_index, col_index ] = getTileIndexPosition( i )
    const index = getTilePositionIndex( row_index, col_index )
    t.equal( index, i, `Matches for index: ${ index } <=> ${ row_index },${ col_index }` )
  }

  for( let i = 0; i < BOARD_HEIGHT; i++ ) {
    for( let j = 0; j < BOARD_WIDTH; j++ ) {
      const index = getTilePositionIndex( i, j )
      const [ row_index, col_index ] = getTileIndexPosition( index )
      t.equal( row_index, i, `Matches for row position: ${ row_index },${ col_index } <=> ${ index }` )
      t.equal( col_index, j, `Matches for col position: ${ row_index },${ col_index } <=> ${ index }` )
    }
  }

  t.end()
} )

tap.test( "tile adjacency is correct", ( t ) => {
  // Is adjacent to 6 hexes
  const tile_index = getTilePositionIndex( 1, 4 )
  t.ok( isAdjacent( tile_index, getTilePositionIndex( 2, 5 ) ), "2 o'clock" )
  t.ok( isAdjacent( tile_index, getTilePositionIndex( 1, 5 ) ), "4 o'clock" )
  t.ok( isAdjacent( tile_index, getTilePositionIndex( 0, 4 ) ), "6 o'clock" )
  t.ok( isAdjacent( tile_index, getTilePositionIndex( 1, 3 ) ), "8 o'clock" )
  t.ok( isAdjacent( tile_index, getTilePositionIndex( 2, 3 ) ), "10 o'clock" )
  t.ok( isAdjacent( tile_index, getTilePositionIndex( 2, 4 ) ), "12 o'clock" )

  // Is not adjacent to anything else
  t.end()
} )

tap.test( "check scoring for words", ( t ) => {
  t.equal( getWordScore( "TIP" ), WORD_SCORES[ 0 ] )
  t.equal( getWordScore( "QUOTE" ), WORD_SCORES[ 1 ], "QU is 1 tile" )

  t.end()
})
