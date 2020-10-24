"use strict";

// global
const soundOutput = new SoundOutput();
let uploader;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// File

function onFileIsLoaded(event){
    let imageData = new Uint8Array(event.target.result);
    var blob = new Blob([imageData], {type: "image/png"});
    var blobTempUrl = URL.createObjectURL(blob);
    var img = document.getElementById("image");
    img.onload = function() {
        let _canvas = document.createElement("canvas");
        _canvas.width = img.width;
        _canvas.height = img.height;
        let _c2d = _canvas.getContext("2d");
        _c2d.drawImage(img, 0, 0);
        let imageData = _c2d.getImageData(0, 0, img.width, img.height);
        processImageData(imageData);
    };

    img.src = blobTempUrl;
}

function onFileLoaderChange(event) {
    var file = document.getElementById("uploader").files[0];
    var reader = new FileReader();
    reader.onload = onFileIsLoaded;
    reader.readAsArrayBuffer(file);
}

async function processImageData(imageData) {

    //[0, 1, 2, 3, 4, 5, 6, 7]

    let width = imageData.width;
    let height = imageData.height;
    let timeOffset = 0;
    let timeStep = 200;

    for (let i = 0; i < height; i += 1) {
        let brightnessLine = [];

        for (let j = 0; j < width; j += 1) {
            let brightness = 0;


            for (let rgba = 0; rgba < 3; rgba += 1) {
                brightness += imageData.data[i * height + j * 4 + rgba];
            }
                
            brightnessLine.push(brightness / (3 * 255));
        }

        console.log(brightnessLine);
        await sleep(timeStep);
        soundOutput.broadcastImageLine(brightnessLine, timeStep / 1000);
        
        timeOffset += timeStep;
    }
}
