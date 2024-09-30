let scrollY = window.scrollY;
function setup() {
    const c = createCanvas(400, 400);

    // put c.elt in the div with id "sketch-holder"
    const holder = document.getElementById("sketch-holder");
    holder.appendChild(c.elt);
    // set id of c.elt to "sketch" so that it can be accessed by other scripts
    c.elt.id = "sketch";

    // noLoop();
}
function draw() {
    background(220);

    fill("black");
    text(`${mouseX}, ${mouseY}`, 10, 300);
    text(`down: ${mouseIsPressed}`, 10, 320);
    text(`scrollY: ${scrollY}`, 10, 340);

    push();
    translate(0, -scrollY);
    fill("#444");
    for (let i = 0; i < 100; i++) {
        ellipse(sin(i + millis() * .01) * 100, i * 100, 40, 40);
    }
    ellipse(mouseX, mouseY + scrollY, 40, 40);
    pop();
}

function mousePressed() {
    console.log("mousePressed");
}

// get window scroll events
window.addEventListener("scroll", function () {
    scrollY = window.scrollY;
});
