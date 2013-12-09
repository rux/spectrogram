require([
	'$api/models',
	'$api/audio'
], function(models, audio) {
	'use strict';


	var
		canvas,
		cw,
		ch,
		ctx,
		analyser,
		gradient,
		audio_event_handlers,
		running=false;


	var init = function() {
		analyser = audio.RealtimeAnalyzer.forPlayer(models.player)// , audio.BAND31);
		analyser.addEventListener("audio", doDraw);

		canvas = document.getElementById("canvas");

        canvas.width=800;
        canvas.height=512;

		gradient = chroma.scale(["navy", "purple", "red", "orange", "lightyellow", "white"]).domain([-94,12]);
	};




	var doDraw = function(data) {

		ctx = document.getElementById("canvas").getContext("2d");

		var spectrum = data.audio.spectrum;

        // iterate over the elements from the array
        for (var i = 0; i < spectrum.left.length; (i++)) {
            // draw each pixel with the specific color
            var valueLeft = spectrum.left[i],
            	valueRight = spectrum.right[i];

            // draw the line at the right side of the canvas
            ctx.fillStyle = gradient(valueLeft).hex();
            ctx.fillRect(800 - 2, 255 - i/2, 2, 0.5);

            ctx.fillStyle = gradient(valueRight).hex();
            ctx.fillRect(800 - 2, 257 + i/2, 2, 0.5);
        }

        ctx.save();
        ctx.translate(-2,0);
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
	};






	exports.init = init;
	exports.doDraw = doDraw;
});