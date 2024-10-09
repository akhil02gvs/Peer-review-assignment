const express = require("express");
const axios = require("axios");
const { getBooks } = require("./booksdb.js");

let books = require("./booksdb.js").books;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  user = req.query;
  if (isValid(user["username"]) == false) {
    return res
      .status(300)
      .send({ message: "Username already exists", registered_users: users });
  } else if (user["username"].length < 1 || user["password"].length < 1) {
    return res.status(300).send("please fill everything");
  }
  users.push(user);
  return res.status(300).json({
    message: "user registered",
    username: user["username"],
    password: user["password"],
  });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  let books = await getBooks();
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  let t = await axios.get("http://localhost:5000");
  let books = t["data"];
  // console.log(books['data'])
  // res.json(books)
  if (isbn < 1 || isbn > 10) {
    return res.status(400).json({ msg: "Invalid ISBN" });
  }
  return res.status(200).json({ [isbn]: books[req.params.isbn] });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here

  author = req.params["author"];
  let t = await axios.get("http:localhost:5000");
  let books = t["data"];
  bookList = {};
  i = 0;
  for (const key in books) {
    if (author === books[key].author) {
      i++;
      bookList[i] = books[key];
      bookList[i]["isbn"] = key;
    }
  }
  return res.status(300).json(bookList);
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  title = req.params["title"];
  let t = await axios.get("http:localhost:5000");
  let books = t["data"];
  for (const key in books) {
    if (title === books[key].title) {
      return res.status(300).json(books[key]);
    }
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json(books[req.params["isbn"]].reviews);
});

module.exports.general = public_users;
