import * as bookRepository from "../repositories/book.repository.js";
import * as authorRepository from "../repositories/author.repository.js";
import * as publisherRepository from "../repositories/publisher.repository.js";
import {sequelize} from "../config/database.js";

export const createBook = async ({isbn, title, authors, publisher}) => {
    const t = await sequelize.transaction();
    try {
        const existingBook = await bookRepository.findByIsbn(isbn, {transaction: t});
        if (existingBook) {
            await t.rollback();
            throw new Error(`Book with ISBN ${isbn} already exists`);
        }

        // Create or find the publisher
        let publisherRecord = await publisherRepository.findByName(publisher, {transaction: t});
        if (!publisherRecord) {
            await publisherRepository.create({publisher_name: publisher}, {transaction: t});
        }

        // Process the authors
        const authorRecords = [];
        for (const author of authors) {
            let authorRecord = await authorRepository.findByName(author.name, {transaction: t});
            if (!authorRecord) {
                authorRecord = await authorRepository.create({
                    name: author.name,
                    birth_date: new Date(author.birthDate)
                }, {transaction: t});
            }
            if (authorRecords.findIndex(a => a.name === authorRecord.name) === -1) {
                authorRecords.push(authorRecord);
            }
        }

        // Create a new book
        const book = await bookRepository.create({isbn, title, publisher}, {transaction: t});
        await book.setAuthors(authorRecords, {transaction: t});
        await t.commit();
        return book;
    } catch (e) {
        await t.rollback();
        throw e;
    }
};

export const getBookByIsbn = async (isbn) => {
    return await bookRepository.findByIsbn(isbn);
};

export const deleteBook = async (isbn) => {
    const t = await sequelize.transaction();
    try {
        const book = await bookRepository.destroy(isbn, {transaction: t});
        if (book) {
            await t.commit();
            return book;
        } else {
            await t.rollback();
            return null;
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
};

export const updateBookTitle = async (isbn, title) => {
    const t = await sequelize.transaction();
    try {
        const book = await bookRepository.update(isbn, {title}, {transaction: t});
        if (book) {
            await t.commit();
            return book;
        } else {
            await t.rollback();
            return null;
        }
    } catch (e) {
        await t.rollback();
        throw e;
    }
};

export const getBooksByAuthor = async (authorName) => {
    const author = await authorRepository.findByName(authorName);
    if (!author) {
        return null;
    }
    return await bookRepository.findByAuthor(author);
};

export const getBooksByPublisher = async (publisherName) => {
    const publisher = await publisherRepository.findByName(publisherName);
    if (!publisher) {
        return null;
    }
    return await bookRepository.findByPublisher(publisherName);
};
