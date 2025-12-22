import { Publisher } from "../model/index.js";

export const findByName = async (name, options = {}) => {
    return await Publisher.findByPk(name, options);
};

export const create = async (data, options = {}) => {
    return await Publisher.create(data, options);
};
