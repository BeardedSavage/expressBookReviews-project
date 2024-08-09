const express = require('express');
let books = require("./booksdb.js");
const { authenticated } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
 
  if (username && password) {
   
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer with same username already exists!"});    
    }
}
  return res.status(404).json({message: "Unable to register customer."});

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const promise = new Promise((resolve, reject) => {
    try{
      setTimeout (() => resolve(books), 600);
    }
    catch {
      setTimeout (() => reject(404 + "There was an error fetching the books"));
    }
  });

  console.log("Promise complete");

  promise.then((result) => {
    return res.status(200).json({books: result});
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = new Promise((resolve, reject) => {
    try {
      setTimeout(() => resolve(books[req.params.isbn]), 600);
    }
    catch {
      reject(404 + "That ISBN does not exist")
    }
  });
  console.log("Promise complete");
  
  isbn.then((result) => {
    return res.status(200).json({books: result})
  })
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  let booksbyauthor = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["author"] === req.params.author) {
      booksbyauthor.push({"isbn":isbn,
                          "title":books[isbn]["title"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbyauthor}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let booksbytitle = [];
  let isbns = Object.keys(books);
  isbns.forEach((isbn) => {
    if(books[isbn]["title"] === req.params.title) {
      booksbytitle.push({"isbn":isbn,
                          "author":books[isbn]["author"],
                          "reviews":books[isbn]["reviews"]});
    }
  });
  res.send(JSON.stringify({booksbytitle}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const reviews = req.params.isbn;
  res.send(books[reviews]);
});

module.exports.general = public_users;
