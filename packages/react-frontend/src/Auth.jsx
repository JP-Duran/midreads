import React, { useContext, useState, useEffect } from "react";
import { auth } from "./firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [waiting, waitForUserData] = useState(true);

  useEffect(() => {
    const userData = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      waitForUserData(false);
    });

    return userData;
  }, []);

  // can we just sleep or set a timer instead of doing this??
  if (waiting) {
    return <div>Waiting for user info</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
