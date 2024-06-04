import mongoose from "mongoose";
import userModel from "../models/user.mjs";
import bookModel from "../models/book.mjs";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("debug", true);

mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('Error connecting to MongoDB Atlas:', error));


function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function getUser(uid) {
  return userModel.findOne({ uid: uid })
}

async function updateReadLater(uid, book) {
  let user = await userModel.findOne({ uid: uid })
  console.log(user);
  if(user.booksToRead.includes(book._id)) {
    return undefined;
  } else {
    return userModel.updateOne(
      { uid: uid },
      { $push: { booksToRead: book._id } }
    );
  }   
}

async function removeReadLater(uid, book) {
  let user = await userModel.findOne({ uid: uid })
  console.log(user);
  if(user.booksToRead.includes(book._id)) {
    return userModel.updateOne(
      { uid: uid },
      { $pull: { booksToRead: book._id } }
    );
  } else {
    return undefined
  }   
}

async function updateLibrary(uid, book) {
  let user = await userModel.findOne({ uid: uid })
  if(user.library.includes(book._id)) {
    return undefined;
  } else {
    return userModel.updateOne(
      { uid: uid },
      { $push: { library: book._id } }
    );
  }   
}

async function updatePhoto(uid, url) {
  console.log("USERPHOTOURL:", url)
  return userModel.updateOne(
    { uid: uid },
    { $set: {photo: url} } 
  )
}  

async function updateBio(uid, bio) {
  return userModel.updateOne(
    { uid: uid },
    { $set: {bio: bio} } 
  )
} 

async function getUserBio(uid) {
  let user = await userModel.findOne({ uid: uid });

  let bio = user.bio
  return bio
}


async function getUserLibrary(uid) {
  let user = await userModel.findOne({ uid: uid });

  let library = await Promise.all(user.library.map(bookId => bookModel.findById(bookId)));
  return library;
}

async function getUserReadLater(uid) {
  let user = await userModel.findOne({ uid: uid });

  let readLater = await Promise.all(user.booksToRead.map(bookId => bookModel.findById(bookId)));
  
  return readLater;
}

async function getCountLibrary(uid) {
  let user = await userModel.findOne({ uid: uid});
  let count = user.library.length;
  return count;
}

async function getCountTotalPages(uid) {
  //let user = await userModel.findOne({ uid: uid});
  let books = await getUserLibrary(uid)
  console.log(books);
  let pages = books.reduce((sum, book) => sum + book.numPages, 0);
  return pages

}

async function updateFriends(uid, friend) {
  let user = await userModel.findOne({ uid: uid })
  let friendObj = await userModel.findOne({userName: friend});
  if(friendObj === null) {
    return undefined;
  }
  if(user.friends.includes(friendObj._id)) {
    return undefined;
  } else {
    return userModel.updateOne(
      { uid: uid },
      { $push: { friends: friendObj } }
    );
  }   
}

async function getFriends(friendIds) {
  return userModel.find({ _id: { $in: friendIds } });
}


export default {
    addUser,
    getUser,
    updateReadLater,
    updateLibrary,
    getUserLibrary,
    getCountLibrary,
    getCountTotalPages,
    updateFriends,
    getFriends,
    getUserReadLater,
    removeReadLater,
    updatePhoto,
    updateBio,
    getUserBio
};