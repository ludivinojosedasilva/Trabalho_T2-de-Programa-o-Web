/*
 * life.js - LOGICA DE EVOLUCAO DA POPULACAO (sem nenhuma dependencia de Vue/DOM).
 * Funciona no navegador (window.Life) e no Node (require), o que permite testar
 * o algoritmo separadamente da interface.
 *
 * Representacao: matriz bidimensional (array de arrays) com 0 = morta e 1 = viva.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Life = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Cria uma matriz rows x cols preenchida com celulas mortas.
  function createGrid(rows, cols) {
    if (cols === undefined) cols = rows;
    const grid = [];
    for (let r = 0; r < rows; r++) grid.push(new Array(cols).fill(0));
    return grid;
  }

  // Conta as vizinhas vivas (8 direcoes). Vizinhas fora da grade sao ignoradas:
  // as bordas opostas NAO sao conectadas.
  function countNeighbors(grid, r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;            // nao conta a propria celula
        const rr = r + dr;
        const cc = c + dc;
        if (rr < 0 || rr >= grid.length) continue;     // fora da grade (linha)
        if (cc < 0 || cc >= grid[rr].length) continue; // fora da grade (coluna)
        if (grid[rr][cc]) count++;
      }
    }
    return count;
  }

  // Regras de Conway para UMA celula, dado seu estado e o numero de vizinhas vivas.
  function nextState(alive, neighbors) {
    if (alive) return neighbors === 2 || neighbors === 3 ? 1 : 0; // sobrevivencia / isolamento / superpopulacao
    return neighbors === 3 ? 1 : 0;                                // nascimento
  }

  // Calcula a proxima geracao. Le SOMENTE da matriz atual e escreve numa matriz
  // nova (duas matrizes); so no final o chamador troca atual por proxima.
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

  // Quantidade de celulas vivas.
  function countAlive(grid) {
    let total = 0;
    for (const row of grid) for (const cell of row) if (cell) total++;
    return total;
  }

  // Redimensiona para rows x cols, preservando as celulas da regiao em comum.
  function resizeGrid(grid, rows, cols) {
    if (cols === undefined) cols = rows;
    const out = createGrid(rows, cols);
    for (let r = 0; r < Math.min(rows, grid.length); r++) {
      for (let c = 0; c < Math.min(cols, grid[r].length); c++) out[r][c] = grid[r][c] ? 1 : 0;
    }
    return out;
  }

  // Compara duas grades (usado para detectar populacao estavel).
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
