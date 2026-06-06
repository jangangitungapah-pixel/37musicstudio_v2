import { Link } from "react-router-dom";
import { CalendarDays, DoorOpen, UsersRound, WalletCards } from "lucide-react";

const stats = [
  {
    label: "Booking Hari Ini",
    value: "8",
    meta: "3 pending confirmation",
  },
  {
    label: "Room Aktif",
    value: "3",
    meta: "Rehearsal, Recording, Content",
  },
  {
    label: "Customer",
    value: "124",
    meta: "Dummy data",
  },
  {
    label: "Revenue Bulan Ini",
    value: "Rp12,4jt",
    meta: "Preview module POS",
  },
];

const quickLinks = [
  {
    title: "Calendar",
    description: "Kelola slot booked, pending, maintenance, dan availability.",
    href: "/admin/calendar",
    icon: CalendarDays,
  },
  {
    title: "Customer",
    description: "Data customer, riwayat booking, dan kontak.",
    href: "/admin/customer",
    icon: UsersRound,
  },
  {
    title: "Inventory",
    description: "Pantau alat studio, kondisi gear, dan kebutuhan maintenance.",
    href: "/admin/inventory",
    icon: DoorOpen,
  },
  {
    title: "Billing/POS",
    description: "Transaksi, DP, pelunasan, dan invoice.",
    href: "/admin/billing",
    icon: WalletCards,
  },
];

export default function AdminDashboardPage() {
  return (
    <section className="admin-dashboard-module">
      <div className="admin-stat-grid">
        {stats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.meta}</p>
          </article>
        ))}
      </div>

      <div className="admin-module-section">
        <div className="admin-module-heading">
          <p className="section-eyebrow">Quick access</p>
          <h2>Operasional studio dalam satu shell.</h2>
          <p>
            Struktur admin sudah disiapkan modular. Tiap fitur tinggal kita isi bertahap
            tanpa bikin layout berubah-ubah lagi.
          </p>
        </div>

        <div className="admin-quick-grid">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link className="admin-quick-card" to={item.href} key={item.href}>
                <span>
                  <Icon size={22} />
                </span>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
