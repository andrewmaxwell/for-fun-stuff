'use strict';

window.Game = (() => {

	const EMPTY = 1, MOVER = 2, BLOCK = 3, EMPTY_GOAL = -1, MOVER_ON_GOAL = -2, BLOCK_ON_GOAL = -3;
	const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const colors = ['green', '#EEE', 'red', 'blue'];

	class Game {
		constructor(rows, cols){
			this.rows = rows;
			this.cols = cols;
		}
		_getStateInDirection(state, moverX, moverY, dir){
			// look for an empty spot in the dir direction, starting with one space away
			var dist = 	(dir[0] > 0 ? this.cols - moverX - 1 : dir[0] < 0 ? moverX : 0) +
									(dir[1] > 0 ? this.rows - moverY - 1 : dir[1] < 0 ? moverY : 0);
			for (var i = 1; i <= dist; i++) {
				var cell = state[(moverY + dir[1] * i) * this.cols + moverX + dir[0] * i];
				if (cell == EMPTY || cell == EMPTY_GOAL){
					var copy = state.slice(0);
					for (; i >= 0; i--){
						var toIndex = (moverY + dir[1] * i) * this.cols + moverX + dir[0] * i;
						var from = i ? Math.abs(state[toIndex - dir[1] * this.cols - dir[0]]) : EMPTY;
						copy[toIndex] = state[toIndex] < 0 ? -from : from;
					}
					return copy;
				}
			}
		}
		getNextStates(state){
			var result = [];

			for (var y = 0; y < this.rows; y++){
				for (var x = 0; x < this.cols; x++){
					var cell = state[y * this.cols + x];
					if (cell == MOVER || cell == MOVER_ON_GOAL){
						for (var i = 0; i < directions.length; i++){
							var newState = this._getStateInDirection(state, x, y, directions[i]);
							if (newState) result.push(newState);
						}
					}
				}
			}
			return result;
		}
		isSolved(state){
			return !state.includes(EMPTY_GOAL) && !state.includes(MOVER_ON_GOAL);
		}
		toId(state){
			// return state.join('');
			var result = 0;
			for (var i = 0; i < state.length; i++){
				result = result * 3 + Math.abs(state[i]) - 1;
			}
			return result;
		}
		toState(start){
			var lookup = {B: BLOCK_ON_GOAL, M: MOVER_ON_GOAL, O: EMPTY_GOAL, o: EMPTY, m: MOVER, b: BLOCK};
			return start.join('').split('').map(c => lookup[c]);
		}
		toCanvas(state, canvasWidth){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			var scale = canvasWidth / this.cols;
			canvas.height = this.rows * scale;
			canvas.width = this.cols * scale;
			ctx.scale(scale, scale);

			for (var y = 0; y < this.rows; y++){
				for (var x = 0; x < this.cols; x++){
					var cell = state[y * this.cols + x];
					if (cell < 0){
						ctx.fillStyle = colors[0];
						ctx.fillRect(x, y, 1, 1);
					}
					ctx.fillStyle = colors[Math.abs(cell)];
					ctx.fillRect(x + 0.1, y + 0.1, 0.8, 0.8);
				}
			}

			return canvas;
		}
	}

	return Game;
})();
