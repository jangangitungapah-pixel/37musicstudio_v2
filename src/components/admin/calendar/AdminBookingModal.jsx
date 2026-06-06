import { useEffect, useMemo, useState } from "react";
import { Trash2, X } from "lucide-react";
import { publicCalendarRooms } from "../../../data/publicCalendar.js";
import { getPriceSettings } from "../../../utils/priceSettingsStorage.js";

const scheduleTypes = [
  { value: "booking", label: "Booking Customer" },
  { value: "maintenance", label: "Maintenance" },
  { value: "block", label: "Block Room" },
];

const statusByType = {
  booking: [
    { value: "pending", label: "Pending" },
    { value: "booked", label: "Booked" },
  ],
  maintenance: [{ value: "maintenance", label: "Maintenance" }],
  block: [{ value: "blocked", label: "Blocked" }],
};

const sessionCategories = [
  "Latihan Band",
  "Recording",
  "Podcast / Content",
  "Vocal Take",
  "Other",
];

const fallbackPackageOptions = [
  "Regular Session",
  "Recording Basic",
  "Band Package",
  "Custom",
];

const paymentStatuses = [
  { value: "unpaid", label: "Belum Bayar" },
  { value: "down_payment", label: "DP" },
  { value: "paid", label: "Lunas" },
];

const timeOptions = Array.from({ length: 14 }, (_, index) => {
  const hour = 10 + index;
  return `${String(hour).padStart(2, "0")}.00`;
});

function getTimeNumber(time) {
  return Number.parseInt(String(time || "10.00").split(".")[0], 10);
}

function getNextHourLabel(startTime) {
  const hour = getTimeNumber(startTime);
  return `${String(Math.min(hour + 1, 23)).padStart(2, "0")}.00`;
}

function addHoursLabel(startTime, durationHours) {
  const startHour = getTimeNumber(startTime);
  const endHour = Math.min(startHour + Number(durationHours || 1), 23);
  return `${String(endHour).padStart(2, "0")}.00`;
}

