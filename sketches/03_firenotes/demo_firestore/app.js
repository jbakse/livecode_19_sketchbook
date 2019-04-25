var config = {
  apiKey: "AIzaSyDZ3qPO3YoXEqZRIL1KKvupnsizuZcEvDQ",
  authDomain: "marknotes-jbakse.firebaseapp.com",
  databaseURL: "https://marknotes-jbakse.firebaseio.com",
  projectId: "marknotes-jbakse",
  storageBucket: "marknotes-jbakse.appspot.com",
  messagingSenderId: "307129956026"
};
firebase.initializeApp(config);

const db = firebase.firestore();
const notes = db.collection("test_notes");

async_read();

//////////////////////////////////
// CRUD - Create

function promise_create() {
  notes
    .add({ title: "Snow Crash", author: "Neal Stephenson" })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef, docRef.id);
    });
}

async function async_create() {
  let docRef = await notes.add({
    title: "Cryptonomicon",
    author: "Neal Stephenson"
  });
  console.log("Document written with ID: ", docRef, docRef.id);
}

//////////////////////////////////
// CRUD - Read

async function async_read() {
  let activeRef = await notes.get();
  console.log(`Got ${activeRef.docs.length} records.`);
  for (const note of activeRef.docs) {
    console.log(note.id, note.data().title, note.data().author);
  }
}

//////////////////////////////////
// CRUD - Update

async function async_update(id, title, author) {
  let data = {};
  if (title !== undefined) data.title = title;
  if (author !== undefined) data.author = author;
  notes.doc(id).update(data);
}

//////////////////////////////////
// CRUD - Delete

async function async_delete(id) {
  var deleteDoc = notes.doc(id).delete();
}

//////////////////////////////////
// Listen

function listen() {
  var observer = notes.onSnapshot(querySnapshot => {
    console.log(`Received query snapshot of size ${querySnapshot.size}`);
    querySnapshot.docChanges().forEach(change => {
      console.log(change.type, change.doc.data());
    });
  });
}
