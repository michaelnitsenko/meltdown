"use strict";

// global
const soundInput = new SoundInput();
let barsCanvas, imageCanvas, analyser;

const frequenciecReadIntervalMs = 1;
const fftSize = 8192;

var stopped = false;

function resume() {
    stopped = false;
}

function stop() {
    document.getElementById("startButton").onclick = resume;
    stopped = true;
}

function onLoad() {
    barsCanvas = document.getElementById("barsCanvas");
    barsCanvas.width = fftSize/8;
    barsCanvas.height = 256;

    document.body.appendChild(barsCanvas);

    imageCanvas = document.getElementById("waterfallCanvas");
    imageCanvas.width = fftSize/8;
    imageCanvas.height = 800;

    document.body.appendChild(imageCanvas);

    soundInput.startCapturing(async function (soundInputAnalyser) {
        analyser = soundInputAnalyser;
        while (true) {
            await sleep(frequenciecReadIntervalMs);
            if (!stopped) {
                readFrequesncies();
            }
        }
    });
}

function HSLToRGBA(h,s,l) {
    // Must be fractions of 1
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    var a = 255;
    
    return [r, g, b, a]
}


function splicearrays(arr1, arr2) {
    var clampedArray = new Uint8ClampedArray(arr1.length*4 + arr2.length);

    for (let i = 0; i < arr1.length; i++) {
        clampedArray[i] = arr1[i];
    }

    for (let i = arr1.length; i < clampedArray.length; i++) {
        clampedArray[i] = arr2[i-arr1.length];
    }

    return clampedArray;
}


function freqsToRGBAClumpedArray(freqs) {
    var clampedArray = new Array(freqs.length*4);

    for (let i = 0; i < freqs.length; i+=4) {
        var rgba = HSLToRGBA(256 - freqs[i], 50, 50);

        clampedArray[i] = rgba[0];
        clampedArray[i+1] = rgba[1];
        clampedArray[i+2] = rgba[2];
        clampedArray[i+3] = rgba[3];
    }
    return new Uint8ClampedArray(clampedArray);
}

// Audio
function readFrequesncies() {
    const tds = new Uint8Array(analyser.fftSize);
    const freqs = new Uint8Array(analyser.frequencyBinCount);

    analyser.getByteFrequencyData(freqs);
    analyser.getByteTimeDomainData(tds);
    
    
    {
        var barsCanvasContext = barsCanvas.getContext("2d");
        barsCanvasContext.clearRect(0, 0, barsCanvas.width, barsCanvas.height);
        barsCanvasContext.save();
        barsCanvasContext.scale(barsCanvas.width / analyser.fftSize, 1);

        var s = 0;
        for (let i = 0; i < analyser.frequencyBinCount; i++) {
            const v = freqs[i];

            const color = `hsl(${256 - v}, 50%, 50%)`;
            barsCanvasContext.fillStyle = color;
            barsCanvasContext.fillRect(i * 2, barsCanvas.height - v, 2, v);
            s += v;
        }
        barsCanvasContext.restore();
    }

    {
        var imageCanvasContext = imageCanvas.getContext("2d");

        var currentImageData = imageCanvasContext.getImageData(0, 0, freqs.length, imageCanvas.height);
        var currentImageData = imageCanvasContext.putImageData(currentImageData, 0, 1);

        var clampedArray = new Uint8ClampedArray(freqs);
        clampedArray = freqsToRGBAClumpedArray(freqs); //splicearrays(clampedArray, currentImageData.data);


        var resultHeight = clampedArray.length/4/freqs.length;
        var resultWidth = freqs.length;

        var imageData = new ImageData(clampedArray, resultWidth, resultHeight);
    
        imageCanvasContext.putImageData(imageData, 0, 0);

    }
}
