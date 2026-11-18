(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Life = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function createGrid(rows, cols) {
    if (cols === undefined) cols = rows;
    const grid = [];
    for (let r = 0; r < rows; r++) grid.push(new Array(cols).fill(0));
    return grid;
  }

  function countNeighbors(grid, r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const rr = r + dr;
        const cc = c + dc;
        if (rr < 0 || rr >= grid.length) continue;
        if (cc < 0 || cc >= grid[rr].length) continue;
        if (grid[rr][cc]) count++;
      }
    }
    return count;
  }

  function nextState(alive, neighbors) {
    if (alive) return neighbors === 2 || neighbors === 3 ? 1 : 0;
    return neighbors === 3 ? 1 : 0;
  }

  function nextGeneration(grid) {
    const rows = grid.length;
    const cols = rows > 0 ? grid[0].length : 0;
    const next = createGrid(rows, cols);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        next[r][c] = nextState(grid[r][c], countNeighbors(grid, r, c));
      }
    }
    return next;
  }

  function countAlive(grid) {
    let total = 0;
    for (const row of grid) for (const cell of row) if (cell) total++;
    return total;
  }

  function resizeGrid(grid, rows, cols) {
    if (cols === undefined) cols = rows;
    const out = createGrid(rows, cols);
    for (let r = 0; r < Math.min(rows, grid.length); r++) {
      for (let c = 0; c < Math.min(cols, grid[r].length); c++) out[r][c] = grid[r][c] ? 1 : 0;
    }
    return out;
  }

  function gridsEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let r = 0; r < a.length; r++) {
      if (a[r].length !== b[r].length) return false;
      for (let c = 0; c < a[r].length; c++) if ((a[r][c] ? 1 : 0) !== (b[r][c] ? 1 : 0)) return false;
    }
    return true;
  }

  return { createGrid, countNeighbors, nextState, nextGeneration, countAlive, resizeGrid, gridsEqual };
});
