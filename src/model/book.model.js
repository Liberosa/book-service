import {DataTypes} from "sequelize";
import {sequelize} from "../config/database.js";

const Book = sequelize.define("Book", {
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true,
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
}, {tableName: 'Books', timestamps: false});

export default Book;