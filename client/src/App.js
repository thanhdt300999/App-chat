import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginScreen from "./components/Auth/Login";
import './App.css'
import User from "./components/User";
import { PrivateRoute } from "./route/PrivateRoute";
import DashBoard from "./components/Dashboard/DashBoard";
const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashBoard />
          </PrivateRoute>
        }
      />

      <Route
        path="/user"
        element={
          <PrivateRoute>
            <User />
          </PrivateRoute>
        }
      />
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
};

export default App;
