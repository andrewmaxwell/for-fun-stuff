const {makeGradient} = require('../shared/utils');
const red = [255, 0, 0];
const tan = [207, 197, 126];
const yellow = [255, 255, 0];
const green = [0, 128, 0];
const white = [255, 255, 255];

function makeRenderer({width, height, scale}){

	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;
	canvas.style.width = width * scale + 'px';
	canvas.style.height = height * scale + 'px';
	canvas.style['image-rendering'] = 'pixelated';

	const ctx = canvas.getContext('2d', {alpha: false});
	const imageData = ctx.createImageData(width, height);
	const D = imageData.data;
	const gradRes = 256;
	const grassGradient = makeGradient(tan, green, gradRes);

	function setColor(coord, color){
		const k = 4 * (coord.y * width + coord.x);
		D[k + 0] = color[0];
		D[k + 1] = color[1];
		D[k + 2] = color[2];
	}

	function renderGrass(cells){
		for (var i = 0; i < cells.length; i++){
			setColor(cells[i], grassGradient[Math.floor(cells[i].grass * gradRes)]);
		}
	}

	function renderRaptors(raptors){
		for (var i = 0; i < raptors.length; i++){
			var r = raptors[i];
			for (var j = 0; j < r.path.length; j++){
				setColor(r.path[j], yellow);
			}
			setColor(r, red);
		}
	}

	function renderSheeps(sheeps){
		for (var i = 0; i < sheeps.length; i++){
			setColor(sheeps[i], white);
		}
	}

	return {
		canvas,
		reset(){
			for (var i = 0; i < D.length; i += 4){
				D[i + 0] = 66;
				D[i + 1] = 63;
				D[i + 2] = 51;
				D[i + 3] = 255;
			}
		},
		render(cells, raptors, sheeps){
			renderGrass(cells);
			renderRaptors(raptors);
			renderSheeps(sheeps);
			ctx.putImageData(imageData, 0, 0);
		}
	};
}

module.exports = makeRenderer;
