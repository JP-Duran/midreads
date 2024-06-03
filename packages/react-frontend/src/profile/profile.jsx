import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar';
import Header from '../generalHeader';
import './profilePage.css';
import { useAuth } from '../Auth';
import { useNavigate } from 'react-router-dom';
import { auth, upload } from '../firebase';

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [pages, setPages] = useState(0);
    const [ranking, setRanking] = useState(undefined);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [photoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (currentUser) {
            console.log(currentUser);
            handleCount();
            handlePages();
        } else {
            console.log('No user is logged in.');
            navigate("/login");
        }
    }, [currentUser]);

    useEffect(() => {
        handleRanking();
    }, [pages]);

    const handleRanking = () => {
        if (pages <= 500) {
            setRanking("noob")
        } else if (pages <= 1000) {
            setRanking("beginner")
        } else if (pages <= 5000) {
            setRanking("private")
        } else if (pages <= 10000) {
            setRanking("captain")
        } else if (pages <= 50000) {
            setRanking("master")
        } else if (pages <= 1000000) {
            setRanking("chief")
        } else if (pages <= 2000000) {
            setRanking("legend")
        } else {
            setRanking("genius")
        }
    }

    const onLogoutClick = async () => {
        auth.signOut().then(() => {
            console.log('User signed out successfully.');
            navigate("/login");
        }).catch((error) => {
            console.error('Error signing out: ', error);
        });
    };

    const onEditClick = () => {
        setEditing(true);
    };

    const handleCount = async () => {
        const url = new URL("http://localhost:8000/getLibCount");
        url.searchParams.append("uid", currentUser.uid);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
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
            }
        });

        const data = await response.json();
        setPages(data);
    };

    function handleChange(e) {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0])
        }
    }

    function handleClick() {
        upload(photo, currentUser, setLoading);
    }

    useEffect(() => {
        if (currentUser?.photoURL) {
            setPhotoURL(currentUser.photoURL);
        }
    }, [currentUser])

    return (
        <div className="container">
            <Header />
            <div className="content-wrapper">
                <Sidebar />
                <div className="main-content">
                    <div className="profile-section">
                        <div className="user-section">
                            <input type="file" onChange={handleChange} />
                            <button disabled={loading || !photo} onClick={handleClick}>Upload</button>
                            <img src={photoURL} alt="Avatar" className="avatar" />
                            <div className="user-details">
                                <div className="user-name">User: {currentUser.email}</div>
                                <div className="books-read"># Books Read: {count}</div>
                                <div className="pages-read">Total Pages Read: {pages}</div>
                                <div className="user-rank">Rank: {ranking}</div>
                                <UploadPhoto />
                                <button className="edit-button" onClick={onEditClick}>Edit</button>
                                <button className="logout-button" onClick={onLogoutClick}>Logout</button>
                                <button className="delete-account-button">Delete my account</button>
                            </div>
                        </div>
                        <div className="bio-section">
                            <div className="user-bio" style={{ height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <textarea
                                    id="bioInput"
                                    placeholder="Enter your bio here"
                                    style={{ width: '80%', height: '100px', padding: '10px', resize: 'none' }}
                                //value={bio}
                                //onChange={handleBioChange}
                                />
                                <button
                                    id="submitButton"
                                    style={{ marginTop: '10px', padding: '10px 20px' }}
                                //onClick={handleBioSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                            <div className="top-rated-books" style={{ height: '200px', backgroundColor: '#d9d9d9', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Top Rated Books</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
