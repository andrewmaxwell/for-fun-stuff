'use strict';

(() => {

	var Game = window.Game;
	var Solver = window.Solver;

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
		],
		another2: [ // 1,746,461
			'mmoooO',
			'mbbboo',
			'oooooo',
			'oOoooO'
		]
	};

	var scenario = scenarios.another2; // change this to try other scenarios

	var game = new Game(scenario.length, scenario[0].length);
	var solver = new Solver(game);

	console.profile('solve');
	var solution = solver.solve(game.toState(scenario));
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
