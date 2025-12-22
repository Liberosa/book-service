import * as publisherService from "../services/publisher.service.js";
import * as authorService from "../services/author.service.js";

export const findPublishersByAuthor = async (req, res) => {
    try {
        const author = await authorService.getAuthorByName(req.params.name);
        if (!author) {
            return res.status(404).json({error: 'Author not found'});
        }
        const publishers = await publisherService.getPublishersByAuthor(author.name);
        return res.json(publishers);
    } catch (e) {
        console.error('Error finding publishers by author:', e);
        return res.status(500).send({error: e.message});
    }
};