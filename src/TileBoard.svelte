<script>
  export let game

  import { flip } from "svelte/animate"

  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    getTileIndexPosition,
    getTilePositionIndex,
    isAdjacent,
  } from './store.mjs'
  import HexTile from "./HexTile.svelte"

  const { score_card, board_tiles } = game

  let path = []
  let is_active = false
  // @todo can this be a typed array?
  let selected_flags = Array( BOARD_WIDTH * BOARD_HEIGHT ).fill( false )

  let board_tiles_value
  const unsubscribe = board_tiles.subscribe( value => {
    board_tiles_value = value
  })

  function getLetter( index ) {
    const [ row_index, col_index ] = getTileIndexPosition( index )
    return board_tiles_value[ col_index ][ row_index ].value.toUpperCase()
  }

  function clearPath() {
    for( const item of path ) {
      selected_flags[ item ] = false
    }
    path = []
  }

  function handleBoardLeave() {
    is_active = false
    clearPath()
  }

  function handleMouseUp() {
    is_active = false
    if( path.length <= 2 ) {
      return
    }
    const word = path.map( getLetter ).join( "" )
    if( game.isWord( word.toLowerCase() ) ) {
      board_tiles.remove( path )
      score_card.push( word )
    }
    clearPath()
  }

  function handleHexPress( row_index, col_index ) {
    is_active = true
    clearPath()

    path = [ getTilePositionIndex( row_index, col_index ) ]
    selected_flags[ getTilePositionIndex( row_index, col_index ) ] = true
  }

  function handleHexOver( row_index, col_index ) {
    if( is_active ) {
      const value = getTilePositionIndex( row_index, col_index )
      const path_index = path.indexOf( value )
      if( path_index === -1 ) {
        const tile_index = getTilePositionIndex( row_index, col_index )
        if( path.length === 0 || isAdjacent( tile_index, path[ path.length - 1 ] ) ) {
          path.push( value ); path = path
          selected_flags[ tile_index ] = true
        }
      } else if( path_index === path.length - 2 ) {
        const index = path.pop(); path = path
        selected_flags[ index ] = false
      }
    }
  }
</script>

<section class="board"
  on:mouseleave|preventDefault={ () => handleBoardLeave() }
  on:mouseup|preventDefault={ () => handleMouseUp() }
>
  {#each board_tiles_value as col_tiles, col_index}
    <div class="board__col" class:board__col--even={ col_index % 2 }>
      {#each col_tiles as tile, row_index (tile.index)}
        <div class="board__tile" animate:flip>
          <HexTile tile={ tile.value } is_selected={ selected_flags[ getTilePositionIndex( row_index, col_index ) ] }
            on:mousedown={ () => handleHexPress( row_index, col_index ) }
            on:mouseover={ () => handleHexOver( row_index, col_index ) }
          />
        </div>
      {/each}
    </div>
  {/each}
</section>

<style type="text/scss">
  .board {
    display: flex;
    flex-direction: row;
    padding-left: 27px;
    max-height: 641px;
    overflow: hidden;
    border: solid black 2px;

    &__col {
      display: flex;
      flex-direction: column-reverse;
      margin-left: -26px;
      margin-bottom: -4px;
    }

    &__col--even {
      margin-bottom: 49px;
    }

    &__tile {
      margin-bottom: 4px;
      clip-path: polygon(93px 0%, 100% 50%, 93px 100%, 29px 100%, 0% 50%, 29px 0%);
      user-select: none;
    }
  }
</style>
