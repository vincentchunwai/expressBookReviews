const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    if(username.length >0){
      return true;
    }
    else{
      return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password)
    });
    return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message: "Error logging in"})
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60*60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in")
  }
  else{
    return res.status(208).json({message: "Invalid Login. Check username and password"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
   const isbn = req.params.isbn;
   let book = books[isbn]
   if(book){
      let newReview = req.body.review;
      if(newReview){
        books[isbn].reviews = Object.assign(books[isbn].reviews, newReview);
        res.send(`Your review to ${book.title} is submitted` );
      }
      else{
        res.send("Unable to submit review");
      }
   }
   else{
    res.send("Unable to find book");
   }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    delete books[isbn]
  }
  res.send(`Your review to ${book.title} is deleted`);
});
module.exports.authenticated = regd_users;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
