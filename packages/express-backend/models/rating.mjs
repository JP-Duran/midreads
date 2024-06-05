import mongoose from "mongoose";
import userModel from "./user.mjs";
import bookModel from "./book.mjs";

const RatingSchema = new mongoose.Schema(
  {
    by: {
      type: String,
      ref: "User",
      required: true,
    },
    about: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { collection: "ratings_list" }
);

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating;
