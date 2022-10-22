/* globals Chart */

console.log("chart bar");
const ctx = document.getElementById("myChart").getContext("2d");

/* exported myChart */

const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Yes", "No", "Maybe"],
    datasets: [
      {
        data: [10, 5, 8],
      },
    ],
  },
  options: {
    backgroundColor: "black",
    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          display: true,
          font: {
            family: "monospace",
            size: 20,
          },
        },
      },
      y: {
        ticks: {
          callback: (v) => `${v}%`,
          font: {
            family: "monospace",
            size: 20,
          },
        },
      },
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
  },
});
