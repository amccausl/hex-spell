import { writable } from "svelte/store"

import {
  AVAILABLE_TILES,
  AVAILABLE_TILES_COUNT,
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TIME_LIMIT_OPTIONS,
  getTileIndexPosition,
  getTimeText,
  getWordScore,
  shuffleArray,
} from "$lib/helpers"
import {
  getHighScores,
  setHighScores,
} from "$lib/localstorage"

function createGame() {
  const { subscribe, update } = writable( {
    board_tiles: null,
    score_card: null,
    start_time: null,
    timer_text: null,
    is_finished: false,
  } )

  let tiles = [ ...AVAILABLE_TILES ]
  let board_tile_indexes = Array( BOARD_WIDTH )
  let board_tiles = Array( BOARD_WIDTH ).fill( null ).map( () => [] )

  function getLetter( index ) {
    const [ row_index, col_index ] = getTileIndexPosition( index )
    return board_tiles[ col_index ][ row_index ].value.toUpperCase()
  }

  return {
    subscribe,
    start: ( { time_limit } ) => update( () => {

      // Setup Tiles
      // @todo use seed
      tiles = [ ...AVAILABLE_TILES ]
      shuffleArray( tiles )

      board_tile_indexes = Array( BOARD_WIDTH )
      board_tiles = Array( BOARD_WIDTH ).fill( null ).map( () => [] )

      for( let j = 0; j < BOARD_HEIGHT; j++ ) {
        for( let i = 0; i < BOARD_WIDTH; i++ ) {
          const index = j * BOARD_WIDTH + i
          board_tiles[ i ].push( { index, value: tiles[ index % AVAILABLE_TILES_COUNT ] } )
          board_tile_indexes[ i ] = index
        }
      }

      // Setup Score Card
      const score_card = { score: 0, matched_words: [] }

      // Setup Timer
      const start_time = +( new Date() )

      // Start the clock
      const interval = setInterval(
        () => {
          update( $game => {
            if( $game.start_time !== start_time ) {
              clearInterval( interval )
              return $game
            }

            const current_time = +( new Date() )

            const elapsed_seconds = Math.round( ( current_time - start_time ) / 1000 )

            if( elapsed_seconds > time_limit ) {
              // Game is finished
              clearInterval( interval )

              const high_scores = getHighScores() || { best_word: "", game_types: TIME_LIMIT_OPTIONS.map( option => ({ time_limit: option, score: 0 }) ) }
              const game_type = high_scores.game_types.find( game_type => game_type.time_limit === time_limit )
              if( game_type ) {
                if( game_type.score < $game.score_card.score ) {
                  game_type.score = $game.score_card.score
                }
              }
              let best_word_score = getWordScore( high_scores.best_word )
              for( const matched_word of $game.score_card.matched_words ) {
                const matched_word_score = getWordScore( matched_word )
                if( matched_word_score > best_word_score ) {
                  high_scores.best_word = matched_word
                  best_word_score = matched_word_score
                }
              }
              setHighScores( high_scores )

              return {
                ...$game,
                is_finished: true,
                timer_text: getTimeText( 0 ),
              }
            }

            return {
              ...$game,
              timer_text: getTimeText( time_limit - elapsed_seconds ),
            }
          } )
        },
        1000
      )

      return {
        board_tiles,
        score_card,
        start_time,
        timer_text: getTimeText( time_limit ),
        is_finished: false,
      }
    }),
    match: ( path, dictionary ) => update( $game => {
      if( path.length < 3 ) {
        return $game
      }

      const word = path.map( getLetter ).join( "" )
      if( ! dictionary.isWord( word.toLowerCase() ) ) {
        return $game
      }

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
      return {
        ...$game,
        board_tiles: [ ...board_tiles ],
        score_card: {
          matched_words: [ ...$game.score_card.matched_words, word ],
          score: $game.score_card.score + getWordScore( word ),
        },
      }
    }),
    quit: () => update( $game => ( { ...$game, start_time: null } ) ),
  }
}

export const game = createGame()
