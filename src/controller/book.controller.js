import * as bookService from "../services/book.service.js";

export const addBook = async (req, res) => {
    try {
        await bookService.createBook(req.body);
        return res.status(201).send();
    } catch (e) {
        if (e.message.includes('already exists')) {
            return res.status(409).send({error: e.message});
        }
        console.error('Error adding book:', e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to add book'
        });
    }
};

export const findBookByIsbn = async (req, res) => {
    try {
        const book = await bookService.getBookByIsbn(req.params.isbn);
        if (book) {
            return res.json(book);
        } else {
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
    } catch (e) {
        console.error('Error finding book:', e);
        return res.status(500).send({error: e.message});
    }
};

export const removeBook = async (req, res) => {
    try {
        const book = await bookService.deleteBook(req.params.isbn);
        if (book) {
            return res.json(book);
        } else {
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
    } catch (e) {
        console.error('Error removing book:', e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to remove book'
        });
    }
};

export const updateBookTitle = async (req, res) => {
    try {
        const book = await bookService.updateBookTitle(req.params.isbn, req.params.title);
        if (book) {
            return res.json(book);
        } else {
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
    } catch (e) {
        console.error('Error updating book:', e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to update book'
        });
    }
};

export const findBooksByAuthor = async (req, res) => {
    try {
        const books = await bookService.getBooksByAuthor(req.params.name);
        if (books === null) {
            return res.status(404).send({error: `Author with name ${req.params.name} not found`});
        }
        return res.json(books);
    } catch (e) {
        console.error('Error finding books by author:', e);
        return res.status(500).send({error: e.message});
    }
};

export const findBooksByPublisher = async (req, res) => {
    try {
        const books = await bookService.getBooksByPublisher(req.params.name);
        if (books === null) {
            return res.status(404).send({error: `Publisher with name ${req.params.name} not found`});
        }
        return res.json(books);
    } catch (e) {
        console.error('Error finding books by publisher:', e);
        return res.status(500).send({error: e.message});
    }
};