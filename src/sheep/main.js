const makeRenderer = require('./renderer');
const makeStatCanvas = require('./stats');
const makeSim = require('./sim');

const scale = 4;
const speed = 1;

const params = {
	width: 200,
	height: 200,
	startingSheep: 300,
	grassGrowthRate: 0.0001, // each pixel gains x energy per iteration
	eatAmountMult: 0.1, // sheep can eat x * the amount grass on a cell per iteration

	grassEnergyMult: 0.02, // multiplier for amount of energy gained by eating
	energyLossRate: 0.0005, // each sheep loses x energy per iteration
	newbornEnergy: 0.01, // sheep start with x energy when they are born or reproduce
	ageNutritionMult: 0.00003, // sheep get less energy as they age

	raptorAppears: 0, // when sheep population reaches this level and there are no raptors, one appears
	// raptorStartingEnergy: 100
};

const game = makeSim(params);
const renderer = makeRenderer(game, params, scale);
const stats = makeStatCanvas({
	width: 300,
	height: scale * params.height,
	cols: [
		{prop: 'age', color: '#AAA'},
		{prop: 'energy', color: 'green'}
	]
});

document.body.style.margin = 0;
document.body.appendChild(renderer.canvas);
document.body.appendChild(stats.canvas);

var loop = () => {
	for (var s = 0; s < speed; s++) game.iterate();

	renderer.render();

	stats.render(
		game.getSheeps().map(s => ({
			age: s.age * params.ageNutritionMult,
			energy: s.energy
		}))
	);

	// setTimeout(loop, 200);
	requestAnimationFrame(loop);
};
loop();

renderer.canvas.ondblclick = () => game.reset();
