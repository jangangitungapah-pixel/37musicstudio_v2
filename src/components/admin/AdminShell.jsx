import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  Settings,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { logoutAdmin } from "../../utils/adminAuth.js";

const ADMIN_SIDEBAR_KEY = "37musicstudio_admin_sidebar_collapsed_v1";

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Calendar",
    href: "/admin/calendar",
    icon: CalendarDays,
  },
  {
    label: "Customer",
    href: "/admin/customer",
    icon: UsersRound,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Package,
  },
  {
    label: "Billing/POS",
    href: "/admin/billing",
    icon: ReceiptText,
  },
  {
    label: "Pembukuan",
    href: "/admin/bookkeeping",
    icon: BookOpen,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminShell({ children, title = "Admin Panel", description = "37 Music Studio operations dashboard." }) {
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(ADMIN_SIDEBAR_KEY) === "true";
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const shellClassName = useMemo(() => {
    return [
      "admin-shell",
      isCollapsed ? "is-collapsed" : "",
      isMobileOpen ? "is-mobile-open" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }, [isCollapsed, isMobileOpen]);

  useEffect(() => {
    window.localStorage.setItem(ADMIN_SIDEBAR_KEY, String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className={shellClassName}>
      <div
        className="admin-shell-backdrop"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-mark">37</span>

          <div className="admin-brand-copy">
            <strong>37 Music</strong>
            <small>Admin Console</small>
          </div>

          <button
            type="button"
            className="admin-mobile-close"
            aria-label="Tutup menu admin"
            onClick={closeMobileMenu}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                to={item.href}
                end={item.end}
                key={item.href}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "is-active" : ""}`
                }
              >
                <span className="admin-nav-icon">
                  <Icon size={19} />
                </span>

                <span className="admin-nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-collapse-button"
            onClick={() => setIsCollapsed((current) => !current)}
          >
            <ChevronLeft size={18} />
            <span>Collapse</span>
          </button>

          <button type="button" className="admin-shell-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-main-topbar">
          <button
            type="button"
            className="admin-mobile-menu"
            aria-label="Buka menu admin"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="admin-topbar-copy">
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <button type="button" className="admin-topbar-logout" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
