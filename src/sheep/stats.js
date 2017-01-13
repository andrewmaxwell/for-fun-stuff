function makeStatCanvas({width, height, cols}){
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	canvas.style.background = '#F8F8F8';

	return {
		canvas,
		render(stats){
			var ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, width, height);

			var h = height / stats.length / cols.length;

			cols.forEach((col, i) => {
				ctx.fillStyle = col.color;
				ctx.beginPath();
				stats.forEach((s, j) => {
					ctx.rect(0, j * h * cols.length + i * h, s[col.prop] * width, h);
				});
				ctx.fill();
			});



			// ctx.fillStyle = 'black';
			// ctx.textBaseline = 'middle';
			// stats.forEach((s, i) => {
			// 	ctx.fillText(Math.floor(s * 100), 1, (i + 0.5) * h);
			// });
		}
	};
}

module.exports = makeStatCanvas;
