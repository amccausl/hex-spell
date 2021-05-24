<script context="module" lang="ts">
  export const prerender = false
</script>

<script lang="ts">
  export let game
  export let dictionary

  import { flip } from "svelte/animate"

  import HexTile from "$lib/HexTile.svelte"
  import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    getAdjacentDirection,
    getTilePositionIndex,
    isAdjacent,
  } from '$lib/helpers'

  let path = []
  let is_active = false
  let selected_flags = Array( BOARD_WIDTH * BOARD_HEIGHT ).fill( false )

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
    game.match( path, dictionary )
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
          selected_flags[ tile_index ] = getAdjacentDirection( tile_index, path[ path.length - 1 ] )
          path.push( value ); path = path
        }
      } else if( path_index === path.length - 2 ) {
        const index = path.pop(); path = path
        selected_flags[ index ] = false
      }
    }
  }
</script>

<section class="board">
  <div class="board-tiles"
    on:mouseleave|preventDefault={ () => handleBoardLeave() }
    on:mouseup|preventDefault={ () => handleMouseUp() }
  >
    {#each $game.board_tiles as col_tiles, col_index}
      <div class="board-tiles__col" class:board-tiles__col--even={ col_index % 2 }>
        {#each col_tiles as tile, row_index (tile.index)}
          <div class="board-tiles__tile" animate:flip="{{ duration: 400 }}">
            {#if typeof( selected_flags[ getTilePositionIndex( row_index, col_index ) ] ) !== "boolean"}
              <div class="{ `board-tiles__edge board-tiles__edge--position-${ selected_flags[ getTilePositionIndex( row_index, col_index ) ] }` }"></div>
            {/if}
            <HexTile tile={ tile.value } is_selected={ selected_flags[ getTilePositionIndex( row_index, col_index ) ] !== false }
              on:mousedown={ () => handleHexPress( row_index, col_index ) }
              on:mouseover={ () => handleHexOver( row_index, col_index ) }
            />
          </div>
        {/each}
      </div>
    {/each}
  </div>
</section>

<style type="text/scss">
  .board {
    border: solid #43363d 2px;
    min-width: 877px;
  }

  .board-tiles {
    display: flex;
    flex-direction: row;
    padding-left: 27px;
    min-width: 846px;
    max-height: 730px;
    overflow: hidden;

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
      user-select: none;
      position: relative;
    }

    &__edge {
      background-color: #D1A386;
      width: 9px;
      height: 20px;
      position: absolute;
      top: -10px;
      right: 56px;

      &--position-2 {
        transform: translate(47px, 22px) rotate(57deg);
      }

      &--position-4 {
        transform: translate(47px, 78px) rotate(125deg);
      }

      &--position-6 {
        transform: translate(0px, 105px);
      }

      &--position-8 {
        transform: translate(-47px, 78px) rotate(57deg)
      }

      &--position-10 {
        transform: translate(-47px, 22px) rotate(125deg);
      }
    }
  }
</style>
