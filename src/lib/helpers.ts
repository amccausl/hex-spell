export const BOARD_WIDTH = 9
export const BOARD_HEIGHT = 7 * 2

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
export const AVAILABLE_TILES_COUNT = AVAILABLE_TILES.length

export const TIME_LIMIT_OPTIONS = [
  60,
  120,
  180,
  240,
  300,
]

export function getTileIndexPosition( tile_index ) {
  const row_index = Math.floor( tile_index / BOARD_WIDTH )
  const col_index = tile_index % BOARD_WIDTH
  return [ row_index, col_index ]
}

export function getTilePositionIndex( row_index, col_index ) {
  return row_index * BOARD_WIDTH + col_index
}

export function getTimeText( seconds ) {
  if( seconds < 0 ) {
    return "0:00"
  }
  return `${ Math.floor( seconds / 60 ) }:${ seconds % 60 < 10 ? "0" + ( seconds % 60 ) : seconds % 60 }`
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

  let score = 10
  let increment = 10
  while( score_index > 0 ) {
    score_index--
    score += increment
    increment += 10
  }

  return score
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

export function getAdjacentDirection( a_tile_index, b_tile_index ) {
  const [ a_row_index, a_col_index ] = getTileIndexPosition( a_tile_index )
  const [ b_row_index, b_col_index ] = getTileIndexPosition( b_tile_index )

  // Check for above and below
  if( a_col_index === b_col_index ) {
    if( a_row_index - b_row_index === -1 ) {
      return 0
    }
    if ( a_row_index - b_row_index === 1 ) {
      return 6
    }
    return false
  }
  // Same row depends on offset
  if( a_row_index === b_row_index ) {
    if( a_col_index - b_col_index === -1 ) {
      return b_col_index % 2 === 0 ? 4 : 2
    }
    if( a_col_index - b_col_index === 1 ) {
      return b_col_index % 2 === 0 ? 8 : 10
    }
    return false
  }
  // Offset rows are more complicated
  if( b_col_index % 2 === 0 ) {
    if( a_row_index - b_row_index === -1 ) {
      if( a_col_index - b_col_index === 1 ) {
        return 10
      }
      if( a_col_index - b_col_index === -1 ) {
        return 2
      }
    }
    return false
  }
  if( a_row_index - b_row_index === 1 ) {
    if( a_col_index - b_col_index === 1 ) {
      return 8
    }
    if( a_col_index - b_col_index === -1 ) {
      return 4
    }
  }
  return false
}

export function shuffleArray( array ) {
  for( let i = array.length - 1; i > 0; i-- ) {
    const j = Math.floor( Math.random() * ( i + 1 ) );
    [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
  }
}
