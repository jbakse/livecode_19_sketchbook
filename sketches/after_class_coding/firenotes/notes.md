# 00 What We'll Make
[Firenotes](https://jbakse.github.io/livecode_19_sketchbook/sketches/03_firenotes/demo_complete/)

# 01 Tools
- jsDelivr
  > free, fast, and reliable CDN; serves npm packages
  - [Homepage](https://www.jsdelivr.com/)
- Vue.js
  > JavaScript front-end framework; data-backed UIs
  - [Homepage](https://vuejs.org/)
  - [Guide](https://vuejs.org/v2/guide/)
  - [API Docs](https://vuejs.org/v2/guide/)
  - [Scrimba Tutorials](https://scrimba.com/playlist/pXKqta)
- Vuefire 2.0.0-alpha.21
  > Firebase bindings for Vue.js
  - [Repo](https://github.com/vuejs/vuefire)
  - [Docs](https://github.com/vuejs/vuefire/blob/master/packages/documentation/docs/vuefire/getting-started.md)
- Firebase
  > Backend as a Service by Google
  - [Homepage](https://firebase.google.com/)
  - [Firebase Console](https://console.firebase.google.com/)
- Firestore
  > Realtime database component of Firebase
  - [Homepage](https://firebase.google.com/products/firestore/)
  - [Firestore Docs](https://firebase.google.com/docs/firestore/)
  - [Quickstart](https://firebase.google.com/docs/firestore/quickstart)
  - [Console](https://console.firebase.google.com/u/0/?pli=1)
# 02 Vue

- [Model-view-viewmodel](https://en.wikipedia.org/wiki/Model–view–viewmodel)
  - Model: Business Logic and Data (Bound Javascript Data Object)
  - View: UI Presentation and Logic (DOM Elements)
  - ViewModel: Binding Between Model and View (Vue instance)
  - [Vue.js Getting Started](https://012.vuejs.org/guide/)
- [Reactive Programming](https://en.wikipedia.org/wiki/Reactive_programming)
  - Entities automatically update when dependencies change
  - Spreadsheets are reactive
  - In MVVM the view automatically updates when the data changes.
- demo_vue
  - look at html and template tags
    - CDN
    - bound data
    - list iteration
  - look at javascript
    - creating a Vue viewmodel object + data binding
    - changing values
    - adding to a list
    - changing items in a list

# 03 Firestore
- [Create Read Update Delete](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
- [Backend as a Service](https://en.wikipedia.org/wiki/Mobile_backend_as_a_service), Serverless Database
- Asyncronous vs Syncronous Operations
  - Callbacks, Node Style Callbacks, Callback Hell
  - Promises
  - Async/Await [@Hackernoon](https://hackernoon.com/6-reasons-why-javascripts-async-await-blows-promises-away-tutorial-c7ec10518dd9)
- [Real Time Database](https://firebase.google.com/docs/database/), Data is continuously sync'd to clients.
- [NoSQL](https://en.wikipedia.org/wiki/NoSQL), non relational, document stores, flexible, Mongo, Firesore
- [SQL](https://en.wikipedia.org/wiki/SQL), Query language for relational databases, related tables, structured, consistent, MySQL, SQLite
- demo_firestore
  - look at html
    - CDN
  - look at javascript
    - config, note about security
    - initialize, get firestore, get collection
    - *_create
    - async_read
    - async_update
    - async_delete
    - observing

# 04 Firenotes

- [Firenotes App](https://jbakse.github.io/livecode_19_sketchbook/sketches/03_firenotes/demo_complete/)
- [Firebase Console](https://console.firebase.google.com/u/0/?pli=1)
- List features
- Model Data
- Hello, World!
  - Static HTML, CSS
  - Javascript
  - + Vue
  - + Firebase
  - + Vuefire
  - Live Data!
- Templates Showing the List
- Methods + addNote()
- Fast forward: final code


# 05 Sketch vs Production

- Add error handling
- Secure firestore with access rules
  - [Docs](https://firebase.google.com/docs/firestore/security/rules-structure?authuser=0)
- Setup project and build tools with vue-cli
- Think about billing costs
