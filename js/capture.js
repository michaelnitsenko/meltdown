"use strict";

class SoundInput {
    startCapturing(callback) {
        navigator.mediaDevices.getUserMedia({
            video: false, audio: true
        }).then(stream => {
            const AudioContext = window.AudioContext // Default
                || window.webkitAudioContext; // Safari and old versions of Chrome
            const context = new AudioContext();
            const analyser = context.createAnalyser();
            analyser.fftSize = fftSize;
            console.log(analyser.maxDecibels, analyser.minDecibels)
            const source = context.createMediaStreamSource(stream);
            source.connect(analyser);
            
            callback(analyser);
        }).catch(err => console.log(err));    
    }
}
