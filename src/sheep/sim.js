var shuffle = function(arr) {
	let counter = arr.length;
	while (counter > 0) {
		let index = Math.floor(Math.random() * counter);
		counter--;
		let temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
};

function randomIndex(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}

function makeSim(params){
	const DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	var grid, sheeps, raptors;

	function reset(){
		grid = [];
		sheeps = [];
		raptors = [];

		for (let y = 0; y < params.height; y++){
			grid[y] = [];
			for (let x = 0; x < params.width; x++){
				grid[y][x] = {
					x, y,
					id: y * params.width + x,
					grass: Math.random(),
					occupant: null,
					neighbors: []
				};
			}
		}
		for (let y = 0; y < params.height; y++){
			for (let x = 0; x < params.width; x++){
				for (let i = 0; i < DIRECTIONS.length; i++){
					let d = DIRECTIONS[i];
					let row = grid[y + d[1]];
					let cell = row && row[x + d[0]];
					if (cell){
						grid[y][x].neighbors.push(cell);
					}
				}
			}
		}

		for (let i = 0; i < params.startingSheep; i++){
			addSheep(findEmptySpace());
		}
	}

	function addSheep(s){
		s.energy = params.newbornEnergy;
		s.age = 1;
		grid[s.y][s.x].occupant = s;
		sheeps.push(s);
	}

	function addRaptor(s){
		// s.energy = params.raptorStartingEnergy;
		s.path = [];
		grid[s.y][s.x].occupant = s;
		raptors.push(s);
	}

	function killSheep(sheepIndex){
		if (sheepIndex > -1){
			var s = sheeps[sheepIndex];
			grid[s.y][s.x].occupant = null;
			sheeps.splice(sheepIndex, 1);
			return true;
		}
		return false;
	}

	function moveSheep(s){
		let vals = [];
		let max = -Infinity;
		let currentCell = grid[s.y][s.x];
		let neighbors = currentCell.neighbors;

		for (let j = 0; j < neighbors.length; j++){
			let cell = neighbors[j];

			if (!cell.occupant){
				if (s.energy >= 1){
					s.energy = params.newbornEnergy;
					addSheep({
						x: cell.x,
						y: cell.y
					});
				}
				if (cell.grass > currentCell.grass) {
					vals[j] = cell.grass;
					max = Math.max(max, cell.grass);
				}
			}

		}

		if (max > 0){ // this sheep can move
			currentCell.occupant = null;

			let topNeighbors = [];
			for (let k = 0; k < vals.length; k++){
				if (vals[k] == max){
					topNeighbors.push(neighbors[k]);
				}
			}

			currentCell = randomIndex(topNeighbors);
			s.x = currentCell.x;
			s.y = currentCell.y;
		}

		var eatAmount = currentCell.grass * params.eatAmountMult;
		s.energy = Math.max(0,
			s.energy +
			-params.energyLossRate +
			eatAmount * params.grassEnergyMult * Math.exp(-s.age * params.ageNutritionMult)
		);
		s.age++;
		currentCell.grass -= eatAmount;
		currentCell.occupant = s;
		return s.energy > 0;
	}

	function getPath(startCoords, goalCondition, maxDist){
		let start = grid[startCoords.y][startCoords.x];
		let queue = [start];
		let seen = {};

		start.dist = 0;

		seen[start.id] = true;

		for (let i = 0; i < queue.length; i++){
			let current = queue[i];
			if (current.dist + 1 >= maxDist) continue;

			shuffle(current.neighbors);
			for (let j = 0; j < current.neighbors.length; j++){
				let cell = current.neighbors[j];
				if (!seen[cell.id]){
					if (goalCondition(cell)){
						let path = [cell];
						while (current != start) {
							path.push(current);
							current = current.prev;
						}
						return path;
					} else if (!cell.occupant){
						queue.push(cell);
						seen[cell.id] = true;
						cell.prev = current;
						cell.dist = current.dist + 1;
					}
				}
			}
		}
		return [];
	}

	function getRaptorPath(w){
		return getPath(w, cell => cell.occupant && sheeps.includes(cell.occupant), 50);
	}

	function moveRaptor(w){

		let path = w.path = getRaptorPath(w);
		let moveTo = path[path.length - 1];

		if (moveTo){
			grid[w.y][w.x].occupant = null;
			w.x = moveTo.x;
			w.y = moveTo.y;

			killSheep(sheeps.indexOf(moveTo.occupant));
			moveTo.occupant = w;
		}

		return true;
	}

	function findEmptySpace(){
		let x, y;
		do {
			x = Math.floor(Math.random() * params.width);
			y = Math.floor(Math.random() * params.height);
		} while (grid[y][x].occupant);
		return {x, y};
	}

	function iterateCell(cell){
		cell.grass = Math.min(1, cell.grass + params.grassGrowthRate);
	}

	reset();

	return {
		reset,
		iterate(){

			if (!raptors.length && sheeps.length >= params.raptorAppears){
				addRaptor(findEmptySpace());
			}

			for (let s = 0; s < sheeps.length; s++){
				if (!moveSheep(sheeps[s])){
					killSheep(s--);
				}
			}

			for (let w = 0; w < raptors.length; w++){
				moveRaptor(raptors[w]);
			}

			for (let y = 0; y < params.height; y++){
				for (let x = 0; x < params.width; x++){
					iterateCell(grid[y][x]);
				}
			}
		},
		getSheeps(){
			return sheeps;
		},
		getWolves(){
			return raptors;
		},
		getCell(x, y){
			return grid[y][x];
		}
	};
}

module.exports = makeSim;
