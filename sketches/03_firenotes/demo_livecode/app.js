console.log("hello, javascript!");

const data = {
  title: "Hello, Vue!",
};

const app = new Vue({
  el: "#app",
  data: data,
});

var config = {
  apiKey: "AIzaSyDZ3qPO3YoXEqZRIL1KKvupnsizuZcEvDQ",
  authDomain: "marknotes-jbakse.firebaseapp.com",
  databaseURL: "https://marknotes-jbakse.firebaseio.com",
  projectId: "marknotes-jbakse",
  storageBucket: "marknotes-jbakse.appspot.com",
  messagingSenderId: "307129956026",
};
firebase.initializeApp(config);

const db = firebase.firestore();
const notes = db.collection("notes");

async_read();
async function async_read() {
  let activeRef = await notes.get();
  console.log(`Got ${activeRef.docs.length} records.`);
  for (const note of activeRef.docs) {
    console.log(note.id, note.data().title, note.data().author);
    data.title = note.id;
  }
}
