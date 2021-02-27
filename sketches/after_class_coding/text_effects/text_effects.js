// https://developers.google.com/web/fundamentals/design-and-ux/animations/css-vs-javascript

function wrapLetters(e) {
  // match all non-whitespace characters (\S) globaly (g)
  // replace with matched character wrapped in span
  e.innerHTML = e.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
}

function initTextEffects() {
  const elements = document.getElementsByClassName("text-effect");
  for (const e of elements) {
    wrapLetters(e);
  }
}

function initExplosives() {
  const elements = document.getElementsByClassName("explosive");
  for (const e of elements) {
    e.addEventListener("mouseenter", explode);
  }
}

function explode() {
  const letters = this.getElementsByClassName("letter");

  for (const l of letters) {
    new ExplodeParticle(l);
  }
}

class ExplodeParticle {
  constructor(e) {
    this.e = e;
    this.x = 0;
    this.y = 0;
    this.a = 1;

    //this.dX = (this.e.offsetLeft / this.e.parentElement.offsetWidth - 0.5) * 5;
    this.dX = Math.random() * 8 - 4;
    this.dY = Math.random() * -8 - 8;

    this.frameCount = 0;

    requestAnimationFrame(this.step.bind(this));
  }

  step() {
    if (this.frameCount > 100) {
      this.e.style.opacity = 1.0;
      this.e.style.transform = "translate(0px, 0px)";
    } else {
      // move
      this.x += this.dX;
      this.y += this.dY;
      this.a -= 0.01;
      this.frameCount++;

      // gravity
      this.dY += 1;

      // bounce
      if (this.y > 0) this.dY = -Math.abs(this.dY) * 0.7;

      // apply
      this.e.style.opacity = this.a;
      this.e.style.transform = `translate(${this.x}px, ${this.y}px)`;
      requestAnimationFrame(this.step.bind(this));
    }
  }
}

function step(t) {
  const letters = document.querySelectorAll(".explosive .letter");
  for (const l of letters) {
    l.style.transform =
      //
      `translate(${Math.random()}px,${Math.random()}px)`;
  }
  requestAnimationFrame(step);
}
requestAnimationFrame(step);

function main() {
  initTextEffects();
  initExplosives();
}

main();
