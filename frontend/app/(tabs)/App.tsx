import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BalaqaiPage from "./index";
import RegisterPage from "./register"; // Ensure this file exists
import LoginPage from "./login";
import GamesPage from "./games"; // Ensure this file exists
import AchievementsPage from "./achievements";
import Karaoke_choosePage from "./karaoke_choose";
import MathPage from './math';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/index" element={<BalaqaiPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/games/karaoke_choose" element={<Karaoke_choosePage />} />
                <Route path="/games/math" element={<MathPage />} />
            </Routes>
        </Router>
    );
};


export default App;
