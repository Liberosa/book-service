import * as authorService from "../services/author.service.js";

export const findBookAuthors = async (req, res) => {
    try {
        const authors = await authorService.getBookAuthors(req.params.isbn);
        if (authors === null) {
            return res.status(404).send({error: `Book with ISBN ${req.params.isbn} not found`});
        }
        return res.json(authors);
    } catch (e) {
        console.error('Error finding book authors:', e);
        return res.status(500).send({error: e.message});
    }
};

export const removeAuthor = async (req, res) => {
    try {
        const author = await authorService.deleteAuthor(req.params.name);
        if (!author) {
            return res.status(404).send({error: `Author with name ${req.params.name} not found`});
        }
        return res.json(author);
    } catch (e) {
        if (e.message.includes('has books and cannot be removed')) {
            return res.status(409).send({error: e.message});
        }
        console.error('Error removing author:', e);
        return res.status(500).send({
            error: e.message,
            message: 'Failed to remove author'
        });
    }
};