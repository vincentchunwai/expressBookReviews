const express = require('express');
let books = require("./booksdb.js");
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!authenticatedUser(username, password)){
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else{
      return res.status(409).json({message: "User already exists!"});
    }
  }
  
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  for(let book in books){
    if(books[book].author === author){
        booksByAuthor.push(books[book])
    }
  }
  const formattedBooks = JSON.stringify(booksByAuthor, null, 2);
  return res.send("booksByAuthor:" + formattedBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  for(let book in books){
    if(books[book].title === title){
        booksByTitle.push(books[book])
    }
  }
  const formattedBooks = JSON.stringify(booksByTitle, null, 4);
  return res.send("booksByTitle:" + formattedBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = req.params.isbn;
  return res.send(books[review].reviews);
});

module.exports.general = public_users;
