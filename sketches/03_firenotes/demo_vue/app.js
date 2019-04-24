const data = {
  name: "Grace Hopper",
  courses: ["Flying", "Computer Programming"]
};

const app = new Vue({
  el: "#app",
  data: data
});

/*
// changing a value
data.name = "Commodore Grace M. Hopper";

// adding to list
data.courses.push("Public Speaking");


// changing list value
// won't work https://vuejs.org/v2/guide/list.html#Caveats
data.courses[0] = "Sailing"; 
// will work
Vue.set(data.courses, 0, "Sailing");

*/
