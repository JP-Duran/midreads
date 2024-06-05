import React, { useEffect, useState } from "react";
import "./friendsTable.css";
import { useAuth } from "../Auth";
import { useNavigate } from "react-router-dom";

const FriendsTable = ({ friendIds }) => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const friendData = await fetchFriendsDetails(currentUser.uid);
      const friendsWithPages = await initializePages(friendData);
      setFriends(friendsWithPages);
    };

    fetchData();
  }, [currentUser.uid, friendIds]);

  async function fetchFriendsDetails(user) {
    console.log("Searching", user);
    const url = new URL("http://localhost:8000/getFriendData");
    url.searchParams.append("user", user);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  }

  async function initializePages(friendData) {
    const friendsWithPages = await Promise.all(
      friendData.map(async (friend) => {
        const pageCount = await handlePages(friend);
        return { ...friend, pageCount };
      })
    );
    return friendsWithPages;
  }

  async function handlePages(friend) {
    console.log("FRIEND: ", friend.uid);
    const url = new URL("http://localhost:8000/getLibPages");
    url.searchParams.append("uid", friend.uid);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const text = await response.text();
    return parseInt(text);
  }

  return (
    <table className="friends-table">
      <colgroup>
        <col className="profile-pic" />
        <col className="name" />
        <col className="status" />
        <col className="visit-profile" />
      </colgroup>
      <thead>
        <tr>
          <th>Profile Pic</th>
          <th>Name</th>
          <th>Pages Read</th>
          <th>Visit Profile</th>
        </tr>
      </thead>
      <tbody>
        {friends.map((friend) => (
          <tr key={friend._id}>
            <img src={friend.photo} alt="" className="avatar" />
            <td>{friend.userName}</td>
            <td>{friend.pageCount}</td>
            <td>
              <button
                onClick={() =>
                  navigate(`/profile/${friend._id}`, { state: { friend } })
                }
              >
                Visit Profile
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FriendsTable;
