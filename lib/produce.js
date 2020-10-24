"use strict";
//https://marcgg.com/blog/2016/11/01/javascript-audio/#

class SoundOutput {
    constructor() {
        this.context = null;
    }

    startProducingSound(frequencies, amplitudes, duration) {
        const AudioContext = window.AudioContext // Default
            || window.webkitAudioContext; // Safari and old versions of Chrome
        let context = new AudioContext();
        for (var i = 0; i < frequencies.length; i++) {
            let o = context.createOscillator();
            let g = context.createGain();
    
            o.frequency.value = frequencies[i];
            o.type = "sine";
            o.connect(g);
            o.connect(context.destination);
            o.start();
            o.stop(context.currentTime + duration);
        }
    }

    broadcastImageLine(values, duration) {
        // TODO: map values to frequencies and amplitude
        let frequencies = [];
        let amplitudes = [];
        this.startProducingSound(frequencies, amplitudes, duration);
    }
}
