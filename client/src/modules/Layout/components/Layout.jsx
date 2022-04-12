import React from "react";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("accessToken", false);
    navigate("/login");
  };
  return (
    <>
      <div>Layout</div>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  );
};

export default Layout;
