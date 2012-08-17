/**
@module audio
*/
/**
@class Audio
*/
exports.Audio = function () {
	this.observers = [];
	var audio = null;
	var audioContext = new webkitAudioContext();
	this.play = function (buffer) {
		var source = audioContext.createBufferSource();
		source.buffer = buffer;
		source.conncet(source.destination);
		source.noteOn(0);
	}
};