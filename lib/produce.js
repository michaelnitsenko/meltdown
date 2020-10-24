"use strict";
//https://marcgg.com/blog/2016/11/01/javascript-audio/#

class SoundOutput {
    startProducingSound(frequencies, gains, timeOffsets) {
        const AudioContext = window.AudioContext // Default
            || window.webkitAudioContext; // Safari and old versions of Chrome
        let context = new AudioContext();
        for (let i = 0; i < frequencies.length; i++) {
            let o = context.createOscillator();
            o.frequency.value = frequencies[i];
            o.type = "sine";

            let g = context.createGain();
            let duration = 0;
            for (let j = 0; j < gains.length; j++) {
                let offset = timeOffsets[i];
                g.gain.setValueAtTime(gains[j][i], context.currentTime + offset);
                duration += offset;
            }
    
            o.connect(g);
            g.connect(context.destination);

            o.start(0);
            o.stop(context.currentTime + duration);
        }
    }

    broadcastImageLine(values, pointSize) {
        let frequencies = [];
        for (let i = 0; i < values[0].length; i++) {
            frequencies.push(1000 + 10 * i);
        }
        
        let timeStep = pointSize;
        let timeOffsets = [];
        for (let i = 0; i < values.length; i++) {
            timeOffsets.push(timeStep * i);
        }

        let gains = values;

        this.startProducingSound(frequencies, gains, timeOffsets);
    }
}
