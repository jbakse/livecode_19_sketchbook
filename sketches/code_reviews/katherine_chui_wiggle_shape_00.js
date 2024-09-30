// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js

function setup() {
    createCanvas(700, 700);
    background("#F1ECE5");
}
const colors = [
    "#93B399",
    "#67A072",
    "#84BC8F",
    "#F1E4D1", //tan
    "#F1734B", //orange
    "#FFFFFA", //white
];
var shapes = [];
var mousePoints = [];

//create the shape
function mouseClicked() {
    mousePoints.push([mouseX, mouseY]);
}

//save the shape
function keyPressed() {
    shapes.push({ "points": mousePoints, "color": random(colors) });
    mousePoints = [];
}

function draw() {
    background("#F1ECE5");

    for (let i = 0; i < shapes.length; i++) {
        let shape = shapes[i];
        noiseToShape(shape.points, frameCount, shape.color);
    }
    if (mousePoints.length > 0) {
        noFill();
        stroke("black");
        for (let i = 0; i < mousePoints.length - 1; i++) {
            line(
                mousePoints[i][0],
                mousePoints[i][1],
                mousePoints[i + 1][0],
                mousePoints[i + 1][1],
            );
        }
        line(
            mousePoints[mousePoints.length - 1][0],
            mousePoints[mousePoints.length - 1][1],
            mouseX,
            mouseY,
        );
    }
}

function noiseToShape(points, timeStamp, color) {
    function y_line(point1, point2, input_x) {
        //y=mx + b
        let [x1, y1] = point1;
        let [x2, y2] = point2;
        let m = (y2 - y1) / (x2 - x1);

        let output_y = m * (input_x - x1) + y1;
        return output_y;
    }

    function add_points(points) {
        var newPoints = [];
        for (let i = 0; i < points.length; i++) {
            let nextPointIdx = (i + 1) % (points.length);
            let nextPoint = points[nextPointIdx];
            let currPoint = points[i];
            let midpoint_x = (currPoint[0] + nextPoint[0]) / 2;

            midpoint_y = y_line(currPoint, nextPoint, midpoint_x);

            newPoints.push(currPoint);
            newPoints.push([midpoint_x, midpoint_y]);
        }
        return newPoints;
    }

    const numIters = 6; // number of interpolation iterations
    for (let i = 0; i < numIters; i++) {
        points = add_points(points);
    }

    const noiseZoom = 0.02;
    const noiseLevel = 20;

    const animationSpeed = .01;
    //Create the shape
    fill(color);
    // rect(100,100,100,100)
    beginShape();
    for (let i = 0; i < points.length; i++) {
        let x = points[i][0];
        let y = points[i][1];
        let n =
            noise(x * noiseZoom, y * noiseZoom, timeStamp * animationSpeed) *
            noiseLevel;
        vertex(x + n, y + n);
    }
    endShape(CLOSE);
}
