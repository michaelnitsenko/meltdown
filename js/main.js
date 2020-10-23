"use strict";

// global
const soundInput = new SoundInput();
const soundOutput = new SoundOutput();
let canvas, c2d, analyser;

function onLoad() {
    canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 256;
    document.body.appendChild(canvas);

    c2d = canvas.getContext("2d");

    soundInput.startCapturing(function (soundInputAnalyser) {
        analyser = soundInputAnalyser;
        // TODO: loop
        readFrequesncies();
        //
    });

}

// Audio

function indexHue(index) {
    return (Math.log2(index) % 1) * 360; // coloring by octave 
}

function readFrequesncies() {
    const tds = new Uint8Array(analyser.fftSize);
    const freqs = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(freqs);
    analyser.getByteTimeDomainData(tds);
    c2d.clearRect(0, 0, canvas.width, canvas.height);
    c2d.save();
    c2d.scale(canvas.width / analyser.fftSize, 1);

    var s = 0;
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const v = freqs[i];
        c2d.fillStyle = `hsl(${indexHue(i)}, 50%, 50%)`;
        c2d.fillRect(i * 2, canvas.height - v, 2, v);
        s += v;
    }

    c2d.restore();
}
