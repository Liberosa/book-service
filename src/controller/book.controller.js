import {Author, Book, Publisher} from "../model/index.js";
import {sequelize} from "../config/database.js";

export const addBook = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {isbn, title, authors, publisher} = req.body;
        const existingBook = await Book.findByPk(isbn);
        if (existingBook) {
            await t.rollback();
            return res.status(409).send({
                error: `Book with ISBN ${isbn} already exists`,
            })
        }
        if (!await Publisher.findByPk(publisher, {transaction: t})) {
            await Publisher.create({publisher_name: publisher}, {transaction: t})
        }
        const authorRecords = [];
        for (const author of authors) {
            let authorRecord = await Author.findByPk(author.name, {transaction: t});
            if (!authorRecord) {
                authorRecord = await Author.create({
                    name: author.name,
                    birth_date: new Date(author.birthDate)
                }, {transaction: t});
            }
            if (authorRecords.findIndex((a) => a.name === authorRecord.name) === -1) {
                authorRecords.push(authorRecord);
            }
        }
        const book = await Book.create({isbn, title, publisher}, {transaction: t});
        await book.setAuthors(authorRecords, {transaction: t});
        await t.commit();
        return res.status(201).send({book})
    } catch (err) {
        await t.rollback();
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while creating the book',
        })
    }
};

export const findBookByIsbn = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.isbn);
        if (book) {
            const result = {
                isbn: book.isbn,
                title: book.title,
                publisher: book.publisher,
                authors: (await book.getAuthors()).map(author => ({
                    name: author.dataValues.name,
                    birthDate: author.dataValues.birth_date,
                })),
            };
            return res.json(result);
        } else {
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while finding the book',
        })
    }
};

export const removeBook = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const book = await Book.findByPk(req.params.isbn, {transaction: t});
        if (!book) {
            await t.rollback();
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
        const authors = await book.getAuthors({transaction: t});
        const result = {
            isbn: book.isbn,
            title: book.title,
            publisher: book.publisher,
            authors: authors.map(author => ({
                name: author.name,
                birthDate: author.birth_date,
            })),
        };
        await book.destroy({transaction: t});
        await t.commit();
        return res.json(result);
    } catch (err) {
        await t.rollback();
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while removing the book',
        })
    }
};

export const updateBookTitle = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const book = await Book.findByPk(req.params.isbn, {transaction: t});
        if (!book) {
            await t.rollback();
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
        book.title = req.params.title;
        await book.save({transaction: t});
        const authors = await book.getAuthors({transaction: t});
        const result = {
            isbn: book.isbn,
            title: book.title,
            publisher: book.publisher,
            authors: authors.map(author => ({
                name: author.name,
                birthDate: author.birth_date,
            })),
        };
        await t.commit();
        return res.json(result);
    } catch (err) {
        await t.rollback();
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while updating the book title',
        })
    }
};


