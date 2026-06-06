import { useMemo, useState } from "react";
import {
  CalendarDays,
  MessageCircle,
  Search,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import { buildCustomerSummaries, backfillCustomersFromCalendar } from "../../utils/customerSync.js";
import { normalizeCustomerPhone } from "../../utils/customerStorage.js";

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatPhone(phone) {
  const raw = String(phone || "").trim();

  if (!raw) {
    return "-";
  }

  return raw;
}

function buildWhatsAppUrl(phone, message) {
  const normalizedPhone = normalizeCustomerPhone(phone);

  if (!normalizedPhone) {
    return "";
  }

  return "https://wa.me/" + normalizedPhone + "?text=" + encodeURIComponent(message);
}

function getPaymentStatusLabel(summary) {
  if (summary.totalUnpaid > 0) {
    return "Ada Tagihan";
  }

  if (summary.totalSpent > 0) {
    return "Lunas";
  }

  return "Belum Ada Transaksi";
}

function buildCustomerFollowUpMessage(summary) {
  const name = summary.customer?.name || "Kak";

  if (summary.totalUnpaid > 0) {
    return [
      "Halo " + name + ", kami informasikan masih ada sisa pembayaran booking 37 Music Studio.",
      "",
      "Total transaksi: " + formatCurrency(summary.totalSpent),
      "Sudah dibayar: " + formatCurrency(summary.totalPaid),
      "Sisa pembayaran: " + formatCurrency(summary.totalUnpaid),
      "",
      "Mohon konfirmasinya ya. Terima kasih."
    ].join("\n");
  }

  return [
    "Halo " + name + ", terima kasih sudah booking di 37 Music Studio.",
    "",
    "Kalau ingin booking jadwal berikutnya, silakan kabari kami ya.",
    "Terima kasih."
  ].join("\n");
}

function CustomerDetailModal({ summary, onClose }) {
  if (!summary) {
    return null;
  }

  const customer = summary.customer;
  const waUrl = buildWhatsAppUrl(customer.phone, buildCustomerFollowUpMessage(summary));

  return (
    <div className="admin-customer-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-customer-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Detail customer"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="admin-customer-detail-header">
          <div>
            <span>Customer Detail</span>
            <h2>{customer.name || "Tanpa Nama"}</h2>
            <p>{formatPhone(customer.phone)}</p>
          </div>

          <button type="button" aria-label="Tutup detail customer" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="admin-customer-detail-stats">
          <div>
            <span>Total Booking</span>
            <strong>{summary.totalBookings}</strong>
          </div>

          <div>
            <span>Total Omzet</span>
            <strong>{formatCurrency(summary.totalSpent)}</strong>
          </div>

          <div>
            <span>Sudah Bayar</span>
            <strong>{formatCurrency(summary.totalPaid)}</strong>
          </div>

          <div>
            <span>Sisa Tagihan</span>
            <strong>{formatCurrency(summary.totalUnpaid)}</strong>
          </div>
        </div>

        <div className="admin-customer-detail-actions">
          <a className={!waUrl ? "is-disabled" : ""} href={waUrl || undefined} target="_blank" rel="noreferrer">
            <MessageCircle size={16} />
            Kirim WhatsApp
          </a>
        </div>

        <section className="admin-customer-history">
          <div className="admin-customer-history-head">
            <span>Riwayat Booking</span>
            <strong>{summary.bookings.length} jadwal</strong>
          </div>

          {summary.bookings.length === 0 ? (
            <div className="admin-customer-empty-history">
              Belum ada riwayat booking.
            </div>
          ) : (
            <div className="admin-customer-history-list">
              {summary.bookings.map((booking) => (
                <article key={booking.id}>
                  <div>
                    <strong>{booking.packageName || booking.label || "Booking Studio"}</strong>
                    <span>{booking.date || "-"} - {booking.time || booking.startTime + " - " + booking.endTime}</span>
                  </div>

                  <div>
                    <span>{booking.room || "-"}</span>
                    <strong>{formatCurrency(booking.price)}</strong>
                    <small>{booking.paymentStatus || "unpaid"}</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default function AdminCustomerPage() {
  const [snapshot, setSnapshot] = useState(() => backfillCustomersFromCalendar());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedSummary, setSelectedSummary] = useState(null);

  const summaries = useMemo(() => {
    return buildCustomerSummaries(snapshot.customers, snapshot.events)
      .sort((first, second) => {
        return String(second.lastBookingAt || "").localeCompare(String(first.lastBookingAt || ""));
      });
  }, [snapshot]);

  const stats = useMemo(() => {
    return summaries.reduce(
      (acc, summary) => {
        acc.totalCustomers += 1;
        acc.totalBookings += summary.totalBookings;
        acc.totalSpent += summary.totalSpent;
        acc.totalPaid += summary.totalPaid;
        acc.totalUnpaid += summary.totalUnpaid;
        return acc;
      },
      {
        totalCustomers: 0,
        totalBookings: 0,
        totalSpent: 0,
        totalPaid: 0,
        totalUnpaid: 0,
      }
    );
  }, [summaries]);

  const filteredSummaries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return summaries.filter((summary) => {
      const customer = summary.customer;
      const haystack = [
        customer.name,
        customer.phone,
        customer.normalizedPhone,
        summary.lastRoom,
        summary.lastPackage,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);

      const matchesFilter =
        filter === "all" ||
        (filter === "unpaid" && summary.totalUnpaid > 0) ||
        (filter === "paid" && summary.totalSpent > 0 && summary.totalUnpaid === 0) ||
        (filter === "repeat" && summary.totalBookings > 1);

      return matchesQuery && matchesFilter;
    });
  }, [summaries, query, filter]);

  function handleRefreshCustomerData() {
    setSnapshot(backfillCustomersFromCalendar());
  }

  return (
    <section className="admin-customer-page">
      <div className="admin-customer-hero">
        <div>
          <p className="section-eyebrow">Customer CRM</p>
          <h2>Database Customer</h2>
          <span>Data customer otomatis tersinkron dari booking calendar.</span>
        </div>

        <button type="button" onClick={handleRefreshCustomerData}>
          Sync Calendar
        </button>
      </div>

      <div className="admin-customer-stat-grid">
        <article>
          <span>Total Customer</span>
          <strong>{stats.totalCustomers}</strong>
          <small>Kontak tersimpan</small>
        </article>

        <article>
          <span>Total Booking</span>
          <strong>{stats.totalBookings}</strong>
          <small>Semua riwayat</small>
        </article>

        <article>
          <span>Total Omzet</span>
          <strong>{formatCurrency(stats.totalSpent)}</strong>
          <small>Booking aktif</small>
        </article>

        <article>
          <span>Sisa Tagihan</span>
          <strong>{formatCurrency(stats.totalUnpaid)}</strong>
          <small>Perlu follow-up</small>
        </article>
      </div>

      <div className="admin-customer-toolbar">
        <label className="admin-customer-search">
          <Search size={16} />
          <input
            value={query}
            placeholder="Cari nama, WhatsApp, room, paket..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <div className="admin-customer-filter">
          {[
            { value: "all", label: "Semua" },
            { value: "unpaid", label: "Ada Tagihan" },
            { value: "paid", label: "Lunas" },
            { value: "repeat", label: "Repeat" },
          ].map((option) => (
            <button
              type="button"
              key={option.value}
              className={filter === option.value ? "is-active" : ""}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredSummaries.length === 0 ? (
        <div className="admin-customer-empty-state">
          <UserRound size={24} />
          <strong>Belum ada customer</strong>
          <p>Buat booking dari halaman Calendar, lalu customer akan otomatis muncul di sini.</p>
        </div>
      ) : (
        <div className="admin-customer-list">
          {filteredSummaries.map((summary) => {
            const customer = summary.customer;
            const waUrl = buildWhatsAppUrl(customer.phone, buildCustomerFollowUpMessage(summary));

            return (
              <article className="admin-customer-card" key={customer.id}>
                <div className="admin-customer-avatar">
                  {(customer.name || "?").slice(0, 1).toUpperCase()}
                </div>

                <div className="admin-customer-main">
                  <div className="admin-customer-name-row">
                    <strong>{customer.name || "Tanpa Nama"}</strong>
                    <span className={summary.totalUnpaid > 0 ? "is-due" : "is-paid"}>
                      {getPaymentStatusLabel(summary)}
                    </span>
                  </div>

                  <p>{formatPhone(customer.phone)}</p>

                  <div className="admin-customer-meta">
                    <span>
                      <CalendarDays size={13} />
                      {summary.totalBookings} booking
                    </span>

                    <span>
                      <WalletCards size={13} />
                      {formatCurrency(summary.totalSpent)}
                    </span>

                    <span>
                      Sisa {formatCurrency(summary.totalUnpaid)}
                    </span>
                  </div>

                  <small>
                    Terakhir: {summary.lastBookingAt || "-"} / {summary.lastRoom || "-"} / {summary.lastPackage || "-"}
                  </small>
                </div>

                <div className="admin-customer-actions">
                  <button type="button" onClick={() => setSelectedSummary(summary)}>
                    Detail
                  </button>

                  <a className={!waUrl ? "is-disabled" : ""} href={waUrl || undefined} target="_blank" rel="noreferrer">
                    <MessageCircle size={15} />
                    WA
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedSummary && (
        <CustomerDetailModal summary={selectedSummary} onClose={() => setSelectedSummary(null)} />
      )}
    </section>
  );
}
