import * as bookRepository from "../repositories/book.repository.js";

export const getPublishersByAuthor = async (authorName) => {
    return await bookRepository.getPublishersByAuthor(authorName);
};
