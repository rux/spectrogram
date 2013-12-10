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
		sampleWidth,

		scopeHeight,
		scopeWidth;


	var init = function() {

		canvas = document.getElementById("canvas");
		canvas.height = 0; // this is to stop an old canvas size from interfering if we have a window resize.
		scopeHeight = document.height; // to fill the screen from top to bottom
		scopeWidth = document.width;
		sampleWidth = 2; // larger means faster movement, sadly not higher sampling rate :-( )

        canvas.width=scopeWidth;
        canvas.height=scopeHeight;

		analyser = audio.RealtimeAnalyzer.forPlayer(models.player) // , audio.BAND31);  // default bands is 512.  audio.BAND31 is a suggested
		analyser.addEventListener("audio", doDraw);

		//gradient = chroma.scale(["navy", "purple", "red", "orange", "lightyellow", "white"]).domain([-94,12]);
		//gradient = chroma.scale(["black", "red", "orange", "yellow", "white", "cyan"]).domain([-94,12]);
		gradient = chroma.scale(["black", "white"]).domain([-94,12], "log");


		window.onresize = function() { init() };  // TODO keep old scope data maybe, rather than complete reset?
	};





	var doDraw = function(data) {

		ctx = document.getElementById("canvas").getContext("2d");

		var channelHeight = scopeHeight/2;

		var spectrum = data.audio.spectrum;
		var spectrumLength = spectrum.left.length;

        // iterate over the elements from the array
        for (var i = 0; i < spectrumLength; (i++)) {
            // draw each pixel with the specific color
            var valueLeft = spectrum.left[i],
            	valueRight = spectrum.right[i];

            // draw the line at the right side of the canvas
            ctx.fillStyle = gradient(valueLeft).hex();
            ctx.fillRect(scopeWidth - sampleWidth, channelHeight -(spectrumLength/channelHeight) - (channelHeight *i/spectrumLength), sampleWidth, spectrumLength/channelHeight);

            ctx.fillStyle = gradient(valueRight).hex();
            ctx.fillRect(scopeWidth - sampleWidth, channelHeight + (channelHeight *i/spectrumLength), sampleWidth, spectrumLength/channelHeight);
        }

        ctx.save();
        ctx.translate(-sampleWidth,0);
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
	};

	exports.init = init;
	exports.doDraw = doDraw;
});