/* globals Chart ChartDataLabels*/

console.log("chart bar");
const ctx = document.getElementById("myChart").getContext("2d");

/* exported myChart */

const myChart = new Chart(ctx, {
  type: "pie",
  plugins: [ChartDataLabels],
  data: {
    labels: ["Yes", "No", "Maybe"],
    datasets: [
      {
        data: [12, 5, 2, 1],
      },
    ],
  },

  options: {
    events: [],
    backgroundColor: [
      "#cfc",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
      "white",
    ],
    borderColor: ["black"],
    borderWidth: 1,
    animation: {
      duration: 1000,
      animateScale: true,
    },
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      datalabels: {
        formatter(value, context) {
          // return context.chart.data.labels[context.dataIndex];
          return [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
          ][context.dataIndex];
        },
        // display: "auto",
        display: (context) => {
          const value = context.dataset.data[context.dataIndex];
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          return value / total >= 0.1;
        },

        color: "#black",
        font: {
          size: 100,
        },
      },
    },
  },
});
