import mongoose from "mongoose";
import bookModel from "../models/book.mjs";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

const disconnectFromDatabase = () => {
  return mongoose.disconnect();
};

async function addBook(book) {
  const bookToAdd = new bookModel(book);
  const title = bookToAdd.title;
  const author = bookToAdd.author;
  const badWordsSubstrings = [
    "fuck",
    "shit",
    "bitch",
    "imshrekwesandimgettingreallyrich",
  ];

  function containsAnySubstring(mainString, searchStrings) {
    const lowerMainString = mainString.toLowerCase();

    for (const searchString of searchStrings) {
      const lowerSearchString = searchString.toLowerCase();

      if (lowerMainString.includes(lowerSearchString)) {
        return true;
      }
    }
    return false;
  }

  if (
    containsAnySubstring(title, badWordsSubstrings) ||
    containsAnySubstring(author, badWordsSubstrings)
  ) {
    return undefined;
  } else {
    const exactMatchTitleRegex = `^${title}$`;
    const exactMatchAuthorRegex = `^${author}$`;

    const result = await bookModel.find({
      $and: [
        { title: { $regex: exactMatchTitleRegex, $options: "i" } },
        { author: { $regex: exactMatchAuthorRegex, $options: "i" } },
      ],
    });

    if (result.length === 0) {
      const savedBook = await bookToAdd.save();
      return savedBook;
    } else {
      return undefined;
    }
  }
}

function findBooksWithSubstring(substring, startIndex, endIndex) {
  //will find all books containing substring, use for search
  const promise = bookModel
    .find({ title: { $regex: substring, $options: "i" } })
    .skip(startIndex)
    .limit(endIndex - startIndex);
  return promise;
}

function findCountOfBooksWithSubstring(substring) {
  const promise = bookModel.countDocuments({
    title: { $regex: substring, $options: "i" },
  });
  return promise;
}

export default {
  addBook,
  findBooksWithSubstring,
  findCountOfBooksWithSubstring,
  disconnectFromDatabase
};
