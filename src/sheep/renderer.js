function makeRenderer(game, params, scale){

	const tan = [207, 197, 126];
	const green = [25, 128, 0];
	// const lime = [0, 255, 0];
	// const magenta = [255, 0, 255];
	const rock = [66, 63, 51];

	let canvas = document.createElement('canvas');

	canvas.width = params.width;
	canvas.height = params.height;

	canvas.style.width = params.width * scale + 'px';
	canvas.style.height = params.height * scale + 'px';
	canvas.style['image-rendering'] = 'pixelated';

	let ctx = canvas.getContext('2d');
	let imageData = ctx.createImageData(params.width, params.height);
	let D = imageData.data;
	for (let i = 0; i < imageData.data.length; i++) imageData.data[i] = 255;

	function setColor(x, y, r, g, b){
		let k = 4 * (y * params.width + x);
		D[k + 0] = r;
		D[k + 1] = g;
		D[k + 2] = b;
	}

	return {
		canvas,
		render(){

			for (let y = 0; y < params.height; y++){
				for (let x = 0; x < params.width; x++){
					let cell = game.getCell(x, y);

					if (cell.occupant === true){
						setColor(x, y, ...rock);
					// } else if (cell.raptorDist <= params.sightDistance){
					// 	let amt = cell.raptorDist / params.sightDistance;
					// 	setColor(
					// 		x, y,
					// 		magenta[0] * (1 - amt) + lime[0] * amt,
					// 		magenta[1] * (1 - amt) + lime[1] * amt,
					// 		magenta[2] * (1 - amt) + lime[2] * amt
					// 	);
					} else {
						let amt = cell.grass;
						setColor(
							x, y,
							tan[0] * (1 - amt) + green[0] * amt,
							tan[1] * (1 - amt) + green[1] * amt,
							tan[2] * (1 - amt) + green[2] * amt
						);
					}
				}
			}

			game.getRaptors().forEach(s => {
				s.path.forEach(c => {
					setColor(c.x, c.y, 255, 0, 0);
				});
				setColor(s.x, s.y, 0, 0, 0);
			});

			game.getSheeps().forEach(s => {
				setColor(s.x, s.y, 255, 255, 255);
			});

			ctx.putImageData(imageData, 0, 0);
		}
	};
}

module.exports = makeRenderer;
