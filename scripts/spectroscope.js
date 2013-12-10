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
		sampleWidth = 4; // larger means faster movement, sadly not higher sampling rate :-( )

        canvas.width=scopeWidth;
        canvas.height=scopeHeight;

		analyser = audio.RealtimeAnalyzer.forPlayer(models.player)// , audio.BAND31);  // default bands is 512.  audio.BAND31 is a suggested
		analyser.addEventListener("audio", doDraw);


		// chroma.js makes colours to a scale.  The actual lowest value for a frequency is -94, but setting it to -90
		// instead seems to make for ever so slightly cleaner plots, where we discard the very quietest signals (which
		// were probably noise anyway)
		// Spotify blog says +0 is the loudest, but the API docs say +12.  API seems to be more right.

		gradient = chroma.scale(["navy", "purple", "red", "orange", "lightyellow", "white"]).domain([-90,12]);
		//gradient = chroma.scale(["black", "white"]).domain([-90,12], "log");

		window.onresize = function() { init() };  // TODO keep old scope data maybe, rather than complete reset?
	};





	var doDraw = function(data) {

		var spectrum = data.audio.spectrum;

		ctx = document.getElementById("canvas").getContext("2d");

		var channelHeight = scopeHeight/2;
		var spectrumLength = spectrum.left.length;
		var blockHeight = channelHeight/spectrumLength;

        // iterate over the elements from the array
        for (var i = 0; i < spectrumLength; (i++)) {
            // draw each pixel with the specific color
            var valueLeft = spectrum.left[i],
            	valueRight = spectrum.right[i];

            // draw the line at the right side of the canvas
            ctx.fillStyle = gradient(valueLeft).hex();
            ctx.fillRect(scopeWidth - (sampleWidth * blockHeight), channelHeight-blockHeight - (blockHeight *i), sampleWidth*blockHeight, blockHeight);

            ctx.fillStyle = gradient(valueRight).hex();
            ctx.fillRect(scopeWidth - (sampleWidth * blockHeight), channelHeight             + (blockHeight *i), sampleWidth*blockHeight, blockHeight);
        }

        ctx.save();
        ctx.translate(Math.round(-sampleWidth*blockHeight),0);
        ctx.drawImage(canvas, 0, 0);
        ctx.restore();
	};

	exports.init = init;
	exports.doDraw = doDraw;
});