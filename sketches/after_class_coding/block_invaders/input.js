console.log("Hello, Canvas");

const controls = {
  left: false,
  right: false,
  fire: false,
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") controls.left = true;
  if (e.key === "ArrowRight") controls.right = true;
  if (e.key === " ") controls.fire = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") controls.left = false;
  if (e.key === "ArrowRight") controls.right = false;
  if (e.key === " ") controls.fire = false;
});

setInterval(() => {
  document.body.innerHTML =
    //
    `left:${controls.left} <br/>
     right:${controls.right} <br/> 
     fire:${controls.fire} <br/>`;
}, 30);
