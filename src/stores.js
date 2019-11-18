import { writable } from 'svelte/store';

export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 12

export const matched_words = writable( 0 );
export const board_tiles = writable( [] );
