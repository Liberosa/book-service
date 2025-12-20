import express from "express";
import {addBook, findBookByIsbn, removeBook, updateBookTitle} from "../controller/book.controller.js";
import {findBookAuthors, findBooksByAuthor, removeAuthor} from "../controller/author.controller.js";
import {findBooksByPublisher, findPublishersByAuthor} from "../controller/publisher.controller.js";

const router = express.Router();

// Book operations
router.post("/book", addBook);
router.get("/book/:isbn", findBookByIsbn);
router.delete("/book/:isbn", removeBook);
router.patch("/book/:isbn/title/:title", updateBookTitle);

// Find books
router.get("/books/author/:author", findBooksByAuthor);
router.get("/books/publisher/:publisher", findBooksByPublisher);

// Find authors and publishers
router.get("/authors/book/:isbn", findBookAuthors);
router.get("/publishers/author/:author", findPublishersByAuthor);

// Author operations
router.delete("/author/:author", removeAuthor);

export default router;