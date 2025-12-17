import {Author, Book, Publisher} from "../model/index.js";
import {sequelize} from "../config/database.js";

export const addBook = async (req, res) => {
    const t = await sequelize.transaction({readOnly: true});
    try {
        const {isbn, title, authors, publisher} = req.body;
        const existingBook = await Book.findByPk(isbn);
        if (existingBook) {
            await t.rollback();
            return res.status(409).send({
                error: `Book with ISBN ${isbn} already exists`,
            })
        }
        let publisherRecord = await Publisher.findByPk(publisher);
        if (!await Publisher.findByPk(publisher, {transaction: t})) {
            await Publisher.create({publisher_name: publisher},
                {transaction: t})
        }
        const authorRecords = [];
        for (const author of authors) {
            let authorRecord = await Author.findByPk(author.name, {transaction: t});
            if (!authorRecord) {
                authorRecord = await Author.create({name: author.name, birth_date: new Date(author.birthDate)},
                    {transaction: t});
            }
            if (authorRecord.findIndex((a) => a.name === authorRecord.name) === -1) {
                authorRecords.push(authorRecord);
            }
        }
        const book = await Book.create({isbn, title, publisher},
            {transaction: t});
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

