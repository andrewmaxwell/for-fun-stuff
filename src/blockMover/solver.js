function extractSolution(state){
	var solution = [];
	do {
		solution.unshift(state);
		state = state.prev;
	} while (state);
	return solution;
}

function solve(game, start, limit){
	var queue = [start];
	var seen = new Set();

	seen.add(game.toId(start));

	for (var i = 0; i < queue.length && queue.length < limit; i++){
		var nextStates = game.getNextStates(queue[i]);

		for (var j = 0; j < nextStates.length; j++){
			var next = nextStates[j];
			var nextId = game.toId(next);

			if (seen.add(nextId).size > queue.length){
				next.prev = queue[i];
				queue.push(next);

				if (game.isSolved(next)){
					console.log(queue.length + ' states checked');
					return extractSolution(next);
				}
			}
		}
	}

	return [];
}

module.exports = solve;
