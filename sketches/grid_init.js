console.log("hi grid!");

let grid = [];
const grid_width = 5;
const grid_height = 5;

// first create all the tiles
for (let i = 0; i < grid_width * grid_height; i++) {
  grid[i] = {
    top: false,
    left: false,
    right: false,
    bottom: false
  };
}

// vertical edges
for (let y = 0; y < grid_height; y++) {
  for (let x = 1; x < grid_width; x++) {
    //
  }
}

console.log(grid);
