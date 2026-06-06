import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "../pages/LandingPage.jsx";
import BookingPage from "../pages/BookingPage.jsx";
import PublicCalendarPage from "../pages/PublicCalendarPage.jsx";

import AdminLoginPage from "../pages/AdminLoginPage.jsx";
import AdminCalendarPage from "../pages/AdminCalendarPage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminCustomerPage from "../pages/admin/AdminCustomerPage.jsx";
import AdminInventoryPage from "../pages/admin/AdminInventoryPage.jsx";
import AdminBillingPage from "../pages/admin/AdminBillingPage.jsx";
import AdminBookkeepingPage from "../pages/admin/AdminBookkeepingPage.jsx";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage.jsx";

import AdminProtectedRoute from "../components/admin/AdminProtectedRoute.jsx";
import AdminShell from "../components/admin/AdminShell.jsx";

function withAdminShell(children, pageMeta) {
  return (
    <AdminProtectedRoute>
      <AdminShell title={pageMeta.title} description={pageMeta.description}>
        {children}
      </AdminShell>
    </AdminProtectedRoute>
  );
}

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
          element={withAdminShell(<AdminDashboardPage />, {
            title: "Dashboard",
            description: "Ringkasan operasional 37 Music Studio.",
          })}
        />

        <Route
          path="/admin/calendar"
          element={withAdminShell(<AdminCalendarPage />, {
            title: "Calendar",
            description: "Kelola jadwal room, availability, dan maintenance.",
          })}
        />

        <Route
          path="/admin/customer"
          element={withAdminShell(<AdminCustomerPage />, {
            title: "Customer",
            description: "Kelola data customer dan riwayat booking.",
          })}
        />

        <Route
          path="/admin/inventory"
          element={withAdminShell(<AdminInventoryPage />, {
            title: "Inventory",
            description: "Pantau equipment, gear, dan maintenance studio.",
          })}
        />

        <Route
          path="/admin/billing"
          element={withAdminShell(<AdminBillingPage />, {
            title: "Billing/POS",
            description: "Kelola transaksi, DP, pelunasan, dan invoice.",
          })}
        />

        <Route
          path="/admin/bookkeeping"
          element={withAdminShell(<AdminBookkeepingPage />, {
            title: "Pembukuan",
            description: "Pantau pemasukan, pengeluaran, dan laporan studio.",
          })}
        />

        <Route
          path="/admin/settings"
          element={withAdminShell(<AdminSettingsPage />, {
            title: "Settings",
            description: "Atur profile studio, operasional, dan akses admin.",
          })}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
