'use strict';

(() => {

	var Game = window.Game;
	var Solver = window.Solver;

	var scenarios = {
		simple: {
			rows: 4,
			cols: 5,
			board: [ // 101,137
				'moooO',
				'obbbO',
				'obbbO',
				'ooOOO'
			]
		},
		easy: {
			rows: 4,
			cols: 5,
			board: [ // 214,250
				'OoooO',
				'obobo',
				'oomoo',
				'obobo',
				'OoooO'
			]
		},
		medium: {
			rows: 5,
			cols: 5,
			board: [ // 1,746,461
				'MoooO',
				'obbbO',
				'obbbO',
				'obbbO',
				'OOOOo'
			]
		},
		hard: {
			rows: 5,
			cols: 5,
			board: [ // 2,527,266
				'OoooO',
				'ooboo',
				'mbobm',
				'ooboo',
				'OoooO'
			]
		},
		reallyHard: {
			rows: 5,
			cols: 5,
			board: [ // 7,334,579
				'OOoOO',
				'obbbo',
				'obmbo',
				'obbbo',
				'OOoOO'
			]
		}
	};

	var scenario = scenarios.hard; // change this to try other scenarios

	var game = new Game(scenario.rows, scenario.cols);
	var solver = new Solver(game);

	console.profile('solve');
	var solution = solver.solve(game.toState(scenario.board));
	console.profileEnd('solve');

	var canvases = solution.map(s => game.toCanvas(s, 400));
	if (!canvases.length) console.log('No solution found');
	else {

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
	}

})();
