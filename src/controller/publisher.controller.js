import {Book, Publisher} from "../model/index.js";

export const findPublishersByAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.author);
        if (!author) {
            return res.status(404).send({error: `Author ${req.params.author} not found`});
        }
        const books = await author.getBooks();
        const publishers = [...new Set(books.map(book => book.publisher))];
        return res.json(publishers);
    } catch (err) {
        return res.status(500).send({
            error: err.message,
            message: 'An error occurred while finding publishers by author',
        })
    }
};

export const findBooksByPublisher = async (req, res) => {
    try {
        const publisher = await Publisher.findByPk(req.params.publisher);
        if (!publisher) {
            return res.status(404).send({error: `Publisher ${req.params.publisher} not found`});
        }
        const books = await Book.findAll({
            where: {publisher: req.params.publisher}
        });
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
            message: 'An error occurred while finding books by publisher',
        })
    }
};