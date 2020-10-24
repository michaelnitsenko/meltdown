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
    console.log(event);
    var file = document.getElementById("uploader").files[0];
    var reader = new FileReader();
    reader.onload = onFileIsLoaded;
    reader.readAsArrayBuffer(file);
}

async function processImageData(imageData) {
    let width = imageData.widht;
    let height = imageData.height;
    let timeOffset = 0;
    for (let i = 0; i < height; i += 1) {
        let brightnessLine = [];
        for (let j = 0; j < width; j += 1) {
            let brightness = 0;
            for (var rgba = 0; rgba < 4; rgba += 1) {
                brightness += imageData.data[i * height + j + rgba];
            }
                
            brightnessLine.push(brightness);
        }

        await sleep(timeOffset)
        soundOutput.broadcastImageLine(brightnessLine, 0.1);
        
        timeOffset += 10;
    }
}
