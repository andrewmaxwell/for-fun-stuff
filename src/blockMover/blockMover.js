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
