import React, { useState, useEffect } from "react";
import BookTable from "./booktable";
import Header from "../generalHeader";
import Sidebar from "../sidebar";
import PaginationButton from "./PaginationButton";
import "./readLater.css";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [count, setCount] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
    } else {
      console.log("No user is logged in.");
      navigate("/login");
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
          setBooks(bookList.data);
          setCount(bookList.count);
        })
        .catch((error) => {
          console.error("Error getting books:", error);
        });
    }
  }, [currentUser]);

  function getBooks(uid) {
    const url = new URL("http://localhost:8000/getBook");
    url.searchParams.append("uid", uid);
    url.searchParams.append("later", 7);

    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  function removeReadLater(uid, book) {
    const bookData = {
      uid: uid,
      book: book,
    };
    const promise = fetch("http://localhost:8000/removeReadLater", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });
    promise.then((result) => {
      if (result.status === 406) {
        console.log(error);
      } else if (result.status === 200) {
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
            setBooks(bookList.data);
            setCount(bookList.count);
          })
          .catch((error) => {
            console.error("Error getting books:", error);
          });
      }
    });
  }

  return (
    <div className="container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <div className="home-main-content">
          <BookTable books={books} removeBook={removeReadLater} />
          <div className="pagination-container">
            <span>{count} books in your to-do list</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
