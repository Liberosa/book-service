import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/services/author.service.js', () => ({
    getBookAuthors: jest.fn(),
    deleteAuthor: jest.fn(),
    getAuthorByName: jest.fn()
}));

const authorService =  import('../src/services/author.service.js');
const { default: app } =  import('../src/app.js');
const { default: request } =  import('supertest');

describe('Author API', () => {
    let consoleSpy;
    const mockAuthors = [
        { name: 'Test Author 1', birthDate: '1980-01-01' },
        { name: 'Test Author 2', birthDate: '1985-05-05' }
    ];

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        jest.clearAllMocks();
    });

    describe('GET /authors/book/:isbn', () => {
        it('should return authors for a given book ISBN', async () => {
            authorService.getBookAuthors.mockResolvedValue(mockAuthors);

            const response = await request(app).get('/authors/book/1234567890');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockAuthors);
            expect(authorService.getBookAuthors).toHaveBeenCalledWith('1234567890');
        });

        it('should return 404 if book not found', async () => {
            authorService.getBookAuthors.mockResolvedValue(null);

            const response = await request(app).get('/authors/book/9999999999');

            expect(response.status).toBe(404);
            expect(response.body.error).toContain('not found');
        });
    });

    describe('DELETE /author/:name', () => {
        it('should delete an author and return it', async () => {
            const authorToDelete = mockAuthors[0];
            authorService.deleteAuthor.mockResolvedValue(authorToDelete);

            const response = await request(app).delete('/author/Test%20Author%201');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(authorToDelete);
        });

        it('should return 404 if author not found', async () => {
            authorService.deleteAuthor.mockResolvedValue(null);

            const response = await request(app).delete('/author/Unknown');

            expect(response.status).toBe(404);
        });

        it('should return 409 if author has books and cannot be removed', async () => {
            authorService.deleteAuthor.mockRejectedValue(new Error('Author Test Author 1 has books and cannot be removed'));

            const response = await request(app).delete('/author/Test%20Author%201');

            expect(response.status).toBe(409);
            expect(response.body.error).toContain('has books and cannot be removed');
        });

        it('should return 500 if an error occurs', async () => {
            authorService.deleteAuthor.mockRejectedValue(new Error('DB Error'));

            const response = await request(app).delete('/author/Test%20Author%201');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('DB Error');
        });
    });
});
