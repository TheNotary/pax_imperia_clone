window.mouse = { x: 0, y: 0 };
systemA = {};
systemA.id = 1;
systemA.x = 2;
systemA.y = 2;
systemA.connections = [2]

systemB = {};
systemB.id = 2;
systemB.x = 4;
systemB.y = 3;
systemA.connections = [1, 3]

systemC = {};
systemC.id = 3;
systemC.x = 6;
systemC.y = 3;
systemA.connections = [2]

window.systems = [ systemA, systemB, systemC ];



window.requestAnimationFrame(redraw);




function drawBackground() {
    let cx = document.querySelector("canvas").getContext("2d");

    cx.fillStyle = "Black";
    cx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawStars(20);
}

function redraw() {
    let cx = document.querySelector("canvas").getContext("2d");

    cx.strokeStyle = "blue";

    for (let i = 0; i < systems.length; i++) {
        system = systems[i];

        let cx = document.querySelector("canvas").getContext("2d");

        const transform = cx.getTransform();

        let cWidth = canvas.width;
        let cHeight = canvas.height;

        let lengthOfRect = 20;
        let displacement = 22;
        let scale = 22;
        let radius = 10;
        let offsetX = system.x * (scale-1) - radius;
        let offsetY = system.y * (scale-1) - radius;

        // Draw lines
        cx.beginPath();
        cx.strokeStyle = "orange";
        let thisX = system.x + offsetX + radius;
        let thisY = system.y + offsetY + radius;
        cx.moveTo(thisX, thisY);
        cx.lineTo(20, 20);
        cx.stroke();

        // Draw Circles
        cx.beginPath();
        let x = system.x * scale;
        let y = system.y * scale;
        cx.arc(x, y, radius, 0, 2 * Math.PI);
        cx.fillStyle = "black";
        colorCircle(cx, offsetX, offsetY, lengthOfRect);
        cx.fill();
        cx.stroke();
        
    }

    window.requestAnimationFrame(redraw);
}

function colorCircle(cx, offsetX, offsetY, lengthOfRect) {
    // If Hovered!
    if (     window.mouse.x > system.x + offsetX
                && window.mouse.x < system.x + offsetX + lengthOfRect
                && window.mouse.y > system.y + offsetY
                && window.mouse.y < system.y + offsetY + lengthOfRect) {
            console.log("window.mouse.x, y: " + window.mouse.x + ", " + window.mouse.y);
            console.log("system.x, y: " + system.x + ", " + system.y);

            // console.log("Hovered! i: " + i);
            cx.strokeStyle = "green";
    }
    else {
        cx.strokeStyle = "blue";
    }
}

function drawStars(starCount){
    let cx = document.querySelector("canvas").getContext("2d");
    
    cx.fillStyle = "rgb(200, 200, 200)";

    let width = canvas.width;
    let height = canvas.height;

    for (let i = 0; i < starCount; i++){
        x = Math.random() * width;
        y = Math.random() * height;
        
        drawDot(x, y, 2);
    }
}

function drawDot(x, y, size){
    let cx = document.querySelector("canvas").getContext("2d");
    cx.fillRect(x, y, size, size);
    cx.fill();
}

function getTransformedPoint(x, y) {
    let cx = document.querySelector("canvas").getContext("2d");

    const transform = cx.getTransform();
    const transformedX = x - transform.e;
    const transformedY = y - transform.f;
    return { x: transformedX, y: transformedY };
}

let canvas = document.querySelector("canvas");

// We can use our function with a canvas event
canvas.addEventListener('mousemove', event => {
    const transformedCursorPosition = getTransformedPoint(event.offsetX, event.offsetY);

    window.mouse = transformedCursorPosition;
    // window.systems[0].hovered = true;
    // console.log(window.systems[0].x);
    // console.log(transformedCursorPosition);
});

drawBackground();
