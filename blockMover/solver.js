'use strict';

// window.solve = (game, start, limit) => {
//
// 	var queue = [start];
// 	var seen = new Set();
// 	var solution;
// 	var count = 1;
//
// 	seen.add(game.toId(start));
//
// 	for (var i = 0; !solution && i < count && count < limit; i++){
// 		var nextStates = game.getNextStates(queue[i]);
//
// 		for (var j = 0; j < nextStates.length; j++){
// 			var next = nextStates[j];
// 			var nextId = game.toId(next);
//
// 			if (!seen.has(nextId)){
// 				seen.add(nextId);
// 				next.prev = queue[i];
// 				queue.push(next);
// 				count++;
//
// 				if (game.isSolved(next)){
// 					console.log(count + ' states checked');
//
// 					solution = [];
// 					do {
// 						solution.unshift(next);
// 						next = next.prev;
// 					} while (next);
// 				}
// 			}
// 		}
// 	}
//
// 	return solution || [];
// };

window.Solver = (() => {

	function extractSolution(state){
		var solution = [];
		do {
			solution.unshift(state);
			state = state.prev;
		} while (state);
		return solution;
	}

	class Solver {
		constructor(game){
			this.game = game;
			this.limit = 3e6;
		}
		solve(start){

			var queue = [start];
			var seen = new Set();

			seen.add(this.game.toId(start));

			for (var i = 0; i < queue.length && queue.length < this.limit; i++){
				var nextStates = this.game.getNextStates(queue[i]);

				for (var j = 0; j < nextStates.length; j++){
					var next = nextStates[j];
					var nextId = this.game.toId(next);

					if (seen.add(nextId).size > queue.length){
						next.prev = queue[i];
						queue.push(next);

						if (this.game.isSolved(next)){
							console.log(queue.length + ' states checked');
							return extractSolution(next);
						}
					}
				}
			}

			return [];
		}
	}

	return Solver;
})();
