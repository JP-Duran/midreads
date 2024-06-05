import React, { useState } from "react";

const Header = ({ onSearch }) => {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    numPages: undefined,
    ranking: 0,
    numRatings: 0,
  });

  const handleAddBookClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      bookData.title == "" ||
      bookData.author == "" ||
      bookData.numPages === undefined
    ) {
      alert("please fill out all fields to add a book");
      setShowForm(false);
      return;
    }

    bookData.numPages = parseInt(bookData.numPages, 10);

    if (isNaN(bookData.numPages)) {
      alert("'number of pages' must be a valid integer");
      setShowForm(false);
      return;
    }

    const promise = fetch("http://localhost:8000/addBook", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    promise.then((response) => {
      if (response.status === 201) {
        setBookData({
          title: "",
          author: "",
          numPages: undefined,
          ranking: 0,
          numRatings: 0,
        });
        setSubmitted(true);
      } else {
        alert("either you entered a bad word, or we already have that book!!!");
        setShowForm(false);
        setBookData({
          title: "",
          author: "",
          numPages: undefined,
          ranking: 0,
          numRatings: 0,
        });
        console.log("error occured adding book");
      }
    });
  };

  return (
    <div className="header">
      <div className="logo">MidReads</div>
      <input
        type="text"
        placeholder="Search books..."
        onChange={(e) => onSearch(e.target.value)}
        style={{ color: "black" }}
      />
      <button onClick={handleAddBookClick}>Add a book</button>

      {showForm && (
        <div className="floating-form">
          <div className="form-container">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={bookData.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={bookData.author}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="numPages"
              placeholder="Number of pages"
              value={bookData.numPages}
              onChange={handleInputChange}
            />
            {submitted && <div style={{ color: "maroon" }}>Book added.</div>}
            {submitted && (
              <button
                onClick={() => {
                  setShowForm(false);
                  setSubmitted(false);
                }}
              >
                Close.
              </button>
            )}
            {!submitted && <button onClick={handleSubmit}>Submit.</button>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
