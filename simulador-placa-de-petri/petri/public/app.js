const { createApp, ref, computed, watch, onUnmounted } = Vue;

const MIN_SIZE = 3;
const MAX_SIZE = 50;
const DEFAULT_SIZE = 10;

createApp({
  setup() {
    const size = ref(DEFAULT_SIZE);
    const sizeInput = ref(DEFAULT_SIZE);
    const grid = ref(Life.createGrid(DEFAULT_SIZE));
    const generation = ref(0);
    const phase = ref('parado');
    const speed = ref(300);
    const message = ref('Clique nas células para criar a configuração inicial.');
    let timer = null;

    const aliveCount = computed(() => Life.countAlive(grid.value));
    const running = computed(() => phase.value === 'executando');
    const editable = computed(() => !running.value);
    const cellPx = computed(() => Math.max(10, Math.floor(560 / size.value)));
    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${size.value}, ${cellPx.value}px)`,
      gridTemplateRows: `repeat(${size.value}, ${cellPx.value}px)`,
    }));
    const statusText = computed(() => ({
      parado: 'Parado', executando: 'Executando', pausado: 'Pausado',
    })[phase.value]);

    function stopTimer() { if (timer !== null) { clearInterval(timer); timer = null; } }
    function startTimer() { stopTimer(); timer = setInterval(autoStep, speed.value); }

    function advance() {
      const next = Life.nextGeneration(grid.value);
      const stable = Life.gridsEqual(grid.value, next);
      grid.value = next;
      generation.value++;
      return stable;
    }
    function autoStep() {
      const stable = advance();
      if (aliveCount.value === 0) pause('População extinta.');
      else if (stable) pause('População estável: nada mais muda.');
    }

    function start() {
      phase.value = 'executando';
      message.value = 'Simulação em execução.';
      startTimer();
    }
    function pause(msg) {
      stopTimer();
      phase.value = 'pausado';
      message.value = typeof msg === 'string' ? msg : 'Simulação pausada. Você pode editar as células.';
    }
    function resume() { start(); }
    function step() {
      if (running.value) return;
      advance();
      phase.value = 'pausado';
      message.value = 'Avançou uma geração.';
    }
    function edit() {
      if (running.value) pause();
      message.value = 'Modo de edição: clique nas células para vivê-las/matá-las.';
    }
    function reset() {
      stopTimer();
      grid.value = Life.createGrid(size.value);
      generation.value = 0;
      phase.value = 'parado';
      message.value = 'Grade reiniciada. Clique nas células para criar a configuração inicial.';
    }
    function toggleCell(r, c) {
      if (!editable.value) return;
      grid.value[r][c] = grid.value[r][c] ? 0 : 1;
    }
    function applySize() {
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

    watch(speed, () => { if (running.value) startTimer(); });
    onUnmounted(stopTimer);

    return {
      size, sizeInput, grid, generation, phase, speed, message, aliveCount, running,
      editable, gridStyle, cellPx, statusText, MIN_SIZE, MAX_SIZE,
      start, pause, resume, step, edit, reset, toggleCell, applySize,
    };
  },
}).mount('#app');
