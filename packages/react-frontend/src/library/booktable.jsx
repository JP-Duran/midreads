import React, { useEffect, useState } from 'react';
import './bookTable.css';
import { UncontrolledPopover, PopoverBody } from 'reactstrap'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { useAuth } from '../Auth';

const BookTable = ({ books }) => {


    const { currentUser } = useAuth();

    const [rating, setRating] = useState(0);
    const [showRateMessage, setShowRateMessage] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [rateMessage, setRateMessage] = useState("Rating submitted.");

    function rateBook(uid, book, rating) {
        console.log("title: " + book.title + "\n updated rating: " + rating);
        const rateData = {
            by: uid,
            about: book,
            rating: rating
          };
    
        const promise = fetch("http://localhost:8000/rateBook", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rateData)
        });

        promise.then((result) => {
            if (result.status == 200) {
              setRateMessage("Rating updated.");
              setShowRateMessage(true);
            } else {
              setRateMessage("Unknown error occurred");
              setShowRateMessage(true);
            }
          })
    }

    //make endpoint for this from getrating service
    //propagate to rtable
    function getRating(bookID, userID) {
        const url = new URL("http://localhost:8000/getRating");
        url.searchParams.append("uid", userID);
        url.searchParams.append("book", bookID);
        const promise = fetch(url, {

          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        promise.then((result) => {
            if (result.status == 200) {
                console.log(result.body.rating)
              return result.rating
            } else {
              console.log("error")
            }
          })
    }

    return (
        <table className="book-table">
            <colgroup>
                <col className="title" />
                <col className="author" />
                <col className="pages" />
                <col className="rating" />
                <col className="change-rating" />
            </colgroup>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Number of Pages</th>
                    <th>My Rating</th>
                    <th>Change my Rating</th>
                </tr>
            </thead>
            <tbody>
                {books.map(book => (
                    <tr key={book._id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.numPages}</td>
                        <td>{getRating(book._id, currentUser.uid)}</td>
                        <td>
                            <button id={`ratingbutton-${book._id}`} type="button"
                                    onClick={() => { setSelectedBookId(book._id);
                                                     setShowRateMessage(false); }}
                            >
                                Update Rating
                            </button>
                        </td>
                            {selectedBookId === book._id && (
                            <UncontrolledPopover
                                className='popover'
                                placement='top'
                                target={`ratingbutton-${book._id}`}
                                trigger='legacy'
                            >
                                <PopoverBody>
                                <Rating style={{ maxWidth: 200,
                                                padding: '10px' }}
                                        value={rating}
                                        onChange={setRating} />
                                <div style={{ padding: '10px',
                                                paddingTop: '0px',
                                                display: 'inline-block' }}>
                                    <button onClick={() => {rateBook(currentUser.uid, book, rating);}}>
                                    Rate
                                    </button>
                                </div>
                                <div style={{ color : 'maroon',
                                                padding: '10px',
                                                paddingTop: '0px',
                                                display: 'inline-block' }}>
                                    { showRateMessage ? <text>{rateMessage}</text> : null }
                                </div>
                                </PopoverBody>
                            </UncontrolledPopover>
                            )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default BookTable;
