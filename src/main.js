import "./style/main.scss";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const video = document.createElement("video");
video.autoplay = true;
video.muted = true;
video.width = 640;
video.height = 480;

const container = document.createElement("div");
container.classList.add("video-inference");
container.appendChild(video);

const app = document.createElement("div");
app.classList.add("app");
app.dataset.bsTheme = "dark";

app.appendChild(container);

const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd";
script.onload = main;
app.appendChild(script);

document.body.appendChild(app);

const marker = document.createElement("div");
marker.classList.add("video-inference__marker");
const markers = new Array(6).fill(null).reduce((acc, _) => {
    const clone = marker.cloneNode();
    container.appendChild(clone);
    acc.push(clone);

    return acc;
}, []);

let model = null;

function detect() {
    model.detect(video).then((inferences) => {
        for (const index in markers) {
            const marker = markers[index];
            const inference = inferences[index];

            marker.innerText = "";
            marker.style = "left:0; top:0; width:0; height:0;";

            if (inference && inference.score > 0.67) {
                marker.innerText = ` - ${inference.class} (${Math.round(
                    parseFloat(inference.score) * 100,
                )}%)`;
                marker.style = `
                    left: ${parseInt(Math.round(inference.bbox[0]))}px;
                    top: ${parseInt(Math.round(inference.bbox[1]))}px;
                    width: ${parseInt(Math.round(inference.bbox[2]))}px;
                    height: ${parseInt(Math.round(inference.bbox[3]))}px;
                `;
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
}
