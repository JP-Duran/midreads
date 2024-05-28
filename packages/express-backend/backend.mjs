// backend.js
import express from "express";
import cors from "cors";
import userServices from "./services/userServices.mjs";
import bookServices from "./services/book-services.mjs";
import ratingServices from "./services/rating-services.mjs";
import uploadRoutes from "./uploadroutes.mjs";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('/uploads'));

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post("/createUser", async (req, res) => {
    const user = req.body;
    console.log(req);
    let promise = userServices.addUser(user);
    promise.then((newUser) => {
        res.status(201).json(newUser);
    })
});

app.get("/login", async (req, res) => {
  const userName = req.query.userName;
  const pwd = req.query.password;
  let promise = userServices.getUser(userName, pwd);
  promise.then((loggedInUser) => {
    console.log(loggedInUser);
    if(loggedInUser.length != 0)
      res.status(200).json(loggedInUser);
    else
      res.status(401).send("Invalid username or password");
  })
});

app.post("/addBook", async (req, res) => {
  const book = req.body;
  console.log(req);
  let promise = bookServices.addBook(book);
  promise.then((newBook) =>{
    res.status(201).json(newBook);
  })
});

app.get("/getBook", async (req, res) => {
  const title = req.query.title;
  const page = parseInt(req.query.page) || 1; 
  const pageSize = parseInt(req.query.pageSize) || 10; 
  const uid = req.query.uid;

  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  // If the user is provided, return the user's library
  if(uid !== undefined) {
    let promise = userServices.getUserLibrary(uid);
    promise.then(library => {
      const count = library.length;
      let returnObj = {count: count, data: library};
      res.status(200).json(returnObj);
    });
  } else {
    let countPromise = bookServices.findCountOfBooksWithSubstring(title);
    countPromise.then(count => {
      let returnObj = {count: count, data: [], start: startIndex, stop: endIndex}
      let promise = bookServices.findBooksWithSubstring(title, startIndex, endIndex);
      promise.then((book) => {
        if(book.length != 0) {
          returnObj.data = book;
          res.status(200).json(returnObj);
        }
        else {
          res.status(404).send("Book not found.");
        }
      })}).catch(error => {
        console.error('Error getting books:', error);
        res.status(500).send("Internal server error");
      });
  }
});

app.put("/rateBook", async (req, res) => {
  const by = req.body.by;
  const about = req.body.about;
  const rating = req.body.rating;
  //console.log(by, about, rating);
  let promise = ratingServices.updateRating(by, about, rating);
  promise.then(result => {
    if(result === undefined) {
      res.status(500)
    } else {
      res.status(200).send("Rating updated");
    }
  });
})

app.post("/rateBook", async (req, res) => {
  const rating = req.body;
  console.log(req);
  let promise = ratingServices.addRating(rating);
  promise.then((newRating) => {
    let libPromise = userServices.updateLibrary(newRating.by, newRating.about);
    libPromise.then((result) => {
      if (result === undefined) {
        res.status(406).send("Book already in library")
      } else {
        res.status(200).send("Book rating and added to library");
      }
    }).catch((error) => {
      console.log(error);
    })
  });
});

app.post("/readLater", async (req, res) => {
  const { uid, book } = req.body
  console.log(book);
  console.log(uid);
  let promise = userServices.updateReadLater(uid, book);
  promise.then((result) => {
    if(result === undefined){
      res.status(406).send("Book already in read later");
    } else {
      res.status(200).send("Book added to read later");
    }
  })
})

app.get("/getLibCount", async (req, res) => {
  const uid = req.query.uid;
  let count = userServices.getCountLibrary(uid);
  count.then((result) => {
    console.log(result)
    res.status(200).json(result)
  })
})

app.get("/getRating", async (req, res) => {
  const uid = req.query.uid
  const bookID = req.query.book

  let promise = ratingServices.getRating(uid, bookID)
  promise.then((result) => {
    console.log(result)
    res.status(200).json(result)
  })
})

app.get("/getLibPages", async (req, res) => {
  const uid = req.query.uid;
  let count = userServices.getCountTotalPages(uid);
  count.then((result) => {
    console.log(result)
    res.status(200).json(result)
  })
})

app.put("/addFriend", async (req, res) => {
  const friend = req.body.friend;
  const uid = req.body.user;
  let promise = userServices.updateFriends(uid, friend);
  promise.then(result => {
    if(result === undefined) {
      res.status(406).send("Error adding friend");
    } else {
      res.status(200).send("Friend successfully added");
    }
  })
})

app.put("/addFriend", async (req, res) => {
  const friend = req.body.friend;
  const uid = req.body.user;
  let promise = userServices.updateFriends(uid, friend);
  promise.then(result => {
    if(result === undefined) {
      res.status(406).send("Error adding friend");
    } else {
      res.status(200).send("Friend successfully added");
    }
  })
})

app.use('/api/uploads', uploadRoutes);

app.listen(port, () => {
    console.log(
      `Example app listening at http://localhost:${port}`
    );
  });
