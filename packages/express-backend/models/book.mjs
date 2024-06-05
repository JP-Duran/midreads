import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    numPages: {
      type: Number,
      required: true,
    },
    ranking: {
      type: Number,
      required: false,
    },
    numRatings: {
      type: Number,
      required: false,
    },
  },
  { collection: "book_list_new" }
);

const Book = mongoose.model("Book", BookSchema);

export default Book;
