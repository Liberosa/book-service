import Author from "./author.model.js";
import Publisher from "./publisher.model.js";
import Book from "./book.model.js";
import {DataTypes} from "sequelize";
import {sequelize} from "../config/database.js";

Book.belongsTo(Publisher, {
    foreignKey: 'publisher',
    targetKey: 'publisher_name',
    as: 'publisherDetails',
});

Publisher.hasMany(Book, {
    foreignKey: 'publisher',
    sourceKey: 'publisher_name',
    as: 'books',
});

const BooksAuthors = sequelize.define('BooksAuthors', {
    isbn: {
        type: DataTypes.STRING,
        references: {
            model: Book,
            key: 'isbn',
        },
        author_name: {
            type: DataTypes.STRING,
            references: {
                model: Author,
                key: 'name',
            }
        }
    }
}, {tableName: 'books_authors'});

Book.belongsToMany(Author, {
    through: BooksAuthors,
    foreignKey: 'isbn',
    otherKey: 'author_name',
    as: 'books',
});
Author.belongsToMany(Book, {
    through: BooksAuthors,
    foreignKey: 'publisher',
    otherKey: 'isbn',
    as: 'books'
});

const syncModels = async () => {
    try {
        await sequelize.sync();
        console.log('Models synced successfully');
    } catch (e) {
        console.log("Error syncing models:", e)
    }
};

export  {syncModels, Book, Author, Publisher};