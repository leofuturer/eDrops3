import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./components/Layout";
import Index from "./pages/home";
import Projects from "./pages/projects";
import Forum from "./pages/forum";
import Login from "./pages/login";
import Project from "./components/project/Project";
import Profile from "./pages/profile";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/home" element={<Index />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<Project />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="forum" element={<Forum />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
