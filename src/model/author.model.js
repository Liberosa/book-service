import {DataTypes} from "sequelize";
import {sequelize}from "../config/database.js";

const Author = sequelize.define('Author', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    }
}, {
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {tableName: 'Authors', timestamps: false});


export default Author;