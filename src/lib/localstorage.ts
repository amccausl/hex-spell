import type { HighScores } from "$lib/types"

const TIME_LIMIT_KEY = "options_time_limit"
export function getDefaultTimeLimit() {
  try {
    const time_limit = window.localStorage.getItem( TIME_LIMIT_KEY )
    if( time_limit != null ) {
      return parseInt( time_limit, 10 ) || 180
    }
  } catch( ex ) {
  }

  return 180
}

export function setDefaultTimeLimit( time_limit ) {
  try {
    window.localStorage.setItem( TIME_LIMIT_KEY, time_limit )
  } catch( ex ) {
  }
}

const SCORES_KEY = "scores"
export function getHighScores(): HighScores {
  try {
    return JSON.parse( window.localStorage.getItem( SCORES_KEY ) )
  } catch( ex ) {
    return null
  }
}

export function setHighScores( high_scores: HighScores ) {
  try {
    window.localStorage.setItem( SCORES_KEY, JSON.stringify( high_scores ) )
  } catch( ex ) {
  }
}
