import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import Word from "./Words";
import Sentence from "./Sentences";
import Article from "./Articles";
import Level from "./levels";
import Tenses from "./Tenses";
import Chatbot from "./Chatbot";
import Settings from "../Widgets/Settings";
import TotalScore from "../Widgets/TotalScore";
import TodoList from "../Widgets/TodoList";
import ReadNews from "../Widgets/ReadNews";
import Badges from "../Widgets/Badges";
import Recommended from "../Widgets/Recommended";

import LeftNavigationPanel from "../Panels/LeftNavigationPanel";
import { FontSizeProvider } from "../context/FontSizeContext";
import Login from "./Login"; // New Login Component
import Register from "./Register";
import ForgotPassword from "./Forgot_password";
import "./App.css";

// Mock function to check authentication
const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

const App: React.FC = () => {
  const isLoggedIn = isAuthenticated();

  return (
    <FontSizeProvider>
      <Router>
        <div className="App">
          {/* Render only the login page if the user is not logged in */}
          {!isLoggedIn ? (
            <Routes>
              <Route path="*" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          ) : (
            <>
              {/* Main App Content */}
              <h1>Welcome to the Spelling Assignment</h1>
              <div className="main-layout">
                <LeftNavigationPanel /> {/* Left Navigation Panel */}
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/words" element={<Word />} />
                    <Route path="/sentences" element={<Sentence />} />
                    <Route path="/articles" element={<Article />} />
                    <Route path="/tenses" element={<Tenses />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/totalScore" element={<TotalScore />} />
                    <Route path="/:type/level/:levelIndex" element={<Level />} />
                    <Route path="/TodoList" element={<TodoList />} />
                    <Route path="/readnews" element={<ReadNews />} />
                    <Route path="/badges" element={<Badges />} />
                    <Route path="/recommended" element={<Recommended />} />
                  </Routes>
                </div>
              </div>
              <Chatbot /> {/* Chatbot */}
            </>
          )}
        </div>
      </Router>
    </FontSizeProvider>
  );
};

export default App;