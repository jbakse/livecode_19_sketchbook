# Part 1: Introduction

This demo is an introduction to using Airtable to build a custom backend database for a simple data-driven web page.
I'm going to show you how build this [Bookshelf Demo](https://jbakse.github.io/livecode_19_sketchbook/sketchbook/sketchbook.html?sketch=/bookshelf/bookself_02/index.html&source)

This document contains my notes for the video.

### Key Features:

- `Show the Bookshelf Demo`
- Displays a list of books at the top.
- Clicking a book title shows more information below.
- This is an example of a master-detail interface.
- Rather than hard coding the content in HTML, this demo loads the data from an Airtable Database.

## What is Airtable

Airtable is a web application that combines aspects of a spreadsheet (easy to use, like google sheets) and a database (structured data, like a "real" database). Go take a look at [Airtable](https://airtable.com/product)

- `Show Airtable`
- Airtable lets you define structured collections of data: a **book** has a _title_, a _description_, a _cover_image_, etc. a **user_profile** has a _first_name_, _last_name_, _join_date_, etc.
- Airtable also lets you define relationships. For example you can set up a user profile to contain a list of books. Relationships are a big deal in databases, but we'll be sticking with a simple structure with only one collection of data.
- Once you have your data structure defined, it provides a nice, modern UI for users and a full API for javascript.

### Why Airtable?

- Airtable is pretty useful because it provides an easy to use interface for both humans and javascript.
- Multiple people can access the same database and view and edit the content in a nice, easy visual interface.
- These tools are pretty powerful. You can set up specific views of the data for different purposes. These views can filter and sort the data and visualize it in different ways.
- `Show the structure of the Bookshelf demo table`
- `Add a book`

- For example its easy to set up a basic public form for adding information. [Go add your own book.](https://airtable.com/shr9lOYgav5K6qLnW)
- `Show the form`
- `Add a book`

### The Airtable API

- Airtable provides an API—Application Programming Interface—for javascript programming.
- Using this API, your webpage's javascript can request the data stored in your Airtable database and show that information on your webpage. This lets you design the UI/UX and visuals exactly how you want them.
- You can also write data to airtable with the API, but this demo will only cover reading and displaying the data.
- A really nice thing about Airtable is that it creates custom documentation for using the API and library that reflects the content and structure of your base.
- `Access the documentation via the help menu.`

## A Note about Security

- This demo is very insecure.
- The Airtable API uses a secret key (a password) to verify that your Javascript has permission to access your database.
- In this demo, the secret key is included near the top of main.js.
- Because Javascript is run on the client, main.js is published publicly, and so is the secret key!
- With that secret key, anyone can alter or delete the contents of the database.
- Proper security is out of the scope of this demo. The demo is insecure, and things you base on this demo will be insecure too.
- If you are using Airtable just for this class, that is mostly fine. You won't have much data to lose.
- If you have other data in Airtable, you should create a separate account for just class stuff.

## Next

I'll be showing you how to build the Bookshelf demo in a few parts.

- Setting up The Database
- Using the Javascript API
- Building the Front End

# Part 2: Setting up The Database

## Create an Airtable Account

Create a free account on Airtable. If you already have an account, create a second one just for this class. This limits the damage that a vandal (or a coding mistake) could cause. Remember, this code is not secure.

## Creating a new base.

- Airtable calls its databases just bases.
- An Airtable account can have multiple bases, usually all related data is kept in a single base.
- You would use multiple bases if you had multiple, unrelated projects.
- `Create a new base named 'bookshelf_demo'`

## Creating the table

- Each base can have multiple tables.
- Tables hold multiple records/rows that share a structure.
- Each row/record has several fields/columns.
- Each field has a name and a type.
- When you create a base, Airtable adds a basic table automatically.
- `Rename "Table 1" -> "books"`
- I'm going to be working with this table using Javascript. Its a good idea to use a consistent naming strategy. I'll be using short, descriptive names written in all lowercase and using \_ to seperate words.
- `Rename field "Name" -> "title"`
- This is the primary field, and can't be deleted.
- `Delete the other fields.`
- Now we have to think about the data we need to keep in our database.

  - We already have a field for the book title. The field name is "title" and the type is "single line text". Good.
  - We also need a description paragraph, a cover image, and link to more information.

- `Create a field named "description" with type "Long Text"`
- `Create a field named "more_url" with type url`
- `Create a field named "cover_image" of type "Attachment".`
- We'll be able to upload images into our database with this type!

## Adding Content

- You can type right into the fields.
- You can also right click a row and choose "expand record".

## Review

- We started by creating a playground account.
- We created a new database and set up a single table.
- We defined fields with well chosen names and field types to store our data.
- We used the Airtable interface as a general CMS for entering our data.

## Next

- In the next video we'll look at the Airtable JS API

# Part 3: Using the Javascript API

Airtable provides access to its data through a Javascript API and Library.

- API stands for Application Programming Interface
- An API provides a way for your code to communicate with other code.
- The Airtable API follows a common design approach, called [REST](https://en.wikipedia.org/wiki/Representational_state_transfer).
- Very briefly: A REST interface allows a client (your javascript) to send a server (airtable) independent requests for information over HTTP the communication protocol used on the web.
- You can use the Airtable REST interface directly or you can use a small Javascript Library provided by Airtable that makes common things easier.
- A really nice thing about Airtable is that it creates custom documentation for your base.
- The documentation includes code snippets and output examples that reflect your data!

- `Access the documentation via the help menu.`

- `Choose Javascript, and turn on show API key.`

- `Tour the docs`

## Setting up

We'll start by making an example page.

- `Create a folder for the project`
- `Open in VS Code`
- `Create an HTML`
- `Check with Live Server`
- `Create a JS folder`
- `Create a main.js`

```
console.log("Hello, Airtable");`
```

- `add the script tag to your page`

```
<script src="js/main.js"></script>
```

- `Check with Live Server`

Then we need to get the Airtable library

- Visit: https://github.com/airtable/airtable.js/
- Navigate: Releases -> Latest -> Download Source code .zip
- `copy airtable.browser.js into your project's js folder`
- `add the script tag to your page` - <script src="js/airtable.browser.js"></script>

- require and log the library to make sure we are loading it correctly

```
var Airtable = require("airtable");
console.log(Airtable);
```

## Turning on API access

By default, the API is disabled. You need to turn it on for your account if you want to use it for API access.

- `Click the Avatar Icon and choose "Account"`
- Generate an API Key
- See the note about creating a read only account/key.
- Your javascript will need this key to access your airtable data.

## Trying out the API

- The generated docs have code examples showing how to connect to airtable, select a base, and request records.
- The code is somewhat complicated for beginners. It uses javascript patterns you might not be used to, such as callback functions.
- It is also a bit complicated because the airtable API is paginated. It doesn't return all the records at once, instead it returns them in pages (like google search results).
- The maximum page size is 100, so airtable gives us the first 100 records, and then we request more.
- I've built an example that uses the airtable library to load the books and log them to the console.
- `Add the bookshelf_01 code`
- `Tour the code`
- You can view the code in the glitch project.
- Study the code.
- Study the console logs.
  - Your field data
  - Airtable generated Id
  - methods to modify the data.
- Fork and modify the code.
- You might even want to try to make your own base, and get it working with your fork.
- You can use this code in your own projects, but you'll need to make some alterations because your tables and fields will have different names.

## Next

In the next video we'll look at the front end code in `bookshelf_02`

# Building the Front End

- I'm going to fast forward though the HTML and CSS, you probably know most of what is going on there already.

  - It would be a good idea to take some time to look at the HTML and CSS to make sure you understand the structure of the document before you look at the JS.
  - I'm using flexbox for layout, and media queries to make the layout responsive.
  - To make the text vertical on the book spines I used `writing-mode: vertical-lr;` I don't think I've ever used that before, actually.
  - I'm also leaving some test content in the detail view, and I put a "hidden" class on it. CSS hides the whole thing on page load. The JS removes the hidden class when the first book detail is shown.
  - Finally, I've got ids on the `shelf` and the `book-detail`, and classes on each component of the book detail. These ids and classes are used to target specific parts of the document with JS.

- Let's step through the JS.
  - Most of this code is the same as bookshelf_01.
  - The new stuff is in `showBooks()` and `showBook()`
  - `showBooks()` creates a `div.book-spine` element for each book, sets the `innerText` to the title of the book, and installs a `click` event handler that calls `showBook()`
  - `showBook()` receives all the book data as a parameter. It then updates specific parts of the book detail like the title text and image url. At the end it removes the `.hidden` class to reveal the book detail
