import "./style/main.scss";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const video = document.createElement("video");
video.autoplay = true;
video.muted = true;
video.width = 640;
video.height = 480;

const container = document.createElement("div");
container.appendChild(video);
document.body.appendChild(container);

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd";
script.onload = main;
document.body.appendChild(script);

let model = null;
const detected = [];

function detect() {
    model.detect(video).then((predictions) => {
        for (let i = 0; i < detected.length; i++) {
            container.removeChild(detected[i]);
        }
        detected.splice(0);

        for (const prediction of predictions) {
            if (prediction.score > 0.75) {
                const marker = document.createElement("span");
                marker.innerText = `
                    ${prediction.class} (${Math.round(
                        parseFloat(prediction.score) * 100,
                    )}%)
                `;
                marker.style = `color:white;`;

                container.appendChild(marker);
                detected.push(marker);
            }
        }

        window.requestAnimationFrame(detect);
    });
}

async function main() {
    model = await cocoSsd.load();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.addEventListener("loadeddata", detect);
};
