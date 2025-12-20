import {Book} from "../model/index.js";

export const findBooksByAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.author);
        if (!author) {
            return res.status(404).send({error: `Author ${req.params.author} not found`});
        }
        const books = await author.getBooks();
        const result = [];
        for (const book of books) {
            const authors = await book.getAuthors();
            result.push({
                isbn: book.isbn,
                title: book.title,
                authors: authors.map(a => ({
                    name: a.name,
                    birthDate: a.birth_date,
                })),
                publisher: book.publisher,
            });
        }
        return res.json(result);
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while finding books by author',
        })
    }
};


export const findBookAuthors = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.isbn);
        if (!book) {
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
        const authors = await book.getAuthors();
        const result = authors.map(author => ({
            name: author.name,
            birthDate: author.birth_date,
        }));
        return res.json(result);
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while finding book authors',
        })
    }
};


export const removeAuthor = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const author = await Author.findByPk(req.params.author, {transaction: t});
        if (!author) {
            await t.rollback();
            return res.status(404).send({error: `Author ${req.params.author} not found`});
        }
        const result = {
            name: author.name,
            birthDate: author.birth_date,
        };

        const books = await author.getBooks({transaction: t});

        for (const book of books) {
            await book.destroy({transaction: t});
        }
        await author.destroy({transaction: t});
        await t.commit();
        return res.json(result);
    } catch (err) {
        await t.rollback();
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while removing the author',
        })
    }
};