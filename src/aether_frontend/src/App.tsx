import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ReduxProvider from "./providers/ReduxProvider";
import { AuthProvider } from "./contexts/AuthContext";

import Layout from "./pages/Layout";
// import HomePage from "./pages/HomePage";
import "./styles/tailwind.css";
import SessionProvider from "./providers/SessionProvider";
import SwapPage from "./pages/swap";

export default function App() {
    return (
        <ReduxProvider>
            <SessionProvider>
                <BrowserRouter>
                    <AuthProvider>
                            <Routes>
                                <Route path="*" element={<Layout />} />
                                {/* <Route path="/" element={<HomePage />} /> */}
                                <Route path="/swap" element={<SwapPage />} />
                            </Routes>
                    </AuthProvider>
                </BrowserRouter>
            </SessionProvider>
        </ReduxProvider>
    );
}