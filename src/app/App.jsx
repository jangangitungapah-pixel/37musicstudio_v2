import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import BookingPage from "../pages/BookingPage.jsx";
import PublicCalendarPage from "../pages/PublicCalendarPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/calendar" element={<PublicCalendarPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
