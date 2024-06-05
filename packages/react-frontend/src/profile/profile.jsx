import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar";
import Header from "../generalHeader";
import "./profilePage.css";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";
import { auth, upload } from "../firebase";

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(0);
  const [ranking, setRanking] = useState(undefined);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
  );
  const [editing, setEditing] = useState(false);
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
    url.searchParams.append("uid", currentUser.uid);

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

  const onLogoutClick = async () => {
    auth
      .signOut()
      .then(() => {
        console.log("User signed out successfully.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  const onEditClick = () => {
    if (editing) {
      const promise = fetch("http://localhost:8000/updateBio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: currentUser.uid, bio: bio }),
      }).then(setEditing(!editing));
    } else {
      setEditing(!editing);
    }
  };

  const handleCount = async () => {
    const url = new URL("http://localhost:8000/getLibCount");
    url.searchParams.append("uid", currentUser.uid);

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
    url.searchParams.append("uid", currentUser.uid);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setPages(data);
  };

  function handleImageChange(e) {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
      console.log("USERPHOTO", currentUser.photoURL);
      const promise = fetch("http://localhost:8000/updatePhoto", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: currentUser.uid,
          url: currentUser.photoURL,
        }),
      }).then(console.log("photo updated in database"));
    }
  }

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleImageClick = async () => {
    upload(photo, currentUser, setLoading);
    const newPhotoURL = await upload(photo, currentUser, setLoading);
    if (newPhotoURL) {
      setPhotoURL(newPhotoURL);
    }
  };

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  return (
    <div className="container">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <div className="main-content">
          <div className="profile-section">
            <div className="user-section">
              {editing ? (
                <div>
                  <input type="file" onChange={handleImageChange} />
                  <button
                    disabled={loading || !photo}
                    onClick={handleImageClick}
                  >
                    Upload
                  </button>
                </div>
              ) : (
                <div></div>
              )}
              <img src={photoURL} alt="Avatar" className="avatar" />
              <div className="user-details">
                <div className="user-name">User: {currentUser.email}</div>
                <div className="books-read"># Books Read: {count}</div>
                <div className="pages-read">Total Pages Read: {pages}</div>
                <div className="user-rank">Rank: {ranking}</div>
                <button className="edit-button" onClick={onEditClick}>
                  {editing ? "Finish Editing" : "Edit"}
                </button>
                <button className="logout-button" onClick={onLogoutClick}>
                  Logout
                </button>
                <button className="delete-account-button">
                  Delete my account
                </button>
              </div>
            </div>
            <div className="bio-section">
              {editing ? (
                <div
                  className="user-bio"
                  style={{
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <textarea
                    id="bioInput"
                    placeholder="Enter your bio here"
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "10px",
                      resize: "none",
                      fontFamily: "Times New Roman",
                      fontSize: "16px",
                    }}
                    value={bio}
                    onChange={handleBioChange}
                  />
                </div>
              ) : (
                <div
                  className="top-rated-books"
                  style={{
                    height: "200px",
                    backgroundColor: "#d9d9d9",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    padding: "12px",
                  }}
                >
                  {bio}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