function cleanMoney(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function parseEventTime(time, fallbackStart = "10.00") {
  if (!time || typeof time !== "string") {
    return {
      startTime: fallbackStart,
      endTime: getNextHourLabel(fallbackStart),
    };
  }

  const parts = time.split("-").map((item) => item.trim());
  const startTime = parts[0] || fallbackStart;
  const endTime = parts[1] || getNextHourLabel(startTime);

  return {
    startTime,
    endTime,
  };
}

function inferType(event) {
  if (event?.type) {
    return event.type;
  }

  if (event?.status === "maintenance") {
    return "maintenance";
  }

  if (event?.status === "blocked") {
    return "block";
  }

  return "booking";
}

export default function AdminBookingModal({
  slot,
  defaultRoom,
  initialEvent = null,
  mode = "create",
  onClose,
  onSave,
  onDelete,
}) {
  const isEditMode = mode === "edit";
  const inferredType = inferType(initialEvent);
  const parsedTime = parseEventTime(initialEvent?.time, slot?.hour || "10.00");

  const [priceSettings] = useState(() => getPriceSettings());

  const activeRecordingSessions = useMemo(() => {
    return (priceSettings.recordingSessions || []).filter((item) => item.isActive);
  }, [priceSettings]);

  const packageOptions = useMemo(() => {
    const recordingNames = activeRecordingSessions.map((item) => item.name);
    return Array.from(new Set([...fallbackPackageOptions, ...recordingNames]));
  }, [activeRecordingSessions]);

  const [form, setForm] = useState({
    type: inferredType,
    room: initialEvent?.room || defaultRoom || publicCalendarRooms[0],
    date: initialEvent?.date || slot?.date || "",
    startTime: parsedTime.startTime,
    endTime: parsedTime.endTime,
    customerName: initialEvent?.customerName || "",
    customerPhone: initialEvent?.customerPhone || "",
    peopleCount: String(initialEvent?.peopleCount || "4"),
    sessionCategory: initialEvent?.sessionCategory || "Latihan Band",
    packageName: initialEvent?.packageName || "Regular Session",
    selectedRecordingSessionId: initialEvent?.selectedRecordingSessionId || "",
    status: initialEvent?.status || "pending",
    price: String(initialEvent?.price || ""),
    deposit: String(initialEvent?.deposit || ""),
    paymentStatus: initialEvent?.paymentStatus || "unpaid",
    customerNote: initialEvent?.customerNote || "",
    adminNote: initialEvent?.adminNote || "",
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const statusOptions = useMemo(() => {
    return statusByType[form.type] || statusByType.booking;
  }, [form.type]);

  const applyRecordingSession = (sessionId, currentForm) => {
    const selectedSession = activeRecordingSessions.find((item) => item.id === sessionId);

    if (!selectedSession) {
      return {
        ...currentForm,
        selectedRecordingSessionId: "",
      };
    }

    return {
      ...currentForm,
      selectedRecordingSessionId: selectedSession.id,
      sessionCategory: "Recording",
      packageName: selectedSession.name,
      room: selectedSession.roomName || currentForm.room,
      endTime: addHoursLabel(currentForm.startTime, selectedSession.durationHours),
      price: String(selectedSession.price || ""),
    };
  };

  const updateField = (field, value) => {
    setForm((current) => {
      let next = {
        ...current,
        [field]: value,
      };

      if (field === "type") {
        if (value === "booking") {
          next.status = "pending";
          next.sessionCategory = "Latihan Band";
          next.packageName = "Regular Session";
        }

        if (value === "maintenance") {
          next.status = "maintenance";
          next.sessionCategory = "Other";
          next.packageName = "Custom";
          next.selectedRecordingSessionId = "";
        }

        if (value === "block") {
          next.status = "blocked";
          next.sessionCategory = "Other";
          next.packageName = "Custom";
          next.selectedRecordingSessionId = "";
        }
      }

      if (field === "sessionCategory" && value !== "Recording") {
        next.selectedRecordingSessionId = "";
      }

      if (field === "startTime") {
        if (next.selectedRecordingSessionId) {
          next = applyRecordingSession(next.selectedRecordingSessionId, next);
        } else if (getTimeNumber(next.endTime) <= getTimeNumber(value)) {
          next.endTime = getNextHourLabel(value);
        }
      }

      if (field === "selectedRecordingSessionId") {
        next = applyRecordingSession(value, next);
      }

      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (getTimeNumber(form.endTime) <= getTimeNumber(form.startTime)) {
      alert("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }

    if (form.type === "booking" && !form.customerName.trim()) {
      alert("Nama customer wajib diisi.");
      return;
    }

    if (form.type === "booking" && !form.customerPhone.trim()) {
      alert("Nomor WhatsApp wajib diisi.");
      return;
    }

    const price = Number(cleanMoney(form.price) || 0);
    const deposit = Number(cleanMoney(form.deposit) || 0);

    if (deposit > price && price > 0) {
      alert("DP tidak boleh lebih besar dari harga.");
      return;
    }

    const label =
      form.type === "maintenance"
        ? "Room Maintenance"
        : form.type === "block"
          ? "Room Blocked"
          : form.packageName || form.sessionCategory;

    onSave({
      ...form,
      price,
      deposit,
      peopleCount: Number(form.peopleCount || 0),
      label,
      publicLabel: form.type === "booking" ? "Booked" : label,
    });
  };

  const handleDelete = () => {
    if (!onDelete) {
      return;
    }

    const confirmed = window.confirm("Hapus jadwal ini dari calendar?");

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-booking-modal"
        role="dialog"
        aria-modal="true"
        aria-label={isEditMode ? "Edit jadwal" : "Tambah jadwal"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="admin-booking-modal-header">
          <div>
            <span className="admin-modal-kicker">
              {isEditMode ? "Edit Slot" : "New Slot"}
            </span>
            <h2>{isEditMode ? "Edit Jadwal" : "Tambah Jadwal"}</h2>
            <p>
              {slot?.dayName || "Calendar"} · {form.date} · {form.startTime}
            </p>
          </div>

          <button type="button" aria-label="Tutup modal" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form className="admin-booking-form" onSubmit={handleSubmit}>
          <div className="admin-booking-section">
            <p className="admin-booking-section-title">Slot</p>

            <div className="admin-booking-grid">
              <label>
                <span>Tipe Jadwal</span>
                <select value={form.type} onChange={(event) => updateField("type", event.target.value)}>
                  {scheduleTypes.map((item) => (
                    <option value={item.value} key={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Room</span>
                <select value={form.room} onChange={(event) => updateField("room", event.target.value)}>
                  {publicCalendarRooms.map((room) => (
                    <option value={room} key={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Tanggal</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => updateField("date", event.target.value)}
                />
              </label>

              <label>
                <span>Jam Mulai</span>
                <select value={form.startTime} onChange={(event) => updateField("startTime", event.target.value)}>
                  {timeOptions.slice(0, -1).map((time) => (
                    <option value={time} key={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Jam Selesai</span>
                <select value={form.endTime} onChange={(event) => updateField("endTime", event.target.value)}>
                  {timeOptions.slice(1).map((time) => (
                    <option value={time} key={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Status</span>
                <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                  {statusOptions.map((status) => (
                    <option value={status.value} key={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {form.type === "booking" && (
            <>
              <div className="admin-booking-section">
                <p className="admin-booking-section-title">Customer</p>

                <div className="admin-booking-grid">
                  <label>
                    <span>Nama Customer</span>
                    <input
                      value={form.customerName}
                      placeholder="Contoh: Arief"
                      onChange={(event) => updateField("customerName", event.target.value)}
                    />
                  </label>

                  <label>
                    <span>Nomor WhatsApp</span>
                    <input
                      type="tel"
                      value={form.customerPhone}
                      placeholder="Contoh: 0812xxxxxxx"
                      onChange={(event) => updateField("customerPhone", event.target.value)}
                    />
                  </label>

                  <label>
                    <span>Jumlah Orang</span>
                    <input
                      type="number"
                      min="1"
                      value={form.peopleCount}
                      onChange={(event) => updateField("peopleCount", event.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="admin-booking-section">
                <p className="admin-booking-section-title">Booking & Payment</p>

                <div className="admin-booking-grid">
                  <label>
                    <span>Kategori Sesi</span>
                    <select value={form.sessionCategory} onChange={(event) => updateField("sessionCategory", event.target.value)}>
                      {sessionCategories.map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  {form.sessionCategory === "Recording" && (
                    <label>
                      <span>Recording Session</span>
                      <select
                        value={form.selectedRecordingSessionId}
                        onChange={(event) => updateField("selectedRecordingSessionId", event.target.value)}
                      >
                        <option value="">Custom recording price</option>
                        {activeRecordingSessions.map((session) => (
                          <option value={session.id} key={session.id}>
                            {session.name} · {session.durationHours} jam · Rp{Number(session.price || 0).toLocaleString("id-ID")}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label>
                    <span>Paket</span>
                    <select value={form.packageName} onChange={(event) => updateField("packageName", event.target.value)}>
                      {packageOptions.map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Harga</span>
                    <input
                      inputMode="numeric"
                      value={form.price}
                      placeholder="Contoh: 75000"
                      onChange={(event) => updateField("price", cleanMoney(event.target.value))}
                    />
                  </label>

                  <label>
                    <span>DP</span>
                    <input
                      inputMode="numeric"
                      value={form.deposit}
                      placeholder="Contoh: 25000"
                      onChange={(event) => updateField("deposit", cleanMoney(event.target.value))}
                    />
                  </label>

                  <label>
                    <span>Status Pembayaran</span>
                    <select value={form.paymentStatus} onChange={(event) => updateField("paymentStatus", event.target.value)}>
                      {paymentStatuses.map((item) => (
                        <option value={item.value} key={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="admin-booking-section">
            <p className="admin-booking-section-title">Catatan</p>

            <div className="admin-booking-grid">
              <label className="admin-booking-wide">
                <span>Catatan Customer</span>
                <textarea
                  rows="3"
                  value={form.customerNote}
                  placeholder="Contoh: butuh full band setup."
                  onChange={(event) => updateField("customerNote", event.target.value)}
                />
              </label>

              <label className="admin-booking-wide">
                <span>Catatan Internal Admin</span>
                <textarea
                  rows="3"
                  value={form.adminNote}
                  placeholder="Catatan khusus untuk admin."
                  onChange={(event) => updateField("adminNote", event.target.value)}
                />
              </label>
            </div>
          </div>

          <footer className="admin-booking-modal-actions">
            {isEditMode && (
              <button type="button" className="admin-modal-delete" onClick={handleDelete}>
                <Trash2 size={17} />
                Hapus
              </button>
            )}

            <button type="button" className="admin-modal-cancel" onClick={onClose}>
              Batal
            </button>

            <button type="submit" className="admin-modal-submit">
              {isEditMode ? "Simpan Perubahan" : "Simpan Jadwal"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}