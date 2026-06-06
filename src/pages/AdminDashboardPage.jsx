import { Link } from "react-router-dom";
import { CalendarDays, ClipboardList, DoorOpen, WalletCards } from "lucide-react";

const dashboardCards = [
  {
    title: "Calendar",
    description: "Kelola jadwal studio, slot booked, pending, dan maintenance.",
    href: "/admin/calendar",
    icon: CalendarDays,
  },
  {
    title: "Booking Request",
    description: "Nanti akan menampung request booking dari customer.",
    href: "#",
    icon: ClipboardList,
  },
  {
    title: "Room Management",
    description: "Nanti untuk mengatur room, fasilitas, harga, dan status room.",
    href: "#",
    icon: DoorOpen,
  },
  {
    title: "Payments",
    description: "Nanti untuk tracking DP, pembayaran, dan invoice.",
    href: "#",
    icon: WalletCards,
  },
];

export default function AdminDashboardPage() {
  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-bg" />

      <div className="admin-dashboard-container">
        <section className="admin-dashboard-hero">
          <p className="section-eyebrow">Admin dashboard</p>
          <h1>Pusat kontrol 37 Music Studio.</h1>
          <p>
            Dari sini admin bisa masuk ke kalender, booking request, room management,
            dan fitur operasional studio lainnya.
          </p>
        </section>

        <section className="admin-dashboard-grid">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            if (card.href === "#") {
              return (
                <article className="admin-dashboard-card is-disabled" key={card.title}>
                  <div className="admin-dashboard-card-icon">
                    <Icon size={22} />
                  </div>

                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <span>Coming soon</span>
                </article>
              );
            }

            return (
              <Link className="admin-dashboard-card" to={card.href} key={card.title}>
                <div className="admin-dashboard-card-icon">
                  <Icon size={22} />
                </div>

                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <span>Buka fitur</span>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
