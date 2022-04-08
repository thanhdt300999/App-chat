import React from "react";
import { Navigate } from "react-router-dom";
export const PrivateRoute = ({ children }) => {
    console.log(children)
  if (!localStorage.getItem("accessToken")) {
    return <Navigate to="/login" />;
  }

  return children;
};
