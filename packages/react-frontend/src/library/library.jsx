import React, { useState, useEffect } from "react";
import BookTable from "./booktable";
import Header from "../generalHeader";
import Sidebar from "../sidebar";
import PaginationButton from "./PaginationButton";
import "./library.css";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const [books, setBooks] = useState([]);
  const [count, setCount] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    } else {
      //console.log(currentUser);
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      getBooks(currentUser.uid)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 404) {
            console.log("BAD");
            return { data: [], count: 0 };
          }
        })
        .then((bookList) => {
          const promises = [];
          for (const book of bookList.data) {
            const url = new URL("http://localhost:8000/getRating");
            url.searchParams.append("by", currentUser.uid);
            url.searchParams.append("about", book._id);

            const ratingPromise = fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }).then((response) => {
              if (response.status === 201) {
                return response.json();
              }
            });

            promises.push(
              ratingPromise.then((rating) => {
                book.ranking = rating[0].rating;
                console.log("rating for book ", book, rating);
                return book;
              })
            );
          }

          Promise.all(promises).then((array) => {
            console.log("books list:", array);
            setBooks(array);
            setCount(array.length);
          });
        })
        .catch((error) => {
          console.error("Error getting books:", error);
        });
    }
  }, [currentUser]);

  function getBooks(uid) {
    //console.log(currentUser);
    const url = new URL("http://localhost:8000/getBook");
    url.searchParams.append("uid", uid);

    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return (
    <div className="container">
      <Header />

      <div className="content-wrapper">
        <Sidebar />
        <div className="home-main-content">
          <BookTable books={books} />
          <div className="pagination-container">
            <span>{count} books in library</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
