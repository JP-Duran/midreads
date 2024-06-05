import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./homepage/home";
import Library from "./library/library";
import Profile from "./profile/profile";
import Login from "./login/login";
import ReadLater from "./read-later/readLater";
import Friends from "./friends/friends";
import CreateAccount from "./login/createaccount";
import FriendProfile from "./visitProfile/profile";
import AuthProvider from "./Auth";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/login"
              element={
                <Login setLoggedIn={setLoggedIn} setUsername={setUsername} />
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<FriendProfile />} />
            <Route path="/library" element={<Library />} />
            <Route path="/read-later" element={<ReadLater />} />
            <Route path="/friends" element={<Friends />} />
            <Route
              path="/createaccount"
              element={<CreateAccount loggedIn={loggedIn} />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
