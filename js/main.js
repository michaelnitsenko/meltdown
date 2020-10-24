"use strict";

var stopped = false;

function resume() {
    stopped = false;
}

function stop() {
    document.getElementById("startButton").onclick = resume;
    stopped = true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// File

function onFileIsLoaded(event){
    let imageData = new Uint8Array(event.target.result);
    console.log("works");
    var blob = new Blob([imageData], {type: "image/png"});
    var blobTempUrl = URL.createObjectURL(blob);
    var element = document.getElementById("result_image");
    element.onload = function() {
        let _canvas = document.createElement("canvas");
        _canvas.width = element.width;
        _canvas.height = element.height;
        let _c2d = _canvas.getContext("2d");
        _c2d.drawImage(element, 0, 0);
        let imageData = _c2d.getImageData(0, 0, element.width, element.height);
        processImageData(imageData)
    };

    element.src = blobTempUrl;
}

function setupFileLoader(event) {
    var file = this.files[0];
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

