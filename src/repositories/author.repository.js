import { Author } from "../model/index.js";
import { sequelize } from "../config/database.js";

export const findByName = async (name, options = {}) => {
    return await Author.findByPk(name, options);
};

export const findByNameWithBirthDate = async (name, options = {}) => {
    return await Author.findByPk(name, {
        ...options,
        attributes: {
            include: [[sequelize.col('birth_date'), 'birthDate']],
            exclude: ['birth_date']
        }
    });
};

export const create = async (data, options = {}) => {
    return Author.create(data, options);
};

export const destroy = async (author, options = {}) => {
    return await author.destroy(options);
};

export const getBooks = async (author, options = {}) => {
    return await author.getBooks(options);
};
