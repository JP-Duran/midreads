import mongoose from "mongoose";
import ratingModel from "../models/rating.mjs";
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

function addRating(rating) {
  addBookRating(rating.about, rating.rating);
  const ratingToAdd = new ratingModel(rating);
  const promise = ratingToAdd.save();
  return promise;
}

async function updateRating(by, about, rating) {
  let oldRating = await ratingModel.findOne({ by: by, about: about });
  console.log("old rating:", oldRating);
  updateBookRating(about, rating, oldRating.rating);
  return ratingModel.updateOne(
    { by: by, about: about },
    { $set: { rating: rating } }
  );
}

async function addBookRating(about, rating) {
  let book = await bookModel.findOne({ _id: about._id });
  let newRating =
    (book.ranking * book.numRatings + rating) / (book.numRatings + 1);
  newRating = parseFloat(newRating.toFixed(2));
  console.log("new rating:", newRating);
  await bookModel.updateOne(
    { _id: about._id },
    { $set: { ranking: newRating }, $inc: { numRatings: 1 } }
  );
}

async function updateBookRating(about, rating, oldRating) {
  let book = await bookModel.findOne({ _id: about._id });
  let newRating =
    (book.ranking * book.numRatings + rating - oldRating) / book.numRatings;
  newRating = parseFloat(newRating.toFixed(2));
  console.log("new rating:", newRating);
  await bookModel.updateOne(
    { _id: about._id },
    { $set: { ranking: newRating } }
  );
}

function getRating(by, bookId) {
  return ratingModel.find({ by: by, about: bookId });
}

function getAllRatingsAbout(bookID) {
  return ratingModel.find({ about: bookID });
}

function getAllRatingsBy(userID) {
  return ratingModel.find({ by: userID });
}

function averageRatingFor(bookID) {
  const promise = ratingModel.find({ about: bookID });

  promise
    .then((matchingEntries) => {
      if (matchingEntries == 0) {
        return undefined;
      } else {
        const sum = matchingEntries.reduce(
          (total, entry) => total + entry.rating,
          0
        );
        const average = sum / matchingEntries.length;
        return average;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export default {
  addRating,
  getRating,
  getAllRatingsAbout,
  getAllRatingsBy,
  averageRatingFor,
  updateRating,
};
