import "./style/main.scss";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

(async function main() {
    const markersCount = 6;
    const streamWidth = 640;
    const streamHeight = 480;

    const model = await cocoSsd.load();
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: streamWidth, height: streamHeight },
    });

    const video = document.createElement("video");
    video.autoplay = true;
    video.muted = true;
    video.width = streamWidth;
    video.height = streamHeight;
    video.srcObject = stream;
    video.addEventListener("loadeddata", detect);

    const container = document.createElement("div");
    container.classList.add("video-inference");
    container.appendChild(video);

    const app = document.createElement("div");
    app.classList.add("app");
    app.dataset.bsTheme = "dark";
    app.appendChild(container);
    document.body.appendChild(app);

    const marker = document.createElement("div");
    marker.classList.add("video-inference__marker");
    const markers = new Array(markersCount).fill(null).reduce((acc, _) => {
        const clone = marker.cloneNode();
        container.appendChild(clone);
        acc.push(clone);

        return acc;
    }, []);

    function detect() {
        model.detect(video, markersCount, 0.67).then((inferences) => {
            for (const index in markers) {
                const marker = markers[index];
                const inference = inferences[index];

                marker.innerText = "";
                marker.style = "left:0; top:0; width:0; height:0;";

                if (inference) {
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
})();
