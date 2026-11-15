/*
 * app.js - LOGICA DE APRESENTACAO (Vue 3, Composition API).
 * Toda a regra do jogo vem de Life (life.js); aqui so ha estado reativo da
 * interface, temporizador e tratamento de eventos.
 */
const { createApp, ref, computed, watch, onUnmounted } = Vue;

const MIN_SIZE = 3;
const MAX_SIZE = 50;
const DEFAULT_SIZE = 10;

createApp({
  setup() {
    // ---------- estado reativo ----------
    const size = ref(DEFAULT_SIZE);                    // lado da matriz (size x size)
    const sizeInput = ref(DEFAULT_SIZE);               // valor digitado no campo
    const grid = ref(Life.createGrid(DEFAULT_SIZE));   // geracao atual
    const generation = ref(0);                         // RF07
    const phase = ref('parado');                       // 'parado' | 'executando' | 'pausado'
    const speed = ref(300);                            // ms entre geracoes
    const message = ref('Clique nas células para criar a configuração inicial.');
    let timer = null;

    // ---------- valores derivados (reatividade) ----------
    const aliveCount = computed(() => Life.countAlive(grid.value)); // RF08
    const running = computed(() => phase.value === 'executando');
    const editable = computed(() => !running.value);   // so edita fora da execucao
    const cellPx = computed(() => Math.max(10, Math.floor(560 / size.value)));
    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${size.value}, ${cellPx.value}px)`,
      gridTemplateRows: `repeat(${size.value}, ${cellPx.value}px)`,
    }));
    const statusText = computed(() => ({
      parado: 'Parado', executando: 'Executando', pausado: 'Pausado',
    })[phase.value]);

    // ---------- temporizador ----------
    function stopTimer() { if (timer !== null) { clearInterval(timer); timer = null; } }
    function startTimer() { stopTimer(); timer = setInterval(autoStep, speed.value); }

    // ---------- evolucao ----------
    function advance() {                               // matriz atual -> proxima
      const next = Life.nextGeneration(grid.value);
      const stable = Life.gridsEqual(grid.value, next);
      grid.value = next;                               // a proxima substitui a atual
      generation.value++;
      return stable;
    }
    function autoStep() {                              // chamado pelo temporizador
      const stable = advance();
      if (aliveCount.value === 0) pause('População extinta.');
      else if (stable) pause('População estável: nada mais muda.');
    }

    // ---------- comandos ----------
    function start() {                                 // RF03
      phase.value = 'executando';
      message.value = 'Simulação em execução.';
      startTimer();
    }
    function pause(msg) {                              // RF04 (pausar)
      stopTimer();
      phase.value = 'pausado';
      message.value = typeof msg === 'string' ? msg : 'Simulação pausada. Você pode editar as células.';
    }
    function resume() { start(); }                     // RF04 (continuar)
    function step() {                                  // RF05
      if (running.value) return;
      advance();
      phase.value = 'pausado';
      message.value = 'Avançou uma geração.';
    }
    function edit() {                                  // botao "Editar geração"
      if (running.value) pause();
      message.value = 'Modo de edição: clique nas células para vivê-las/matá-las.';
    }
    function reset() {                                 // RF06
      stopTimer();
      grid.value = Life.createGrid(size.value);
      generation.value = 0;
      phase.value = 'parado';
      message.value = 'Grade reiniciada. Clique nas células para criar a configuração inicial.';
    }
    function toggleCell(r, c) {                        // RF02
      if (!editable.value) return;
      grid.value[r][c] = grid.value[r][c] ? 0 : 1;
    }
    function applySize() {                             // tamanho dinamico
      let n = Math.round(Number(sizeInput.value));
      if (!Number.isFinite(n)) n = size.value;
      n = Math.min(MAX_SIZE, Math.max(MIN_SIZE, n));
      sizeInput.value = n;
      if (n === size.value) return;
      if (running.value) pause();
      size.value = n;
      grid.value = Life.resizeGrid(grid.value, n);
      message.value = `Grade redimensionada para ${n}x${n}.`;
    }

    // mudar a velocidade durante a execucao reinicia o temporizador
    watch(speed, () => { if (running.value) startTimer(); });
    onUnmounted(stopTimer);

    return {
      size, sizeInput, grid, generation, phase, speed, message, aliveCount, running,
      editable, gridStyle, cellPx, statusText, MIN_SIZE, MAX_SIZE,
      start, pause, resume, step, edit, reset, toggleCell, applySize,
    };
  },
}).mount('#app');
