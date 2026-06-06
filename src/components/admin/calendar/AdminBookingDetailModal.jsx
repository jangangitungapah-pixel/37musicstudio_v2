import { Pencil, X } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getStatusLabel(status) {
  const map = {
    pending: "Pending",
    booked: "Booked",
    maintenance: "Maintenance",
    blocked: "Blocked",
    cancelled: "Cancelled",
  };

  return map[status] || status || "-";
}

function getPaymentLabel(status) {
  const map = {
    unpaid: "Belum Bayar",
    down_payment: "DP",
    paid: "Lunas",
    refund: "Refund",
  };

  return map[status] || status || "-";
}

export default function AdminBookingDetailModal({ event, onClose, onEdit, onQuickUpdate }) {
  const isBooking = event?.type === "booking" || !event?.type;

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-booking-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Detail booking"
        onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}
      >
        <header className="admin-booking-detail-header">
          <div>
            <span className={`admin-booking-detail-status status-${event?.status}`}>
              {getStatusLabel(event?.status)}
            </span>

            <h2>{event?.label || event?.packageName || "Detail Booking"}</h2>

            <p>
              {event?.date || "-"} · {event?.time || "-"}
            </p>
          </div>

          <button type="button" aria-label="Tutup detail booking" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <div className="admin-booking-detail-body">
          <div className="admin-booking-detail-summary">
            <div>
              <span>Room</span>
              <strong>{event?.room || "-"}</strong>
            </div>

            <div>
              <span>Package</span>
              <strong>{event?.packageName || event?.label || "-"}</strong>
            </div>

            <div>
              <span>Total Price</span>
              <strong>{formatCurrency(event?.price)}</strong>
            </div>

            <div>
              <span>Payment</span>
              <strong>{getPaymentLabel(event?.paymentStatus)}</strong>
            </div>
          </div>

          {isBooking && (
            <div className="admin-booking-detail-section">
              <p>Customer</p>

              <div className="admin-booking-detail-grid">
                <div>
                  <span>Nama Customer</span>
                  <strong>{event?.customerName || "-"}</strong>
                </div>

                <div>
                  <span>WhatsApp</span>
                  <strong>{event?.customerPhone || "-"}</strong>
                </div>

                <div>
                  <span>Jumlah Orang</span>
                  <strong>{event?.peopleCount || "-"} orang</strong>
                </div>

                <div>
                  <span>Kategori Sesi</span>
                  <strong>{event?.sessionCategory || "-"}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="admin-booking-detail-section">
            <p>Payment Detail</p>

            <div className="admin-booking-detail-grid">
              <div>
                <span>Harga</span>
                <strong>{formatCurrency(event?.price)}</strong>
              </div>

              <div>
                <span>DP</span>
                <strong>{formatCurrency(event?.deposit)}</strong>
              </div>

              <div>
                <span>Sisa Bayar</span>
                <strong>{formatCurrency(Number(event?.price || 0) - Number(event?.deposit || 0))}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{getPaymentLabel(event?.paymentStatus)}</strong>
              </div>
            </div>
          </div>

          <div className="admin-booking-detail-section">
            <p>Notes</p>

            <div className="admin-booking-detail-notes">
              <div>
                <span>Catatan Customer</span>
                <strong>{event?.customerNote || "-"}</strong>
              </div>

              <div>
                <span>Catatan Internal</span>
                <strong>{event?.adminNote || "-"}</strong>
              </div>
            </div>
          </div>
        </div>

        <footer className="admin-booking-detail-actions">
          <button type="button" className="admin-modal-cancel" onClick={onClose}>
            Tutup
          </button>

          <button type="button" className="admin-modal-submit" onClick={onEdit}>
            <Pencil size={17} />
            Edit Booking
          </button>
        </footer>
      </section>
    </div>
  );
}