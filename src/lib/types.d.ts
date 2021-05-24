
export interface HighScores {
  best_word: string
  game_types: Array<{
    time_limit: number
    score: number
  }>
}
