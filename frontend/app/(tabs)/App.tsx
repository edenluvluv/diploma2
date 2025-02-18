import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BalaqaiPage from "./index";
import RegisterPage from "./register"; // Ensure this file exists
import LoginPage from "./login";
import GamesPage from "./games"; // Ensure this file exists

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/index" element={<BalaqaiPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/games" element={<GamesPage />} />
            </Routes>
        </Router>
    );
};


export default App;
