const express = require("express");
const Library = require("./library");

const app = express();
const port = 3000;

//Middleware to parse JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mongo connection details
const url = "mongodb://localhost:27017/";
const dbName = "library";
const collectionName = "books";

//create a new instance of the Library class
const collection = new Library(url, dbName, collectionName);

// get route to fetch all books
app.get("bringmealldata", async (req, res) => {
  try {
    const allBooks = await collection.allBooks();
    res.json(allBooks);
  } catch (error) {
    res.status(500).send("Error fetching books: " + error.message);
  }
});

// POST route to add a new book
app.post("/addnewstuff", async (req, res) => {
  try {
    const { title, author, copies } = req.body;
    await collection.addBook({ title, author, copies });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error adding book: " + error.message);
  }
});

// POST route to update a book
app.post("/updatestuff", async (req, res) => {
  try {
    const { id, newInfo } = req.body;
    await collection.changeBook(id, JSON.parse(newInfo));
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error updating book: " + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
