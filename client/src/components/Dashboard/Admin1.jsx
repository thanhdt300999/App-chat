import React from "react";
import { useNavigate } from "react-router-dom";
const Admin = () => {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("accessToken", false);
    navigate("/login");
  };
  return (
    <>
      <div>ADMIN</div>
      <button onClick={handleSignOut}>Logout</button>
    </>
  );
};

export default Admin;
