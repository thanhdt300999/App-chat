import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./modules/Layout/components/Layout";
import LoginScreen from "./modules/Auth/Login";
import './App.css'
import User from "./modules/User";
import { PrivateRoute } from "./route/PrivateRoute";
import DashBoard from "./modules/Dashboard/DashBoard";
const App = () => {
  return (
    <Routes>
      <Route
        path="/*"
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
      <Route path="/auth/*" element={<LoginScreen />} />
    </Routes>
  );
};

export default App;
