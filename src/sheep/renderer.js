function makeRenderer(game, params, scale){

	const tan = [207, 197, 126];
	const green = [25, 128, 0];

	var canvas = document.createElement('canvas');

	canvas.width = params.width;
	canvas.height = params.height;

	canvas.style.width = params.width * scale + 'px';
	canvas.style.height = params.height * scale + 'px';
	canvas.style['image-rendering'] = 'pixelated';

	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(params.width, params.height);
	var D = imageData.data;
	for (var i = 0; i < imageData.data.length; i++) imageData.data[i] = 255;

	function setColor(x, y, r, g, b){
		var k = 4 * (y * params.width + x);
		D[k + 0] = r;
		D[k + 1] = g;
		D[k + 2] = b;
	}

	return {
		canvas,
		render(){

			for (var y = 0; y < params.height; y++){
				for (var x = 0; x < params.width; x++){
					var amt = game.getCell(x, y).grass;
					setColor(
						x, y,
						tan[0] * (1 - amt) + green[0] * amt,
						tan[1] * (1 - amt) + green[1] * amt,
						tan[2] * (1 - amt) + green[2] * amt
					);
				}
			}



			game.getWolves().forEach(s => {
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
