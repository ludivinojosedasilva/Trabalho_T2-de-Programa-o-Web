# Simulador de Placa de Petri

Trabalho 2 de **Programação WEB** (UFSC Araranguá): um simulador de população de células em uma placa de petri (grade bidimensional), baseado no "Jogo da Vida" de Conway. Servidor em **Node.js + Express** e interface em **Vue 3**.

## Funcionalidades

* **Grade N x N** com células vivas (amarelo) e mortas (cinza).
* **Configuração inicial** clicando nas células.
* **Iniciar**, **Pausar** e **Continuar** a evolução automática.
* **Passo a passo**: avança exatamente uma geração.
* **Editar geração**: pausa a simulação e libera a edição das células.
* **Reiniciar**: volta para a grade vazia e geração 0.
* **Contador de gerações** e **contagem de células vivas**, atualizados pela reatividade do Vue.
* **Tamanho da grade configurável** (padrão 10x10, de 3 a 50).
* Controle de velocidade e pausa automática quando a população se extingue ou estabiliza.

## Regras do jogo

Cada célula considera suas 8 vizinhas (horizontais, verticais e diagonais):

|Situação|Condição|Próxima geração|
|-|-|-|
|Sobrevivência|viva com 2 ou 3 vizinhas vivas|viva|
|Isolamento|viva com menos de 2 vizinhas vivas|morta|
|Superpopulação|viva com mais de 3 vizinhas vivas|morta|
|Nascimento|morta com exatamente 3 vizinhas vivas|viva|

Todas as células são atualizadas **simultaneamente**: o cálculo usa duas matrizes (geração atual e próxima). As bordas da grade **não** são conectadas; vizinhas fora da grade são ignoradas.

## Estrutura do projeto

```
.
├── server.js            # Express: serve o frontend (pasta public/)
├── package.json
├── public/
│   ├── index.html       # Template Vue
│   ├── app.js           # Lógica de apresentação (Vue 3)
│   ├── life.js          # Lógica de evolução (sem Vue/DOM, testável no Node)
│   ├── style.css
│   └── vendor/
│       └── vue.global.prod.js
└── test/
    └── life.test.js     # Testes da lógica
```

A lógica do jogo (`life.js`) é separada da interface (`app.js` + `index.html`).

## Como executar

Requisito: [Node.js](https://nodejs.org/) 16 ou superior.

```bash
npm install
npm start
```

Abra no navegador: [http://localhost:3000](http://localhost:3000)

Para usar outra porta (PowerShell): `$env:PORT=8080; npm start`

## Testes

```bash
npm test
```

Cobrem blinker, bloco, planador, bordas, nascimento, isolamento, superpopulação, atualização simultânea e redimensionamento da grade.

## Tecnologias

* Node.js e Express
* Vue 3 (Composition API, sem etapa de build)
* JavaScript, HTML e CSS

## Autores

* Ludivino José Da Silva
* Marciano Có
* Lara Cyntia

