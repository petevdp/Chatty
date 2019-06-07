import React, { Component } from "react";

const NavBar = ({ userList }) => {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">
        Chatty
      </a>
      <span className="navbar__num-of-users">
        {userList.length} users online
      </span>
    </nav>
  );
};

export default NavBar;
