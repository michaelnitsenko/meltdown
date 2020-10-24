"use strict";
//https://marcgg.com/blog/2016/11/01/javascript-audio/#

class SoundOutput {
    startProducingSound(frequencies, gains, timeStep) {
        const AudioContext = window.AudioContext // Default
            || window.webkitAudioContext; // Safari and old versions of Chrome
        let context = new AudioContext();
        let time = context.currentTime;
        for (let i = 0; i < frequencies.length; i++) {
            let o = context.createOscillator();
            o.frequency.value = frequencies[i];
            o.type = "sine";

            let g = context.createGain();
            for (let j = 0; j < gains.length; j++) {
                g.gain.setValueAtTime(gains[j][i], time + timeStep * j);
            }
            
            o.connect(g);
            g.connect(context.destination);

            o.start(0);
            let duration = timeStep * gains.length;
            o.stop(context.currentTime + duration);
        }
    }

    broadcastImageLine(values, pointHeight) {
        let frequencies = [];
        for (let i = 0; i < values[0].length; i++) {
            frequencies.push(5000 + 100 * i);
        }
        
        let gains = values;
        let timeStep = pointHeight;
        this.startProducingSound(frequencies, gains, timeStep);
    }
}
