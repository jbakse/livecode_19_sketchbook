function wrapLetters(e) {
  // match all non-whitespace characters (\S) globaly (g)
  // replace with matched character wrapped in span
  e.innerHTML = e.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
}

function main() {
  const elements = document.getElementsByClassName("text-effect");

  for (const e of elements) {
    wrapLetters(e);
  }
}

main();
