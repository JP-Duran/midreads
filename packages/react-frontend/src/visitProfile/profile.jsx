import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import Header from "../generalHeader";
import "./profilePage.css";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(0);
  const [ranking, setRanking] = useState(undefined);
  const [photo, setPhoto] = useState("");
  const location = useLocation();
  const { friend } = location.state || {};
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
      handleCount();
      handlePages();
      handleBioInit();
    } else {
      console.log("No user is logged in.");
      navigate("/login");
    }
  }, [currentUser]);

  useEffect(() => {
    handleRanking();
  }, [pages]);

  const handleBioInit = () => {
    const url = new URL("http://localhost:8000/getBio");
    url.searchParams.append("uid", friend.uid);

    const promise = fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBio(data);
      });
  };

  const handleRanking = () => {
    if (pages <= 500) {
      setRanking("noob");
    } else if (pages <= 1000) {
      setRanking("beginner");
    } else if (pages <= 5000) {
      setRanking("private");
    } else if (pages <= 10000) {
      setRanking("captain");
    } else if (pages <= 50000) {
      setRanking("master");
    } else if (pages <= 1000000) {
      setRanking("chief");
    } else if (pages <= 2000000) {
      setRanking("legend");
    } else {
      setRanking("genius");
    }
  };

  const handleCount = async () => {
    const url = new URL("http://localhost:8000/getLibCount");
    url.searchParams.append("uid", friend.uid);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setCount(data);
  };

  const handlePages = async () => {
    const url = new URL("http://localhost:8000/getLibPages");
    url.searchParams.append("uid", friend.uid);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setPages(data);
  };

  return (
    <div className="container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="profile-section">
            <div className="user-section">
              <div className="user-photo">
                <img src={friend.photo} alt="Avatar" className="avatar" />
              </div>
              <div className="user-details">
                <div className="user-name">User: {friend.userName}</div>
                <div className="books-read"># Books Read: {count}</div>
                <div className="pages-read">Total Pages Read: {pages}</div>
                <div className="user-rank">Rank: {ranking}</div>
                <button
                  className="back-button"
                  onClick={() => navigate(`/friends`)}
                >
                  Back
                </button>
              </div>
            </div>
            <div className="bio-section">
              <div className="user-bio">{bio}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
