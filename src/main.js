window.onload = function () {
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    file.onchange = function () {
        const files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();

        const context = new AudioContext();
        const src = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();

        const canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        // analyser.fftSize = 1024;
        analyser.fftSize = 64;

        const COUNT = analyser.frequencyBinCount;

        var dataArray = new Uint8Array(COUNT);

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const barWidth = Math.round((WIDTH - COUNT * 1) / COUNT);
        // var barWidth = Math.round((WIDTH) / bufferLength);

        console.log("COUNT %d, WIDTH %d, HEIGHT %d, barWidth %d", COUNT, WIDTH, HEIGHT, barWidth);

        // create gradient for bar
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#0f0');
        gradient.addColorStop(0.5, '#ff0');
        gradient.addColorStop(0, '#f00');

        var barHeight;
        var x = 0;

        function renderFrame() {
            requestAnimationFrame(renderFrame);

            analyser.getByteFrequencyData(dataArray);

            // draw background
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            x = 0;
            for (var i = 0; i < COUNT; i++) {
                barHeight = Math.round(dataArray[i] / 255 * HEIGHT);

                // draw bar
                ctx.fillStyle = gradient;
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                // draw text
                // ctx.fillStyle = "green";
                // ctx.fillText(dataArray[i], x, HEIGHT - barHeight - 10);
                // ctx.fillStyle = "white";
                // ctx.fillText(i+1, x, HEIGHT);

                x += barWidth + 1;
                // x += barWidth;
            }
        }

        audio.play();
        renderFrame();
    };
};