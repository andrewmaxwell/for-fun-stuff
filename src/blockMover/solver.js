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
		this.limit = 1e7;
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

module.exports = Solver;
