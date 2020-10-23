"use strict";

// global
const soundInput = new SoundInput();
let canvas, c2d, analyser;

const frequenciecReadIntervalMs = 80;
const maxRGBColors = 2 ** 24

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
        // TODO: loop
        while (true) {
            await sleep(frequenciecReadIntervalMs);
            readFrequesncies();
        }
        
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

    const maxFreqNumber = analyser.fftSize / 2;

    analyser.getByteFrequencyData(freqs);
    analyser.getByteTimeDomainData(tds);
    c2d.clearRect(0, 0, canvas.width, canvas.height);
    c2d.save();
    c2d.scale(canvas.width / analyser.fftSize, 1);

    const signalPowerDelta = Math.abs(analyser.maxDecibels - analyser.minDecibels);
    const colorsPerDecibell = maxRGBColors / maxFreqNumber;

    // console.log("maxRGBColors", maxRGBColors)
    // console.log("colorsPerDecibell", colorsPerDecibell)
    // console.log("signalPowerDelta", signalPowerDelta)

    var s = 0;
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const v = freqs[i];

        const color = "#"+v.toString(16)+"0000";
        if (i % 1000 == 0) {
            console.log("v",v)
            console.log("color",color);
        }

        c2d.fillStyle = color;
        c2d.fillRect(i * 2, canvas.height - v, 2, v);
        s += v;
    }

    c2d.restore();
}
