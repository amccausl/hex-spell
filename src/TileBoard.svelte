<script>
  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    board_tiles,
    getTileIndexPosition,
    getTilePositionIndex,
    isAdjacent,
    isWord,
    matched_words,
  } from './store.mjs'
  import HexTile from "./HexTile.svelte"

  let board_tiles_value
  let path = []
  let is_active = false
  // @todo can this be a typed array?
  let selected_flags = Array( BOARD_WIDTH * BOARD_HEIGHT ).fill( false )

  const unsubscribe = board_tiles.subscribe( value => {
    board_tiles_value = value
  })

  function getLetter( index ) {
    const [ row_index, col_index ] = getTileIndexPosition( index )
    return board_tiles_value[ row_index ][ col_index ].toUpperCase()
  }

  function clearPath() {
    for( const item of path ) {
      selected_flags[ item ] = false;
    }
    path = [];
  }

  function handleBoardLeave() {
    is_active = false;
    clearPath();
  }

  function handleMouseUp() {
    console.info('handleMouseUp')
    is_active = false;
    if( path.length <= 2 ) {
      return
    }
    const word = path.map( getLetter ).join( "" )
    if( isWord( word ) ) {
      // @todo update board
      matched_words.push( word )
    }
    clearPath();
  }

  function handleHexPress( row_index, col_index ) {
    console.info( "handleHexPress", row_index, col_index );
    is_active = true;
    clearPath();

    path = [ getTilePositionIndex( row_index, col_index ) ];
    selected_flags[ getTilePositionIndex( row_index, col_index ) ] = true;
  }

  function handleHexOver( row_index, col_index ) {
    if( is_active ) {
      const value = getTilePositionIndex( row_index, col_index )
      const path_index = path.indexOf( value )
      console.info( "handleHexOver", row_index, col_index, path_index )
      if( path_index === -1 ) {
        const tile_index = getTilePositionIndex( row_index, col_index )
        if( path.length === 0 || isAdjacent( tile_index, path[ path.length - 1 ] ) ) {
          path.push( value ); path = path
          selected_flags[ tile_index ] = true
          console.info( "handleHexOver", row_index, col_index, path )
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
  {#each board_tiles_value as row_tiles, row_index}
    <div class="board__row">
      {#each row_tiles as tile, col_index}
        <HexTile tile={ tile } is_even={ col_index % 2 } is_selected={ selected_flags[ getTilePositionIndex( row_index, col_index ) ] }
          on:mousedown={ () => handleHexPress( row_index, col_index ) }
          on:mouseover={ () => handleHexOver( row_index, col_index ) }
        />
      {/each}
    </div>
  {/each}
</section>

<style type="text/scss">
  $hex__color: yellow;
  $hex__color--selected: red;
  $hex__size: 60px;

  .board {
    display: flex;
    flex-direction: column-reverse;
    padding-right: 30px;
  }

  .board__row {
    clear: left;
  }
</style>
