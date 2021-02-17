# Security

- Propery security is out of scope of this introduction.
- These demos are not secure.
- The things you make—following these demos—won't be secure.
- Because security is not considered, it would be possible for someone to vandalize the data in your databases.
- If you are using Airtable just for this project, thats mostly fine.
- If you have other data in Airtable, you may want to create a seperate account for just class stuff.

# Introduction

- I'm going to show you how build this!

  - Bookshelf demo.
  - Displays a list of books at the top.
  - Clicking a book title shows more information below.
  - This is an example of a master-detail interface.
  - Rather than hard coding the content in HTML, this demo loads the data from an Airtable Database.

- What is Airtable

  - Airtable is a web application that combines aspects of a spreadsheet (easy to use, like google sheets) and a database (structured data, like a "real" database).
  - Airtable lets you define structured collections of data: a _book_ has a title, a description, a cover image, etc. a _user_profile_ has a first name, last name, join date, etc.
  - Airtable also lets you set up relationships. Like a user profile can contain a list of books.
  - Relationships are a big deal in databases, but we'll be sticking with a simple structure with only one collection of data.
  - The airtable database is here, but you can't look at it unless you are logged in as me. [Airtable Bookshelf](https://airtable.com/tblSiPSl6eQSiWWx4/viw6rjrE6HiFXk59D?blocks=hide)

- Why Airtable

  - Airtable is pretty useful because it provides an easy to use interface for both humans and javascript.
  - Multiple people can access the same database and view and edit the content in a nice, easy visual interface.
  - The tools for humans are pretty powerful, you can set up specific views for different people or roles on the team. These views can visualize the data in different ways and filter and sort the data based on what each person needes.
  - Airtable also provides a fairly easy to use API for javascript programming.
  - With the API your webpage's javascript can request the data stored in your Airtable database and show that information on your webpage. This lets you design the UI/UX and visuals exactly how you want them.

- Next
  - I'll be showing you how to build the book shelf demo in a few parts.
  - Setting up The Databas
  - Using the Javascript API
  - Building the Front End

# Setting up The Database

- Because we are not considering security. Create an account just for these projects. This limits the damage that a vandal (or a coding mistake) could cause.

- Create a new base.

  - A base is a database. Each database can have multiple tables.
  - Tables hold multiple records/rows that share a structure.
  - Each row/record has several fields/columns.
  - Each field has a name and a type.

- Clean up the default table

  - Airtable creates a basic table for you, with a few columns already defined.
  - Rename "Table 1" -> "books"
  - I'm going to be working with this table using Javascript. Its a good idea to use a consistent naming strategy. I'll be using short, descriptive names written in all lowercase and using \_ to seperate words.
  - Rename field "Name" -> "title"
  - This is the primary field, and can't be deleted.
  - Delete the other fields.

- Now we have to think about the data we need to keep in our database.

  - We already have a field for the book title. The field name is "title" and the type is "single line text". Good.
  - We also have a description paragraph, a cover image, and link to more informaiton.
  - Create a field named "description" with type "Long Text"
  - Create a field named "cover_image" of type attachment. We'll be able to upload images into our database with this type!
  - Create a field named "more_url" with type url

- And lets add some content.

  - You can type right into the fields.
  - You can also right click a row and choose "expand record".

- Review

  - We started by creating a playground account.
  - We created a new database and set up a single table.
  - We defined fields with well chosen names and field types to store our data.
  - We used the Airtable interface as a general CMS for entering our data.

- Next
  - In the next video we'll look at the API that Airtable provides so that you can access this data using Javascript.

# Using the Javascript API

- What is the Javascript API?

  - Airtable provides access to its data through a Javascript API and library.
  - Application Programming Interface
  - The interface follows a common design approach, called REST.
  - Very briefly: A REST interface allows a client (your javascript) to send a server (airtable) independent requests for information.
  - Using this rest iterface direclty is possible, but Airtable makes things easier by providing a small Javascript library.
  - A really nice thing about Airtable is that it creates custom documentation for your databases!
  - Acces it via the help menu.
  - Choose Javascript, and turn on show API key.
  - The documentation include code and output examples that reflect your data!

- Setting up

  - Create an HTML
    - HTML template
  - We'll start by making an example page.
  - create a js folder
  - create a main.js, console.log("Hello, Airtable");
  - add the script tag to your page`<script src="js/main.js"></script>`

- Adding the Library - Library

  - https://github.com/airtable/airtable.js/
  - Releases -> Latest -> Download Source code .zip
  - unzip it
  - open build folder
  - copy airtable.browser.js into your project's js folder
  - add the script tag to your page `<script src="js/airtable.browser.js"></script>`
  - in your main js use `require` airtable to import the library into a variable called Airtable, and lets console log it to make sure its working.

- Turning on API access

  - Click the Avatar Icon and choose "Account"
  - Generate an API Key
  - See the note about creating a read only account/key.
  - Your javascript will need this key to access your airtable data.
  - Since your javascript code will be on your front end, anyone one who looks at your code will find it. If we were building this system to be secure, we'd have to do things another way.

- Trying out the API
  - The generated docs have code examples showing how to connect to airtable, select a base, and request records.
  - The code is somewhat complicated for beginners. It uses javascript patterns you might not be like function parameters.
  - It is also a bit complicated because the airtable API is paginated. It doesn't return all the records at once, instead it returns them in pages (like google search results).
  - The maximum page size is 100, so airtable gives us the first 100 records, and then we request more.
  - I've built an example that uses the airtable library to load the books and log them to the console.
  - It would be a good idea to study that code and try to understand what each part does.
  - You should also study the console log to see what data is in each record provided by Airtable. In addition to your field data, there is an Airtable generated Id. There are also methods you can use to modify the data.
  - You can use this code in your own projects, but you'll need to make some alterations because your tables and fields will have different names.

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
