import React, { useState, useEffect } from "react";

const Sidebar = () => {
  const [activePath, setActivePath] = useState(window.location.pathname);

  useEffect(() => {
    // Update the active path when the component mounts
    setActivePath(window.location.pathname);

    // Optional: Update the active path on window history change
    const handleLocationChange = () => {
      setActivePath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  const links = [
    { path: "/home", label: "Home" },
    { path: "/profile", label: "My Profile" },
    { path: "/library", label: "Library" },
    { path: "/read-later", label: "Read Later" },
    { path: "/friends", label: "Friends" },
  ];

  return (
    <div className="sidebar">
      {links.map((link) => (
        <a
          href={link.path}
          className={link.path === activePath ? "active" : ""}
          key={link.label}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
