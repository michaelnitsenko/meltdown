"use strict";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// global
const soundOutput = new SoundOutput();
let uploader;

function transmit() {
    var img = document.getElementById("_image");
    let _canvas = document.createElement("canvas");
    _canvas.width = img.width;
    _canvas.height = img.height;
    let _c2d = _canvas.getContext("2d");
    _c2d.translate(0, img.height);
    _c2d.scale(1, -1);
    _c2d.drawImage(img, 0, 0);
    let imageData = _c2d.getImageData(0, 0, img.width, img.height);
    processImageData(imageData);
}


function onFileIsLoaded(event){
    let imageData = new Uint8Array(event.target.result);
    var blob = new Blob([imageData], {type: "image/png"});
    var blobTempUrl = URL.createObjectURL(blob);
    var img = document.getElementById("image");
    var _img = document.getElementById("_image");
    img.onload = function() {
        document.getElementById("startButton").style.display = "inline";
    };

    img.src = blobTempUrl;
    _img.src = blobTempUrl;
}

function onFileLoaderChange(event) {
    var file = document.getElementById("uploader").files[0];
    var reader = new FileReader();
    reader.onload = onFileIsLoaded;
    reader.readAsArrayBuffer(file);
}

function loadSample(event) {
    var img = document.getElementById("image");
    img.src = "images/sample.png";
    
    document.getElementById("startButton").style.display = "inline";
}

async function processImageData(imageData) {
    let width = imageData.width;
    let height = imageData.height;
    let brightnessLines = [];

    for (let i = 0; i < height; i++) {
        let brightnessLine = [];

        for (let j = 0; j < width; j++) {
            let brightness = 0;

            brightness += 0.299 * imageData.data[i * width * 4  + j * 4 + 0] / 255;
            brightness += 0.587 * imageData.data[i * width * 4 + j * 4 + 1] / 255;
            brightness += 0.114 * imageData.data[i * width * 4 + j * 4 + 2] / 255;
            
            brightnessLine.push(brightness);
        }

        brightnessLines.push(brightnessLine);
    }

    soundOutput.broadcastImageLine(brightnessLines, 0.1);
}
