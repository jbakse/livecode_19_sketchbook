console.log("hello!");

function createLetters() {
  const elements = document.getElementsByClassName("text-effect");
  for (const element of elements) {
    const original_text = element.innerText;
    const changed_text = original_text.replace(
      /\S/g,
      '<span class="letter">$&</span>'
    );
    element.innerHTML = changed_text;
  }
}
createLetters();

let explosion_elements = [];

function setupExplosion() {
  const elements = document.getElementsByClassName("explosive");
  for (const element of elements) {
    element.addEventListener("mouseenter", explosionRollover);
  }
}

function explosionRollover() {
  let letters = this.getElementsByClassName("letter");
  for (const letter of letters) {
    letter.r = 0;
    letter.deltaR = Math.random() * 5;
    letter.y = 0;
    letter.deltaY = -5;
    letter.x = 0;
    letter.deltaX = Math.random() * 4 - 2;
  }
  explosion_elements = letters;

  console.log(letters);
}

function step() {
  for (const element of explosion_elements) {
    element.r += element.deltaR;
    element.y += element.deltaY;
    element.deltaY += 0.1;

    element.x += element.deltaX;

    element.style.transform = `translate(${element.x}px, ${element.y}px) rotate(${element.r}deg)`;
  }
  requestAnimationFrame(step);
}

requestAnimationFrame(step);

setupExplosion();
