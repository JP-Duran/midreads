import React, { useState } from "react";
import "./bookTable.css";
import { useAuth } from "../Auth";
import { UncontrolledPopover, PopoverBody, PopoverHeader } from "reactstrap";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const BookTable = ({ books }) => {
  const { currentUser } = useAuth();

  const handleReadLater = (book) => {
    readLater(currentUser.uid, book);
  };

  const [rating, setRating] = useState(0);
  const [showRateMessage, setShowRateMessage] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [rateMessage, setRateMessage] = useState("Rating submitted.");

  function rateBook(uid, book, rating) {
    console.log("title: " + book.title + "\n rating: " + rating);
    const rateData = {
      by: uid,
      about: book,
      rating: rating,
    };

    const promise = fetch("http://localhost:8000/rateBook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rateData),
    });

    promise.then((result) => {
      if (result.status == 406) {
        setRateMessage("Use 'Library' tab to change rating");
        setShowRateMessage(true);
      } else if (result.status == 200) {
        setRateMessage("Rating submitted");
        setShowRateMessage(true);
      } else {
        setRateMessage("Unknown error occurred");
        setShowRateMessage(true);
      }
    });
  }

  function readLater(uid, book) {
    const bookData = {
      uid: uid,
      book: book,
    };
    console.log(uid);
    console.log(book);
    const promise = fetch("http://localhost:8000/readLater", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });
    promise.then((result) => {
      if (result.status === 406) {
        alert("Error: Book already in read later");
      } else if (result.status === 200) {
        alert("Book successfully added to read later");
      }
    });
  }

  return (
    <table className="book-table">
      <colgroup>
        <col className="title" />
        <col className="author" />
        <col className="pages" />
        <col className="rating" />
        <col className="predicted-rating" />
        <col className="read-later" />
      </colgroup>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Number of Pages</th>
          <th>Rating</th>
          <th>Read Later</th>
          <th>Rate It</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book._id}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.numPages}</td>
            <td>{book.ranking}</td>
            <td>
              <button onClick={() => handleReadLater(book)}>Read Later</button>
            </td>
            <td>
              <button
                id={`ratingbutton-${book._id}`}
                type="button"
                onClick={() => {
                  setSelectedBookId(book._id);
                  setShowRateMessage(false);
                }}
              >
                Rate It
              </button>
            </td>
            {selectedBookId === book._id && (
              <UncontrolledPopover
                className="popover"
                placement="top"
                target={`ratingbutton-${book._id}`}
                trigger="legacy"
              >
                <PopoverHeader>
                  <div style={{ color: "black", padding: "5px" }}>
                    Rate Book & Add to Library
                  </div>
                </PopoverHeader>
                <PopoverBody>
                  <Rating
                    style={{ maxWidth: 200, padding: "10px" }}
                    value={rating}
                    onChange={setRating}
                  />
                  <div
                    style={{
                      padding: "10px",
                      paddingTop: "2px",
                      display: "inline-block",
                    }}
                  >
                    <button
                      onClick={() => {
                        rateBook(currentUser.uid, book, rating);
                      }}
                    >
                      Rate
                    </button>
                  </div>
                  <div
                    style={{
                      color: "maroon",
                      padding: "10px",
                      paddingLeft: "0px",
                      paddingTop: "0px",
                      display: "inline-block",
                    }}
                  >
                    {showRateMessage ? <text>{rateMessage}</text> : null}
                  </div>
                </PopoverBody>
              </UncontrolledPopover>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookTable;
