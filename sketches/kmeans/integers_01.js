// module
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// docs at https://github.com/mljs/kmeans
import { kmeans } from "https://cdn.skypack.dev/ml-kmeans";

console.log("Hello, integers_01.js!");

/// these functions make data and "embeddings" for the data

// integers, [n]
function dataIntegers() {
  const n = 10;
  const data = [];
  const dataVectors = [];
  for (let i = 0; i < n; i++) {
    data.push(i);
    dataVectors.push([i]);
  }
  return { data, dataVectors };
}

// integers, [isEven, isOdd, isPrime * 10, isSquare]
// isPrime is weighted high!
function dataIntegersClassed() {
  const isEven = (n) => (n % 2 ? 0 : 1);
  const isOdd = (n) => (n % 2 ? 1 : 0);
  const isPrime = (n) => {
    if (n < 2) return 0;
    for (let i = 2; i < n; i++) {
      if (n % i === 0) return 0;
    }
    return 1;
  };
  const isSquare = (n) => (Math.sqrt(n) % 1 === 0 ? 1 : 0);

  const n = 10;
  const data = [];
  const dataVectors = [];
  for (let i = 0; i < n; i++) {
    data.push(i);
    dataVectors.push([isEven(i), isOdd(i), isPrime(i) * 10, isSquare(i)]);
    console.log(i, isEven(i), isOdd(i), isPrime(i), isSquare(i));
  }
  return { data, dataVectors };
}

// number names, [length]
function wordLength() {
  const data = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "one-hundred-and-six",
    "point-zero-one",
  ];
  const dataVectors = data.map((word) => [word.length]);
  return { data, dataVectors };
}

// html color names, [r, g, b]
function colors() {
  const data = {
    AntiqueWhite: [250, 235, 215],
    Beige: [245, 245, 220],
    Bisque: [255, 228, 196],
    BlanchedAlmond: [255, 235, 205],
    Chartreuse: [127, 255, 0],
    DarkGreen: [0, 100, 0],
    DarkOliveGreen: [85, 107, 47],
    DarkSeaGreen: [143, 188, 143],
    DeepPink: [255, 20, 147],
    Fushia: [255, 0, 255],
    HotPink: [255, 105, 180],
    LightGray: [211, 211, 211],
    LimeGreen: [50, 205, 50],
    OrangeRed: [255, 69, 0],
  };

  return { data: Object.keys(data), dataVectors: Object.values(data) };
}

/// load the data from a provider function above
const { data, dataVectors } = colors();

/// group in to k clusters
const k = 3;
const result = kmeans(dataVectors, k);

/// create k arrays, and fill them with the data for each cluster
const clusters = Array.from({ length: k }, () => []);
result.clusters.forEach((clusterId, i) => {
  clusters[clusterId].push(data[i]);
});

/// show results on the page
const div = document.createElement("div");
document.body.appendChild(div);

clusters.forEach((cluster, i) => {
  div.innerHTML += `<p>Cluster ${i}: ${cluster.join(", ")}</p>`;
});

/// utilities
function range(min = 0, max, step = 1) {
  if (max === undefined) [min, max] = [0, min];
  const result = [];
  for (let i = min; i < max; i += step) {
    result.push(i);
  }
  return result;
}
