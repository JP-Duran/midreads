import userServices from '../express-backend/services/userServices.mjs';

describe('User Service Tests', () => {
    const testUser = {
        uid: '123',
        userName: 'testuser',
        library: [],
        booksToRead: [],
        friends: [],
        bio: 'test',
        photo: 'http://www.test.com'
    };
    const testUser2 = {
        uid: '456',
        userName: 'testuser2',
        library: [],
        booksToRead: [],
        friends: [],
        bio: 'test',
        photo: 'http://www.test.com'
    };

    test('addUser', async () => {
        const user = await userServices.addUser(testUser);
        expect(user.uid).toBe(testUser.uid);
        expect(user.userName).toBe(testUser.userName);
    });

    test('getUser', async () => {
        const user = await userServices.getUser(testUser.uid);
        expect(user.uid).toEqual(testUser.uid);
    });

    test('updatePhoto', async () => {
        const updateResult = await userServices.updatePhoto(testUser.uid, "www.newphoto.com");
        const user = await userServices.getUser(testUser.uid);
        expect(user.photo).toBe("www.newphoto.com");
    });

    test('updateReadLater', async () => {
        const book = {
            _id: "666294669301a9f248080ca5",
            title: "Test Book",
            author: "Test Author",
            numPages: 500
        };
        await userServices.updateReadLater(testUser.uid, book);
        const updatedUser = await userServices.getUser(testUser.uid);
        const bookIdStr = book._id.toString();
        const booksToReadStr = updatedUser.booksToRead.map(id => id.toString());
        expect(booksToReadStr).toContain(bookIdStr);
    });

    test('getUserReadLater', async () => {
        const readLater = await userServices.getUserReadLater(testUser.uid);
        const readLaterIds = readLater.map(book => book._id.toString());
        const expectedReadLaterIds = testUser.booksToRead.map(id => id.toString());
        expect(readLaterIds).toEqual(expect.arrayContaining(expectedReadLaterIds));
    });

    test('removeReadLater', async () => {
        const book = {
            _id: "666294669301a9f248080ca5",
            title: "Test Book",
            author: "Test Author",
            numPages: 500
        };
        await userServices.removeReadLater('123', book);
        const user = await userServices.getUser('123');
        expect(user.booksToRead).toEqual([]);
    });

    test('updateLibrary', async () => {
        const book = {
            _id: "666294669301a9f248080ca5",
            title: "Test Book",
            author: "Test Author",
            numPages: 652
        };
        await userServices.updateLibrary(testUser.uid, book);
        const updatedUser = await userServices.getUser(testUser.uid);
        const bookIdStr = book._id.toString();
        const libraryStr = updatedUser.library.map(id => id.toString());
        expect(libraryStr).toContain(bookIdStr);
    });

    test('getUserLibrary', async () => {
        const lib = await userServices.getUserLibrary(testUser.uid);
        const libraryIds = lib.map(book => book._id.toString());
        const expectedLibraryIds = testUser.library.map(id => id.toString());
        expect(libraryIds).toEqual(expect.arrayContaining(expectedLibraryIds));
    });

    test('getCountLibrary', async () => {
        const count = await userServices.getCountLibrary(testUser.uid);
        expect(count).toEqual(1);
    });

    test('updateBio', async () => {
        await userServices.updateBio(testUser.uid, "new test bio");
        const user = await userServices.getUser(testUser.uid);
        expect(user.bio).toBe("new test bio");
    });

    test('getUserBio', async () => {
        const user = await userServices.getUserBio(testUser.uid);
        const updatedUser = await userServices.getUser(testUser.uid);
        expect(updatedUser.bio).toBe("new test bio");
    });

    test('getCountTotalPages', async () => {
        const count = await userServices.getCountTotalPages(testUser.uid);
        expect(count).toEqual(652);
    });

    test('updateFriends', async () => {
        const user2 = await userServices.addUser(testUser2);
        await userServices.updateFriends(testUser.uid, user2.userName);
        const updatedUser = await userServices.getUser(testUser.uid);
        const friendsList = await userServices.getFriends(updatedUser.friends);
        const friendIds = friendsList.map(friend => friend._id.toString());
        expect(friendIds).toContain(user2._id.toString());
    });

    test('getFriends', async () => {
        const updatedUser = await userServices.getUser(testUser.uid);
        const updatedUser2 = await userServices.getUser(testUser2.uid);
        const friends = await userServices.getFriends(updatedUser.friends);
        const friendIds = friends.map(friend => friend._id.toString());
        expect(friendIds).toContain(updatedUser2._id.toString());
    });

    test('removeUser', async () => {
        const result1 = await userServices.removeUser('123');
        const result2 = await userServices.removeUser('456');
        expect(result1.deletedCount).toBe(1);
        expect(result2.deletedCount).toBe(1);
    });

    test('disconnectFromDatabase', async () => {
        const result = await userServices.disconnectFromDatabase();
        expect(result).toBe(undefined);
    });
});
