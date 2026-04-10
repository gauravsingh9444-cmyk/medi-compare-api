import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // 🔥 THIS LINE FIXES YOUR UI

import BookPage from "./components/pages/BookPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/book" element={<BookPage />} />
    </Routes>
  </BrowserRouter>
);
