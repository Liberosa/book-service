import { Book, Author} from "../model/index.js";
import { sequelize } from "../config/database.js";

export const findByIsbn = async (isbn, options = {}) => {
    return await Book.findByPk(isbn, {
        ...options,
        include: [
            {
                model: Author, as: 'authors',
                attributes: {
                    include: [[sequelize.col('birth_date'), 'birthDate']],
                    exclude: ['birth_date']
                }, through: {attributes: []}
            }
        ]
    });
};

export const create = async (data, options = {}) => {
    return await Book.create(data, options);
};

export const update = async (isbn, data, options = {}) => {
    const book = await Book.findByPk(isbn, options);
    if (book) {
        return await book.update(data, options);
    }
    return null;
};

export const destroy = async (isbn, options = {}) => {
    const book = await Book.findByPk(isbn, options);
    if (book) {
        await book.destroy(options);
        return book;
    }
    return null;
};

export const findByPublisher = async (publisherName) => {
    return await Book.findAll({
        where: {
            publisher: publisherName
        },
        include: [
            {
                model: Author, as: 'authors',
                attributes: {
                    include: [[sequelize.col('birth_date'), 'birthDate']],
                    exclude: ['birth_date']
                },
                through: {attributes: []}
            }
        ]
    });
};

export const findByAuthor = async (author) => {
    return await author.getBooks({
        joinTableAttributes: [],
        include: [{
            model: Author, as: 'authors',
            attributes: {
                include: [[sequelize.col('birth_date'), 'birthDate']],
                exclude: ['birth_date']
            },
            through: {attributes: []}
        }],
    });
};

export const getAuthors = async (book, options = {}) => {
    return await book.getAuthors(options);
};

export const getPublishersByAuthor = async (authorName) => {
    const publishers = await Book.aggregate('publisher', 'DISTINCT', {
        plain: false,
        include: {
            model: Author,
            as: 'authors',
            where: {name: authorName},
            through: {attributes: []}
        }
    });
    return publishers.map(p => p.DISTINCT);
};
