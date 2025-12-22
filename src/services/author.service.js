import * as authorRepository from "../repositories/author.repository.js";
import * as bookRepository from "../repositories/book.repository.js";
import {sequelize} from "../config/database.js";

export const getBookAuthors = async (isbn) => {
    const book = await bookRepository.findByIsbn(isbn);
    if (!book) {
        return null;
    }
    const authors = await bookRepository.getAuthors(book);
    return authors.map(a => ({name: a.name, birthDate: a.birth_date}));
};

export const deleteAuthor = async (name) => {
    const t = await sequelize.transaction();
    try {
        const author = await authorRepository.findByNameWithBirthDate(name, {transaction: t});
        if (!author) {
            await t.rollback();
            return null;
        }
        const books = await authorRepository.getBooks(author, {transaction: t});
        if (books.length > 0) {
            await t.rollback();
            throw new Error(`Author ${author.name} has books and cannot be removed`);
        }
        await authorRepository.destroy(author, {transaction: t});
        await t.commit();
        return author;
    } catch (e) {
        await t.rollback();
        throw e;
    }
};

export const getAuthorByName = async (name) => {
    return await authorRepository.findByName(name);
};
