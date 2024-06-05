import React from "react";

const PaginationButton = ({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default PaginationButton;
