const {randomIndex, shuffle} = require('./utils');
const DIRECTIONS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
// const DIRECTIONS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

class Grid {
	constructor({width, height, initCell, iterateCell}){

		this.width = width;
		this.height = height;
		this.iterateCell = iterateCell;

		var grid = this.grid = [];

		for (let y = 0; y < height; y++){
			grid[y] = [];
			for (let x = 0; x < width; x++){
				grid[y][x] = {
					x, y,
					id: y * width + x,
					neighbors: []
				};
				initCell(grid[y][x]);
			}
		}
		for (let y = 0; y < height; y++){
			for (let x = 0; x < width; x++){
				shuffle(DIRECTIONS);
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
	}
	getCell(x, y){
		return this.grid[y][x];
	}
	getOccupant(x, y){
		return this.getCell(x, y).occupant;
	}
	setOccupant(ob){
		this.getCell(ob.x, ob.y).occupant = ob;
	}
	removeOccupant(ob){
		this.getCell(ob.x, ob.y).occupant = null;
	}
	eachCell(func){
		for (let y = 0; y < this.width; y++){
			for (let x = 0; x < this.height; x++){
				func(this.getCell(x, y));
			}
		}
	}
	getBestNeighbor(currentCell, cellUtility){
		let utilVals = currentCell.neighbors.map(cellUtility);
		let maxUtilVal = Math.max(...utilVals);
		return randomIndex(currentCell.neighbors.filter(
			(n, i) => utilVals[i] > 0 && utilVals[i] == maxUtilVal
		));
	}
	getPath(start, goalCondition, maxDist){
		if (goalCondition(start, 0)) return [];

		let queue = [start];
		let seen = {};

		start.dist = 0;
		seen[start.id] = true;

		for (let i = 0; i < queue.length; i++){
			let current = queue[i];
			if (current.dist + 1 > maxDist) continue;

			// shuffle(current.neighbors);
			for (let j = 0; j < current.neighbors.length; j++){
				let cell = current.neighbors[j];
				if (!seen[cell.id]){

					if (goalCondition(cell, current.dist + 1)){
						let path = [cell];
						while (current != start) {
							path.push(current);
							current = current.prev;
						}
						return path;
					}

					if (!cell.occupant){
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
	randomEmptySpace(){
		let x, y;
		do {
			x = Math.floor(Math.random() * this.width);
			y = Math.floor(Math.random() * this.height);
		} while (this.getOccupant(x, y));
		return {x, y};
	}
}

module.exports = Grid;
