import { jest } from '@jest/globals';

// Mock repositories and sequelize
jest.unstable_mockModule('../src/repositories/book.repository.js', () => ({
    findByIsbn: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
    findByAuthor: jest.fn(),
    findByPublisher: jest.fn(),
}));

jest.unstable_mockModule('../src/repositories/author.repository.js', () => ({
    findByName: jest.fn(),
    create: jest.fn(),
    findByNameWithBirthDate: jest.fn(),
    destroy: jest.fn(),
    getBooks: jest.fn(),
}));

jest.unstable_mockModule('../src/repositories/publisher.repository.js', () => ({
    findByName: jest.fn(),
    create: jest.fn(),
}));

jest.unstable_mockModule('../src/config/database.js', () => ({
    sequelize: {
        transaction: jest.fn(() => ({
            commit: jest.fn(),
            rollback: jest.fn(),
        })),
    },
}));

const bookRepository =  import('../src/repositories/book.repository.js');
const authorRepository =  import('../src/repositories/author.repository.js');
const publisherRepository =  import('../src/repositories/publisher.repository.js');
const { sequelize } =  import('../src/config/database.js');
const bookService =  import('../src/services/book.service.js');

describe('Book Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createBook', () => {
        const bookData = {
            isbn: '123456',
            title: 'New Book',
            authors: [{ name: 'Author 1', birthDate: '1990-01-01' }],
            publisher: 'Publisher 1'
        };

        it('should create a book and return it if it does not exist', async () => {
            bookRepository.findByIsbn.mockResolvedValue(null);
            publisherRepository.findByName.mockResolvedValue({ name: 'Publisher 1' });
            authorRepository.findByName.mockResolvedValue({ name: 'Author 1' });
            
            const mockBook = { 
                ...bookData, 
                setAuthors: jest.fn().mockResolvedValue(true) 
            };
            bookRepository.create.mockResolvedValue(mockBook);

            const result = await bookService.createBook(bookData);

            expect(result).toBe(mockBook);
            expect(bookRepository.create).toHaveBeenCalled();
            expect(mockBook.setAuthors).toHaveBeenCalled();
        });

        it('should throw an error if book already exists', async () => {
            bookRepository.findByIsbn.mockResolvedValue({ isbn: '123456' });

            await expect(bookService.createBook(bookData)).rejects.toThrow('already exists');
        });
    });

    describe('getBookByIsbn', () => {
        it('should call repository findByIsbn', async () => {
            const mockBook = { isbn: '123', title: 'Test' };
            bookRepository.findByIsbn.mockResolvedValue(mockBook);

            const result = await bookService.getBookByIsbn('123');

            expect(result).toBe(mockBook);
            expect(bookRepository.findByIsbn).toHaveBeenCalledWith('123');
        });
    });

    describe('deleteBook', () => {
        it('should return book if deleted', async () => {
            const mockBook = { isbn: '123' };
            bookRepository.destroy.mockResolvedValue(mockBook);

            const result = await bookService.deleteBook('123');

            expect(result).toBe(mockBook);
        });

        it('should return null if book not found', async () => {
            bookRepository.destroy.mockResolvedValue(null);

            const result = await bookService.deleteBook('123');

            expect(result).toBeNull();
        });
    });
});
