// utils -> store

import LRU from 'lru-cache';

export const contentLoadedCache = new LRU({
  max: 500,
  maxAge: 5 * 6e4,
});
