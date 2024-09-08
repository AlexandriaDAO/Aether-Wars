import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ReduxProvider from "./providers/ReduxProvider";

import HomePage from "./pages/HomePage";
import "./styles/tailwind.css";
import SessionProvider from "./providers/SessionProvider";
import SwapPage from "./pages/swap";
export default function App() {
    return (
        <ReduxProvider>
            <SessionProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/swap" element={<SwapPage />} />
                    </Routes>
                </BrowserRouter>
            </SessionProvider>
        </ReduxProvider>
    );
}