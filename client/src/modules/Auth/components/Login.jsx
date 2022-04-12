import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import './Login.css'

import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
const LoginScreen = () => {
  return (
    <div className="login_container">
      <Routes>
        <Route
          path="/login"
          element={<LoginForm/>}
        />
        <Route
          path="/signup"
          element={<SignupForm />}
        />
      </Routes>
    </div>
  );
};

export default LoginScreen;
