import bookServices from '../express-backend/services/book-services.mjs';
import bookModel from '../express-backend/models/book.mjs';

describe('Book Services Tests', () => {
  
  afterAll(async () => {
    await bookServices.disconnectFromDatabase();
  });

  afterEach(async () => {
    // Delete only the books added by tests
    await bookModel.deleteMany({ isTest: "true" });
  })


  test('should insert a book into the database', async () => {
    const book = { title: "Test Book", author: "Test Author", numPages: 500, isTest: "true" };
    const savedBook = await bookServices.addBook(book);
    expect(savedBook.title).toBe("Test Book");
    expect(savedBook.author).toBe("Test Author");

    const insertedBook = await bookModel.findOne({ title: "Test Book" });
    expect(insertedBook).toEqual(expect.objectContaining(book));
  });

  test('should not add a book with bad words', async () => {
    const book = { title: "shit", author: "Test Author", numPages: 500, isTest: "true"  };
    const savedBook = await bookServices.addBook(book);

    expect(savedBook).toBeUndefined();

    const insertedBook = await bookModel.findOne({ title: "shit" });
    expect(insertedBook).toBeNull();
  });

  test('should find books with substring', async () => {
    const book1 = { title: "Substring1", author: "Author 1", numPages: 500, isTest: "true"  };
    const book2 = { title: "Substring2", author: "Author 2", numPages: 500, isTest: "true"  };
    await bookServices.addBook(book1);
    await bookServices.addBook(book2);

    const foundBooks = await bookServices.findBooksWithSubstring("Substring", 0, 10);

    expect(foundBooks.length).toBe(2);
    expect(foundBooks).toEqual(
      expect.arrayContaining([
        expect.objectContaining(book1),
        expect.objectContaining(book2)
      ])
    );
  });

  test('should count books with substring', async () => {
    const book1 = { title: "Substring1", author: "Author 1", numPages: 500, isTest: "true"  };
    const book2 = { title: "Substring2", author: "Author 2", numPages: 500, isTest: "true"  };
    await bookServices.addBook(book1);
    await bookServices.addBook(book2);
    const count = await bookServices.findCountOfBooksWithSubstring("Substring");

    expect(count).toBe(2);
  });
  
});
