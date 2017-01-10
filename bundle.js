/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var query = location.search.substring(1);
	var getFile = __webpack_require__(1);
	var allFiles = getFile.keys();
	var match = query && allFiles.find(f => f.includes(query));

	if (match){
		getFile(match);
	} else {
		document.body.innerHTML += allFiles.map(f => f.split('/')[1]).map(a => `<div><a href="?${a}">${a}</a></div>`).join('');
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./blockMover/main.js": 2,
		"./sheep/main.js": 5
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const blockMover = __webpack_require__(3);
	const solve = __webpack_require__(4);

	var scenarios = {
		simple: [ // 101,137
			'moooO',
			'obbbO',
			'obbbO',
			'ooOOO'
		],
		easy: [ // 214,250
			'OoooO',
			'obobo',
			'oomoo',
			'obobo',
			'OoooO'
		],
		medium: [ // 1,746,461
			'MoooO',
			'obbbO',
			'obbbO',
			'obbbO',
			'OOOOo'
		],
		hard: [ // 2,527,266
			'OoooO',
			'ooboo',
			'mbobm',
			'ooboo',
			'OoooO'
		],
		reallyHard: [ // 7,334,579
			'OOoOO',
			'obbbo',
			'obmbo',
			'obbbo',
			'OOoOO'
		],
		another: [ // 3,809,383
			'MooooO',
			'ObbbbO',
			'ObbbbO',
			'OooooO'
		]
	};

	var scenario = scenarios.another; // change this to try other scenarios

	var game = blockMover(scenario.length, scenario[0].length);

	console.profile('solve');
	var solution = solve(game, game.toState(scenario), 5e6);
	console.profileEnd('solve');

	var canvases = solution.map(s => game.toCanvas(s, 400));
	if (canvases.length){

		var frame = 0;

		canvases.forEach(s => {
			s.style.display = 'none';
			document.body.appendChild(s);
		});

		setInterval(() => {
			canvases[(frame - 1 + canvases.length) % canvases.length].style.display = 'none';
			canvases[frame % canvases.length].style.display = 'block';
			frame++;
		}, 200);
	} else console.log('No solution found');


/***/ },
/* 3 */
/***/ function(module, exports) {

	const EMPTY = 1, MOVER = 2, BLOCK = 3, EMPTY_GOAL = -1, MOVER_ON_GOAL = -2, BLOCK_ON_GOAL = -3;
	const DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const COLORS = ['green', '#EEE', 'red', 'blue'];

	function blockMover(rows, cols){

		function getStateInDirection(state, moverX, moverY, dir){
			// look for an empty spot in the dir direction, starting with one space away
			var dist = 	(dir[0] > 0 ? cols - moverX - 1 : dir[0] < 0 ? moverX : 0) +
									(dir[1] > 0 ? rows - moverY - 1 : dir[1] < 0 ? moverY : 0);
			for (var i = 1; i <= dist; i++) {
				var cell = state[(moverY + dir[1] * i) * cols + moverX + dir[0] * i];
				if (cell == EMPTY || cell == EMPTY_GOAL){
					var copy = state.slice(0);
					for (; i >= 0; i--){
						var toIndex = (moverY + dir[1] * i) * cols + moverX + dir[0] * i;
						copy[toIndex] = (state[toIndex] < 0 ? -1 : 1) * (i ? Math.abs(state[toIndex - dir[1] * cols - dir[0]]) : EMPTY);
					}
					return copy;
				}
			}
		}

		return {
			getNextStates(state){
				var result = [];
				for (var y = 0; y < rows; y++){
					for (var x = 0; x < cols; x++){
						var cell = state[y * cols + x];
						if (cell == MOVER || cell == MOVER_ON_GOAL){
							for (var i = 0; i < DIRECTIONS.length; i++){
								var newState = getStateInDirection(state, x, y, DIRECTIONS[i]);
								if (newState) result.push(newState);
							}
						}
					}
				}
				return result;
			},
			isSolved(state){
				return !state.includes(EMPTY_GOAL) && !state.includes(MOVER_ON_GOAL);
			},
			toId(state){
				// return state.join('');
				var result = 0;
				for (var i = 0; i < state.length; i++){
					result = result * 3 + Math.abs(state[i]) - 1;
				}
				return result;
			},
			toState(start){
				var lookup = {B: BLOCK_ON_GOAL, M: MOVER_ON_GOAL, O: EMPTY_GOAL, o: EMPTY, m: MOVER, b: BLOCK};
				return start.join('').split('').map(c => lookup[c]);
			},
			toCanvas(state, canvasWidth){
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');

				var scale = canvasWidth / cols;
				canvas.height = rows * scale;
				canvas.width = cols * scale;
				ctx.scale(scale, scale);

				for (var y = 0; y < rows; y++){
					for (var x = 0; x < cols; x++){
						var cell = state[y * cols + x];
						if (cell < 0){
							ctx.fillStyle = COLORS[0];
							ctx.fillRect(x, y, 1, 1);
						}
						ctx.fillStyle = COLORS[Math.abs(cell)];
						ctx.fillRect(x + 0.1, y + 0.1, 0.8, 0.8);
					}
				}

				return canvas;
			}
		};

	}

	module.exports = blockMover;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function extractSolution(state){
		var solution = [];
		do {
			solution.unshift(state);
			state = state.prev;
		} while (state);
		return solution;
	}

	function solve(game, start, limit){
		var queue = [start];
		var seen = new Set();

		seen.add(game.toId(start));

		for (var i = 0; i < queue.length && queue.length < limit; i++){
			var nextStates = game.getNextStates(queue[i]);

			for (var j = 0; j < nextStates.length; j++){
				var next = nextStates[j];
				var nextId = game.toId(next);

				if (seen.add(nextId).size > queue.length){
					next.prev = queue[i];
					queue.push(next);

					if (game.isSolved(next)){
						console.log(queue.length + ' states checked');
						return extractSolution(next);
					}
				}
			}
		}

		return [];
	}

	module.exports = solve;


/***/ },
/* 5 */
/***/ function(module, exports) {

	

/***/ }
/******/ ]);