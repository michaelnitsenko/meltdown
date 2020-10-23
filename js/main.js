"use strict";

// global
const soundInput = new SoundInput();
const soundOutput = new SoundOutput();
let canvas, c2d, analyser;

const frequenciecReadIntervalMs = 80;

const fftSize = 128;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function onLoad() {
    canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 256;
    document.body.appendChild(canvas);

    c2d = canvas.getContext("2d");

    soundInput.startCapturing(async function (soundInputAnalyser) {
        analyser = soundInputAnalyser;
        while (true) {
            await sleep(frequenciecReadIntervalMs);
            readFrequesncies();
        }
    });

}


// Audio
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

        const color = `hsl(${256 - v}, 50%, 50%)`;
        c2d.fillStyle = color;
        c2d.fillRect(i * 2, canvas.height - v, 2, v);
        s += v;
    }

    c2d.restore();
}
