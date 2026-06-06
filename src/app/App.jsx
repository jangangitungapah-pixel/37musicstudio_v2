import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import BookingPage from "../pages/BookingPage.jsx";
import PublicCalendarPage from "../pages/PublicCalendarPage.jsx";
import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import AdminCalendarPage from "../pages/AdminCalendarPage.jsx";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/calendar" element={<PublicCalendarPage />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/calendar"
          element={
            <AdminProtectedRoute>
              <AdminCalendarPage />
            </AdminProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
