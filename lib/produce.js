"use strict";
//https://marcgg.com/blog/2016/11/01/javascript-audio/#

class SoundOutput {
    constructor() {
        this.context = null;
    }

    startProducingSound(frequencies, gains, duration) {
        const AudioContext = window.AudioContext // Default
            || window.webkitAudioContext; // Safari and old versions of Chrome
        let context = new AudioContext();
        for (var i = 0; i < frequencies.length; i++) {
            let o = context.createOscillator();
            let g = context.createGain();
            g.gain.value = gains[i];
    
            o.frequency.value = frequencies[i];
            o.type = "sine";
            o.connect(g);
            g.connect(context.destination);
            o.start(0);
            o.stop(context.currentTime + duration);
        }
    }

    broadcastImageLine(values, duration) {
        let frequencies = [];
        const length = values.length;
        const frequencyStep = 20000 / length;
        for (let i = 0; i < length; i++) {
            frequencies.push(frequencyStep * i);
        }
        
        this.startProducingSound(frequencies, values, duration);
    }
}
