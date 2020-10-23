"use strict";
//https://marcgg.com/blog/2016/11/01/javascript-audio/#
class SoundOutput {
    startProducingSound() {
        const AudioContext = window.AudioContext // Default
            || window.webkitAudioContext; // Safari and old versions of Chrome
        const context = new AudioContext();
        var o = context.createOscillator();
        var g = context.createGain();

        var frequency = 440.0
        o.frequency.value = frequency
        o.type = "sine";
        o.connect(g);
        o.connect(context.destination);
        o.start();
    }
}
