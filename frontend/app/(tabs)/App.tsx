import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BalaqaiPage from "./index";
import RegisterPage from "./register"; // Ensure this file exists
import LoginPage from "./login";
import GamesPage from "./games"; // Ensure this file exists
import AchievementsPage from "./achievements";
import MathPage from './math';
import AdminPage from './admin';
import NextPage from "./next";
import LabyrinthPage from './maze';
import PairPage from './pair';
import DiaryPage from './diary';
import KaraokePage from './karaoke';
import MemoryPage from './memory';
import LettersPage from './letters';
import LettersPracticePage from './letterspractice';



const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/index" element={<BalaqaiPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/math" element={<MathPage />} />
                <Route path=".admin" element={<AdminPage />} />
                <Route path="/next" element={<NextPage />} />
                <Route path="/maze" element={<LabyrinthPage />} />
                <Route path="/pair" element={<PairPage />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/karaoke" element={<KaraokePage />} />
                <Route path="/memory" element={<MemoryPage />} />
                <Route path="/letters" element={<LettersPage />} />
                <Route path="/letterspractice" element={<LettersPracticePage />} />
            </Routes>
        </Router>
    );
};


export default App;
