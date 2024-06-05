import React, { useState, useEffect } from "react";
import BookTable from "./friendsTable";
import Header from "./header";
import Sidebar from "../sidebar";
import PaginationButton from "./PaginationButton";
import "./friends.css";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      console.log("No user is logged in.");
      navigate("/login");
    } else {
      //console.log(currentUser);
      handleSearch("");
    }
  }, [currentUser, navigate]);

  const handleSearchInput = debounce((search) => {
    setSearchTerm(search);
  }, 300);

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  return (
    <div className="container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <div className="home-main-content">
          <BookTable books={books} />
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
