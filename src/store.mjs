import { derived, get, readable, writable } from "svelte/store"

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

export const GAME_TIMER = 120
export const BOARD_WIDTH = 9
export const BOARD_HEIGHT = 7 * 2

export const TIME_LIMIT_OPTIONS = [
  60,
  120,
  180,
  240,
  300,
]

// @todo this is an unsafe async
let dictionary
async function loadDictionary() {
  const response = await fetch( "data/wordlist.txt" )
  const wordlist = await response.text()
  const word_set = new Set( wordlist.split( "\n" ) )
  dictionary = {
    isWord: ( text ) => {
      return word_set.has( text )
    }
  }
}
loadDictionary()

const TIME_LIMIT_KEY = "options_time_limit"
export function getDefaultOptions() {
  const default_options = {
    time_limit: 180,
  }

  try {
    const time_limit = window.localStorage.getItem( TIME_LIMIT_KEY )
    if( time_limit != null ) {
      default_options.time_limit = parseInt( time_limit, 10 )
    }
  } catch( ex ) {
  }

  return default_options
}

export function setDefaultTimeLimit( time_limit ) {
  try {
    window.localStorage.setItem( TIME_LIMIT_KEY, time_limit )
  } catch( ex ) {
  }
}

const SCORES_KEY = "scores"
export function getHighScores() {
  try {
    return JSON.parse( window.localStorage.getItem( SCORES_KEY ) )
  } catch( ex ) {
    return null
  }
}

function setHighScores( high_scores ) {
  try {
    window.localStorage.setItem( SCORES_KEY, JSON.stringify( high_scores ) )
  } catch( ex ) {
    return null
  }
}

function shuffleArray( array ) {
  for( let i = array.length - 1; i > 0; i-- ) {
    const j = Math.floor( Math.random() * ( i + 1 ) );
    [ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
  }
}

function createBoardTiles( options ) {
  // @todo use seed
  let tiles = [ ...AVAILABLE_TILES ]
  shuffleArray( tiles )

  const board_tile_indexes = Array( BOARD_WIDTH )
  const board_tiles = Array( BOARD_WIDTH ).fill( null ).map( () => [] )

  for( let j = 0; j < BOARD_HEIGHT; j++ ) {
    for( let i = 0; i < BOARD_WIDTH; i++ ) {
      const index = j * BOARD_WIDTH + i
      board_tiles[ i ].push( { index, value: tiles[ index % AVAILABLE_TILES_COUNT ] } )
      board_tile_indexes[ i ] = index
    }
  }

  const { subscribe, update } = writable( board_tiles );

  return {
    subscribe,
    remove: ( path ) => update( board_tiles => {
      for( const tile_index of path ) {
        const [ row_index, col_index ] = getTileIndexPosition( tile_index )
        board_tiles[ col_index ][ row_index ] = null
      }
      for( let i = 0; i < BOARD_WIDTH; i++ ) {
        if( board_tiles[ i ].includes( null ) ) {
          board_tiles[ i ] = board_tiles[ i ].filter( value => value )
          const count = BOARD_HEIGHT - board_tiles[ i ].length
          for( let j = 0; j < count; j++ ) {
            board_tile_indexes[ i ] += BOARD_WIDTH
            board_tiles[ i ].push({
              index: board_tile_indexes[ i ],
              value: tiles[ board_tile_indexes[ i ] % AVAILABLE_TILES_COUNT ],
            })
          }
        }
      }
      return [ ...board_tiles ]
    }),
  }
}

function createScoreCard() {
  const { subscribe, set, update } = writable( { score: 0, matched_words: [] } )

  return {
    subscribe,
    push: ( word ) => update( ( { score, matched_words } ) =>
      ( { score: score += getWordScore( word ), matched_words: [ ...matched_words, word ] } )
    ),
    reset: () => set( { score: 0, matched_words: [] } )
  }
}

export function getTimeText( seconds ) {
  if( seconds < 0 ) {
    return "0:00"
  }
  return `${ Math.floor( seconds / 60 ) }:${ seconds % 60 < 10 ? "0" + ( seconds % 60 ) : seconds % 60 }`
}

export function getGameTimer() {
  const start = new Date();
  const time = readable( new Date(), function start( set ) {
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

export function createGame( options ) {
  const { subscribe, update } = writable( { board_tiles: null, score_card_timer: null, is_finished: false } )

  return {
    subscribe,
    start: ( options ) => update( () => {
      const board_tiles = createBoardTiles( options )
      const score_card = createScoreCard()
      const timer = getGameTimer()
      const timer_text = derived(
        timer,
        $timer => getTimeText( options.time_limit - $timer )
      )
      const is_finished = derived(
        timer,
        $timer => $timer > options.time_limit
      )

      const unsubscribe = is_finished.subscribe( value => {
        if( value ) {
          const high_scores = getHighScores() || { best_word: "", game_types: TIME_LIMIT_OPTIONS.map( option => ({ time_limit: option, score: 0 }) ) }
          const game_type = high_scores.game_types.find( game_type => game_type.time_limit === options.time_limit )
          const score_card_value = get( score_card )
          if( game_type ) {
            if( game_type.score < score_card_value.score ) {
              game_type.score = score_card_value.score
            }
          }
          let best_word_score = getWordScore( high_scores.best_word )
          for( const matched_word of score_card_value.matched_words ) {
            const matched_word_score = getWordScore( matched_word )
            if( matched_word_score > best_word_score ) {
              high_scores.best_word = matched_word
              best_word_score = matched_word_score
            }
          }
          setHighScores( high_scores )
        }
      } )

      return {
        board_tiles,
        score_card,
        timer_text,
        is_finished,
      }
    } ),
    isWord: ( word ) => dictionary.isWord( word ),
  }
}
