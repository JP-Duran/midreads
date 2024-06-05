import React, { useState } from "react";
import { useAuth } from "../Auth";

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useAuth();

  function addFriend() {
    const friendData = {
      friend: searchTerm,
      user: currentUser.uid,
    };

    console.log(friendData);
    const url = new URL("http://localhost:8000/addFriend");

    const promise = fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(friendData),
    });

    promise.then((result) => {
      if (result.status === 406) {
        alert("Error adding friend");
      } else {
        alert("Friend successully added");
      }
    });
  }

  return (
    <div className="header">
      <div className="logo">MidReads</div>
      <input
        type="text"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ color: "black" }}
      />
      <button onClick={addFriend}>Add friend</button>
    </div>
  );
};

export default Header;
