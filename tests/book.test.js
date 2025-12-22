import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/services/book.service.js', () => ({
    createBook: jest.fn(),
    getBookByIsbn: jest.fn(),
    deleteBook: jest.fn(),
    updateBookTitle: jest.fn(),
    getBooksByAuthor: jest.fn(),
    getBooksByPublisher: jest.fn()
}));

const bookService =  import('../src/services/book.service.js');
const { default: app } =  import('../src/app.js');
const { default: request } =  import('supertest');

describe('Book API', () => {
    let consoleSpy;
    const mockBook = {
        isbn: '1234567890',
        title: 'Test Book',
        publisher: 'Test Publisher',
        authors: [{ name: 'Test Author', birthDate: '1990-01-01' }]
    };

    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        jest.clearAllMocks();
    });

    describe('POST /book', () => {
        it('should create a new book and return 201', async () => {
            bookService.createBook.mockResolvedValue(mockBook);

            const response = await request(app)
                .post('/book')
                .send(mockBook);

            expect(response.status).toBe(201);
            expect(bookService.createBook).toHaveBeenCalledWith(mockBook);
        });

        it('should return 409 if book already exists', async () => {
            bookService.createBook.mockRejectedValue(new Error('Book with ISBN 1234567890 already exists'));

            const response = await request(app)
                .post('/book')
                .send(mockBook);

            expect(response.status).toBe(409);
            expect(response.body.error).toContain('already exists');
        });
    });

    describe('GET /book/:isbn', () => {
        it('should return a book if found', async () => {
            bookService.getBookByIsbn.mockResolvedValue(mockBook);

            const response = await request(app).get('/book/1234567890');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBook);
        });

        it('should return 404 if book not found', async () => {
            bookService.getBookByIsbn.mockResolvedValue(null);

            const response = await request(app).get('/book/1234567890');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Book with ISBN 1234567890 not found');
        });

        it('should return 500 if an error occurs', async () => {
            bookService.getBookByIsbn.mockRejectedValue(new Error('DB Error'));

            const response = await request(app).get('/book/1234567890');

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('DB Error');
        });
    });

    describe('DELETE /book/:isbn', () => {
        it('should delete a book and return it', async () => {
            bookService.deleteBook.mockResolvedValue(mockBook);

            const response = await request(app).delete('/book/1234567890');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBook);
        });

        it('should return 404 if book to delete not found', async () => {
            bookService.deleteBook.mockResolvedValue(null);

            const response = await request(app).delete('/book/1234567890');

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /book/:isbn/title/:title', () => {
        it('should update book title', async () => {
            const updatedBook = { ...mockBook, title: 'New Title' };
            bookService.updateBookTitle.mockResolvedValue(updatedBook);

            const response = await request(app).patch('/book/1234567890/title/New%20Title');

            expect(response.status).toBe(200);
            expect(response.body.title).toBe('New Title');
        });
    });

    describe('GET /books/author/:name', () => {
        it('should return books for a given author', async () => {
            bookService.getBooksByAuthor.mockResolvedValue([mockBook]);

            const response = await request(app).get('/books/author/Test%20Author');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0].isbn).toBe(mockBook.isbn);
        });

        it('should return 404 if author not found', async () => {
            bookService.getBooksByAuthor.mockResolvedValue(null);

            const response = await request(app).get('/books/author/Unknown');

            expect(response.status).toBe(404);
        });
    });

    describe('GET /books/publisher/:name', () => {
        it('should return books for a given publisher', async () => {
            bookService.getBooksByPublisher.mockResolvedValue([mockBook]);

            const response = await request(app).get('/books/publisher/Test%20Publisher');

            expect(response.status).toBe(200);
            expect(response.body[0].publisher).toBe(mockBook.publisher);
        });

        it('should return 404 if publisher not found', async () => {
            bookService.getBooksByPublisher.mockResolvedValue(null);

            const response = await request(app).get('/books/publisher/Unknown');

            expect(response.status).toBe(404);
        });
    });
});
