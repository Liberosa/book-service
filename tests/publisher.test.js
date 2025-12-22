import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/services/publisher.service.js', () => ({
    getPublishersByAuthor: jest.fn()
}));
jest.unstable_mockModule('../src/services/author.service.js', () => ({
    getAuthorByName: jest.fn()
}));

const publisherService = import('../src/services/publisher.service.js');
const authorService =  import('../src/services/author.service.js');
const { default: app } =  import('../src/app.js');
const { default: request } =  import('supertest');

describe('Publisher API', () => {
    let consoleSpy;

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        jest.clearAllMocks();
    });

    describe('GET /publishers/author/:name', () => {
        it('should return publishers for a given author name', async () => {
            const mockAuthor = { name: 'Test Author' };
            const mockPublishers = ['Publisher 1', 'Publisher 2'];

            authorService.getAuthorByName.mockResolvedValue(mockAuthor);
            publisherService.getPublishersByAuthor.mockResolvedValue(mockPublishers);

            const response = await request(app).get('/publishers/author/Test%20Author');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPublishers);
            expect(authorService.getAuthorByName).toHaveBeenCalledWith('Test Author');
            expect(publisherService.getPublishersByAuthor).toHaveBeenCalledWith('Test Author');
        });

        it('should return 404 if author not found', async () => {
            authorService.getAuthorByName.mockResolvedValue(null);

            const response = await request(app).get('/publishers/author/Unknown');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Author not found');
        });

        it('should return 500 if an error occurs', async () => {
            authorService.getAuthorByName.mockRejectedValue(new Error('DB Error'));

            const response = await request(app).get('/publishers/author/Test%20Author');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('DB Error');
        });
    });
});
