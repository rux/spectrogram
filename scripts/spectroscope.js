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
		gradients,
		gradient,
		gradientIndex,
		sampleWidth,

		scopeHeight,
		scopeWidth,

		spectrum,

		refreshRate
		;



	var init = function() {
		canvas = document.getElementById("canvas");
		canvas.height = 0; // this is to stop an old canvas size from interfering if we have a window resize.
		scopeHeight = document.height; // to fill the screen from top to bottom
		scopeWidth = document.width;
		sampleWidth = 2; // larger means faster movement, sadly not higher sampling rate :-(

		canvas.width=scopeWidth;
		canvas.height=scopeHeight;


		ctx = document.getElementById("canvas").getContext("2d");


		analyser = audio.RealtimeAnalyzer.forPlayer(models.player);
										// default bands is 512.  Swap the above line for the one below for low res
		// analyser = audio.RealtimeAnalyzer.forPlayer(models.player, audio.BAND31);
										// however you should change the sampleWidth to 1 or 2 if you choose
										// to swap to the BAND31 version.
		//analyser.addEventListener("audio", doDraw);
		analyser.addEventListener("audio", setSpectrumData);

		//analyser.addEventListener("audio", doDebug);


		//  set off the timer
		refreshRate = 60; // this is the number of times per second the draw will get called

		setInterval(doDraw, (1000/refreshRate));


		// chroma.js makes colours to a scale.  The actual lowest value for a frequency is -94, but setting it to -90
		// instead seems to make for ever so slightly cleaner plots, where we discard the very quietest signals (which
		// were probably noise anyway)
		// Spotify blog says +0 is the loudest, but the API docs say +12.  API seems to be more right.

		gradientIndex=0;
		gradients = [];
		gradients.push ( chroma.scale(["navy", "purple", "red", "orange", "lightyellow", "white"]).domain([-90,12]) );
		gradients.push ( chroma.scale(["black", "white"]).domain([-90,12], "log") );
		gradients.push ( chroma.scale(["white", "black"]).domain([-90,12], "log") );
		gradients.push ( chroma.scale(["black", "#00FF00", "#ffffff"]).domain([-90,12]) );
		rotateColours() ;
		$(document).click( rotateColours );


		window.onresize = function() { init(); };  // TODO keep old scope data maybe, rather than complete reset?
	};


	var rotateColours = function() {
		gradient = gradients[gradientIndex % (gradients.length)];
		gradientIndex++;
	};


	var doDebug = function(data) {
		var debugdiv
		//console.log(data)
	}


	var setSpectrumData = function(data) {
		spectrum = data.audio.spectrum
	}

	var doDraw = function() {

		//var spectrum = data.audio.spectrum;


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
			ctx.fillRect(scopeWidth - (sampleWidth * blockHeight),
				channelHeight-blockHeight - (blockHeight *i),
				sampleWidth*blockHeight,
				blockHeight);

			ctx.fillStyle = gradient(valueRight).hex();
			ctx.fillRect(scopeWidth - (sampleWidth * blockHeight),
				channelHeight + (blockHeight *i),
				sampleWidth*blockHeight,
				blockHeight);
		}

		ctx.save();
		ctx.translate(Math.ceil(-sampleWidth*blockHeight),0);
		ctx.drawImage(canvas, 0, 0);
		ctx.restore();
	};

	exports.init = init;
});