"use strict";
//https://marcgg.com/blog/2016/11/01/javascript-audio/#

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class SoundOutput {
    constructor() {
        this.context = null;
        this.os = [];
    }

    startProducingSound(values, duration) {
        const AudioContext = window.AudioContext // Default
            || window.webkitAudioContext; // Safari and old versions of Chrome
        this.context = new AudioContext();
        this.os = [];
        for (var i = 0; i < values.length; i += 100) {
            var o = this.context.createOscillator();
            var g = this.context.createGain();
    
            o.frequency.value = values[i];
            o.type = "sine";
            o.connect(g);
            o.connect(this.context.destination);
            o.start();
            o.stop(this.context.currentTime + duration);
            this.os.push(0);
        }
    }
}
