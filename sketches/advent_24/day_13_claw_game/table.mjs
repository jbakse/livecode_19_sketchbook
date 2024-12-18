console.log("table");

for (let a = 0; a < 10; a++) {
  let row = "";
  for (let b = 0; b < 10; b++) {
    const value = a * 4 + b * 5;
    row += `${value} (${value % 20})\t`;
  }
  console.log(row);
}
