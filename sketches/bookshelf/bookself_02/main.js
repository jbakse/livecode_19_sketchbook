/* globals require */
console.log("Hello, Airtable");

// load the airtable library, call it "Airtable"
var Airtable = require("airtable");
console.log(Airtable);

// use the airtable librar to get a variable that represents one of our bases
var base = new Airtable({ apiKey: "keyOcvpATRSQc6y9M" }).base(
  "appkFaDUnYFiYcvny"
);

//get the "books" table from the base, select ALL the records, and specify the functions that will receive the data
base("books").select({}).eachPage(gotPageOfBooks, gotAllBooks);

// an empty array to hold our book data
const books = [];

// callback function that receives our data
function gotPageOfBooks(records, fetchNextPage) {
  console.log("gotPageOfBooks()");
  // add the records from this page to our books array
  books.push(...records);
  // request more pages
  fetchNextPage();
}

// call back function that is called when all pages are loaded
function gotAllBooks(err) {
  console.log("gotAllBooks()");

  // report an error, you'd want to do something better than this in production
  if (err) {
    console.log("error loading books");
    console.error(err);
    return;
  }

  // call function to show the books
  showBooks();
}

// loop through the books, create an h2 for each one, and add it to the page
function showBooks() {
  console.log("showBooks()");
  const shelf = document.getElementById("shelf");
  console.log(shelf);
  books.forEach((book) => {
    const div = document.createElement("div");
    div.innerText = book.fields.title;
    div.classList.add("book-spine");
    div.addEventListener("click", () => {
      showBook(book);
    });
    shelf.appendChild(div);
  });
}

function showBook(book) {
  console.log("showBook()", book);
  const bookDetail = document.getElementById("book-detail");

  bookDetail.getElementsByClassName("title")[0].innerText = book.fields.title; //
  bookDetail.getElementsByClassName("description")[0].innerText =
    book.fields.description;
  bookDetail.getElementsByClassName("more")[0].href = book.fields.more;
  bookDetail.getElementsByClassName("cover-image")[0].src =
    book.fields.cover_image[0].url;

  bookDetail.classList.remove("hidden");
}
