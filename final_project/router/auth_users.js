const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "akhil", password: "akhil" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  for (const user of users) {
    if (username === user["username"]) {
      return false;
    }
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  for (const user of users) {
    if (username === user["username"] && password === user["password"]) {
      return true;
    }
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  user = req.query;
  username = user["username"];
  if (authenticatedUser(user["username"], user["password"])) {
    const Token = jwt.sign({ username }, "access", { expiresIn: "1h" });
    req.session.authorization = { Token };
    res.status(200).send("user successfully logged in");
  } else {
    res.send("invaild username or password");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params["isbn"];
  let review = req.query["review"];
  let token = req.session.authorization["Token"];
  let username = JSON.parse(atob(token.split(".")[1]))["username"];
  book = books[isbn];
  book["reviews"][username] = review;
  return res.status(300).send(book);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params["isbn"];
  let token = req.session.authorization["Token"];
  let username = JSON.parse(atob(token.split(".")[1]))["username"];
  let book = books[isbn];
  if (username in book["reviews"]) {
    delete book["reviews"][username];
    return res.status(300).send(book);
  } else {
    return res.send("there is no review by user");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
