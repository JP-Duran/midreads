import mongoose from "mongoose";
import userModel from "./user.mjs";
import bookModel from "./book.mjs";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    uid: {
      type: String,
      required: true,
      trim: true
    },
    booksToRead: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: function() {
        return [];
      }
    }],
    library: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: function() {
        return [];
      }
    }],
    bio: {
        type: String,
        default: ""
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }],
    photo: {
       type: String,
       default: '../Default_pfp.jpg'
    }
  },
  { collection: "users_list_new" }
);

const User = mongoose.model("User", UserSchema);

export default User;