const assert = require('assert');
const Life = require('../public/life.js');

function from(rows) { return rows.map(s => [...s].map(ch => (ch === '#' ? 1 : 0))); }
function show(g) { return g.map(r => r.map(x => (x ? '#' : '.')).join('')); }
let n = 0; function ok(name, fn) { fn(); n++; console.log('ok -', name); }

ok('grade vazia fica vazia', () => assert.strictEqual(Life.countAlive(Life.nextGeneration(Life.createGrid(5))), 0));

ok('blinker oscila (periodo 2)', () => {
  const h = from(['.....', '.....', '.###.', '.....', '.....']);
  const v = Life.nextGeneration(h);
  assert.deepStrictEqual(show(v), ['.....', '..#..', '..#..', '..#..', '.....']);
  assert.deepStrictEqual(Life.nextGeneration(v), h);
});

ok('bloco 2x2 e estavel', () => {
  const b = from(['....', '.##.', '.##.', '....']);
  assert.deepStrictEqual(Life.nextGeneration(b), b);
});

ok('planador anda (1,1) apos 4 geracoes', () => {
  let g = from(['.#....', '..#...', '###...', '......', '......', '......']);
  for (let i = 0; i < 4; i++) g = Life.nextGeneration(g);
  assert.deepStrictEqual(show(g), ['......', '..#...', '...#..', '.###..', '......', '......']);
});

ok('isolamento: celula sozinha e com 1 vizinha morrem', () => {
  assert.strictEqual(Life.countAlive(Life.nextGeneration(from(['...', '.#.', '...']))), 0);
  assert.strictEqual(Life.countAlive(Life.nextGeneration(from(['##.', '...', '...']))), 0);
});

ok('superpopulacao: centro com 4 vizinhas morre', () => {
  const g = from(['.#.', '###', '.#.']);
  assert.strictEqual(Life.nextGeneration(g)[1][1], 0);
});

ok('nascimento com exatamente 3 (e nao com 2 ou 4)', () => {
  assert.strictEqual(Life.nextState(0, 3), 1);
  assert.strictEqual(Life.nextState(0, 2), 0);
  assert.strictEqual(Life.nextState(0, 4), 0);
});

ok('bordas: canto so enxerga 3 vizinhas e nao ha conexao entre bordas opostas', () => {
  const g = from(['##.', '##.', '...']);
  assert.strictEqual(Life.countNeighbors(g, 0, 0), 3);
  const t = from(['#.#', '...', '...']);
  assert.strictEqual(Life.countNeighbors(t, 0, 0), 0);
});

ok('atualizacao simultanea (nao altera a matriz original)', () => {
  const g = from(['.....', '.###.', '.....']);
  const copia = JSON.stringify(g);
  Life.nextGeneration(g);
  assert.strictEqual(JSON.stringify(g), copia);
});

ok('resizeGrid preserva regiao comum', () => {
  const g = from(['#..', '.#.', '..#']);
  assert.deepStrictEqual(show(Life.resizeGrid(g, 2)), ['#.', '.#']);
  assert.deepStrictEqual(show(Life.resizeGrid(g, 4)), ['#...', '.#..', '..#.', '....']);
});

ok('gridsEqual e countAlive', () => {
  assert.ok(Life.gridsEqual(from(['#.']), from(['#.'])));
  assert.ok(!Life.gridsEqual(from(['#.']), from(['.#'])));
  assert.strictEqual(Life.countAlive(from(['##', '.#'])), 3);
});
console.log(`\n${n} testes passaram.`);
