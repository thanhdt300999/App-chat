import React from "react";
import { Link, Route, Router, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./Login.css";
import { AiOutlineMail, AiFillLock, AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
const LoginScreen = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    localStorage.setItem("accessToken", true);
    navigate("/dashboard");
  };
  return (
    <div className="login_container">
      <Router>
        <Route
          path="/login"
          element={<LoginForm handleLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<SignupForm />}
        />
      </Router>
    </div>
  );
};

export default LoginScreen;
