const Grid = require('./grid');
const {randomIndex} = require('./utils');

const SimplexNoise = require('./simplex');
const simplex = new SimplexNoise();
const noise = (x, y) => simplex.noise2D(x, y) * 0.5 + 0.5;

function makeSim(params){

	var grid, sheeps, raptors;

	function reset(){

		grid = new Grid({
			width: params.width,
			height: params.height,
			initCell: cell => {
				cell.grass = 1;//Math.random();
				cell.occupant = noise(
					cell.x / params.rockScaleX,
					cell.y / params.rockScaleY
				) < params.rockThreshold;
			}
		});

		sheeps = [];
		raptors = [];

		for (let i = 0; i < params.startingSheep; i++){
			addSheep(grid.randomEmptySpace());
		}
	}

	function addSheep(coord){
		let s = {
			x: coord.x,
			y: coord.y,
			energy: params.newbornEnergy,
			age: 0
		};
		grid.setOccupant(s);
		sheeps.push(s);
	}

	function addRaptor(coord){
		let s = {
			x: coord.x,
			y: coord.y,
			path: []
		};
		grid.setOccupant(s);
		raptors.push(s);
	}

	function killSheep(sheepIndex){
		if (sheepIndex > -1){
			var s = sheeps[sheepIndex];
			grid.removeOccupant(s);
			sheeps.splice(sheepIndex, 1);
			return true;
		}
		return false;
	}

	function moveSheep(s){

		let currentCell = grid.getCell(s.x, s.y);

		let isRunning = currentCell.neighbors.some(
			n => n.raptorDist <= params.sightDistance
		);

		let moveTo = grid.getBestNeighbor(
			currentCell,
			cell => !cell.occupant && cell.raptorDist + cell.grass * 0.5
		);

		if (moveTo){
			if (s.energy >= 1){
				s.energy = params.newbornEnergy;
				addSheep({
					x: moveTo.x,
					y: moveTo.y
				});
			} else {
				currentCell.occupant = null;
				currentCell = moveTo;
				s.x = currentCell.x;
				s.y = currentCell.y;
			}
		}

		let eatAmount = isRunning ? 0 : currentCell.grass * params.eatAmountMult;
		s.energy = Math.max(0,
			s.energy +
			-params.energyLossRate +
			eatAmount * params.grassEnergyMult * Math.exp(-s.age)
		);
		s.age += params.ageAmt;
		currentCell.grass -= eatAmount;
		currentCell.occupant = s;
		return s.energy > 0;
	}


	function moveRaptor(w){

		let currentCell = grid.getCell(w.x, w.y);
		let path = w.path = grid.getPath(
				currentCell,
				cell => cell.occupant && sheeps.includes(cell.occupant),
				params.sightDistance
			);
		let moveTo = (1 + Math.random() < params.raptorSpeed && path[path.length - 2]) ||  path[path.length - 1] ||
			randomIndex(currentCell.neighbors.filter(n => !n.occupant));

		if (moveTo){
			currentCell.occupant = null;
			w.x = moveTo.x;
			w.y = moveTo.y;
			if (moveTo.occupant){
				killSheep(sheeps.indexOf(moveTo.occupant));
			}
			moveTo.occupant = w;
		}

	}

	function calculateRaptorsDistances(){
		grid.eachCell(cell => {
			cell.raptorDist = params.sightDistance + 1;
		});

		raptors.forEach(r => {
			grid.getPath(grid.getCell(r.x, r.y), (cell, dist) => {
				cell.raptorDist = Math.min(cell.raptorDist, dist);
				return false;
			}, params.sightDistance);
		});
	}

	reset();

	return {
		reset,
		iterate(){

			if (!raptors.length && sheeps.length >= params.raptorAppears){
				addRaptor(grid.randomEmptySpace());
			}

			calculateRaptorsDistances();

			for (let s = 0; s < sheeps.length; s++){
				if (!moveSheep(sheeps[s])){
					killSheep(s--);
				}
			}

			for (let w = 0; w < raptors.length; w++){
				moveRaptor(raptors[w]);
			}

			grid.eachCell(cell => {
				cell.grass = Math.min(1, cell.grass + params.grassGrowthRate);
			});
		},
		getSheeps(){
			return sheeps;
		},
		getRaptors(){
			return raptors;
		},
		getCell(x, y){
			return grid.getCell(x, y);
		}
	};
}

module.exports = makeSim;
