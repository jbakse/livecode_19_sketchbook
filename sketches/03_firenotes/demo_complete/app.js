// Initialize Firebase
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
const notes = db.collection("notes");
const notesSorted = notes.orderBy("score", "desc");

Vue.use(Vuefire.firestorePlugin);

var app = new Vue({
  // element to mount to
  el: "#app",

  // initial data
  data: () => ({
    notes: [],
    newNoteTitle: ""
  }),

  firestore: {
    notes: notesSorted
  },

  // computed property for form validation state
  computed: {},
  watch: {},

  // methods
  methods: {
    addNote: function() {
      var value = this.newNoteTitle && this.newNoteTitle.trim();
      if (!value) {
        return;
      }
      notes.add({
        title: value,
        score: 0
      });
      this.newNoteTitle = "";
    },

    removeNote: function(note) {
      notes.doc(note.id).delete();
    },

    updateScore: function(note) {
      notes.doc(note.id).update({
        score: parseInt(note.score) || 0
      });
    },

    incrementScore: function(note, amount) {
      notes.doc(note.id).update({
        score: (note.score || 0) + amount
      });
    },

    updateTitle: function(note) {
      notes.doc(note.id).update({
        title: note.title
      });
    }
  }
});
