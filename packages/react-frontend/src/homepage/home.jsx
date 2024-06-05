import React, { useState, useEffect } from "react";
import BookTable from "./booktable";
import Header from "./header";
import Sidebar from "../sidebar";
import PaginationButton from "./PaginationButton";
import "./homePage.css";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleSearch("");
    if (currentUser) {
      console.log(currentUser);
    } else {
      console.log("No user is logged in.");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getBooks(searchTerm, currentPage)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          return { data: [], count: 0 };
        }
      })
      .then((bookList) => {
        setBooks(bookList.data);
        setTotalPages(Math.ceil(bookList.count / 10));
      })
      .catch((error) => {
        console.error("Error getting books:", error);
      });
  }, [currentPage, searchTerm]);

  const handleSearchInput = debounce((search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  }, 300);

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  function getBooks(search, currentPage) {
    const url = new URL("http://localhost:8000/getBook");
    url.searchParams.append("title", search);
    url.searchParams.append("page", currentPage);

    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const handlePreviousPage = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages));
  };

  return (
    <div className="container">
      <Header onSearch={handleSearchInput} />
      <div className="content-wrapper">
        <Sidebar />
        <div className="home-main-content">
          <BookTable books={books} />
          <div className="pagination-container">
            <PaginationButton onClick={handlePreviousPage} label="Previous" />
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <PaginationButton onClick={handleNextPage} label="Next" />
          </div>
        </div>
      </div>
    </div>
  );
};

function debounce(func, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export default Home;
