import { useEffect, useMemo, useState } from "react";
import { Trash2, X } from "lucide-react";

import { publicCalendarRooms } from "../../../data/publicCalendar.js";
import { getPriceSettings } from "../../../utils/priceSettingsStorage.js";
import AdminSelect from "../common/AdminSelect.jsx";

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

function getDurationHours(startTime, endTime) {
  return Math.max(1, getTimeNumber(endTime) - getTimeNumber(startTime));
}

function cleanMoney(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
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

function buildPriceOptions(priceSettings) {
  const baseRoomPrices = (priceSettings.baseRoomPrices || [])
    .filter((item) => item.isActive)
    .map((item) => ({
      id: `base-${item.roomName}`,
      kind: "base",
      label: `Regular Hourly - ${item.roomName}`,
      roomName: item.roomName,
      durationHours: null,
      hourlyPrice: Number(item.hourlyPrice || 0),
      minimumHours: Number(item.minimumHours || 1),
      price: Number(item.hourlyPrice || 0),
      sessionCategory: "Latihan Band",
      packageName: `Regular Hourly - ${item.roomName}`,
      description: `${formatCurrency(item.hourlyPrice)}/jam`,
    }));

  const packages = (priceSettings.packages || [])
    .filter((item) => item.isActive)
    .map((item) => ({
      id: `package-${item.id}`,
      sourceId: item.id,
      kind: "package",
      label: item.name,
      roomName: item.roomName,
      durationHours: Number(item.durationHours || 1),
      price: Number(item.price || 0),
      sessionCategory: "Latihan Band",
      packageName: item.name,
      description: `${item.durationHours} jam · ${formatCurrency(item.price)}`,
    }));

  const recordingSessions = (priceSettings.recordingSessions || [])
    .filter((item) => item.isActive)
    .map((item) => ({
      id: `recording-${item.id}`,
      sourceId: item.id,
      kind: "recording",
      label: item.name,
      roomName: item.roomName,
      durationHours: Number(item.durationHours || 1),
      price: Number(item.price || 0),
      sessionCategory: "Recording",
      packageName: item.name,
      description: `${item.durationHours} jam · ${formatCurrency(item.price)}`,
    }));

  return [
    ...baseRoomPrices,
    ...packages,
    ...recordingSessions,
    {
      id: "custom",
      kind: "custom",
      label: "Custom Price",
      roomName: "",
      durationHours: null,
      price: 0,
      sessionCategory: "Other",
      packageName: "Custom Price",
      description: "Isi harga manual",
    },
  ];
}

function inferPriceOptionId(event, defaultRoom) {
  if (event?.priceOptionId) {
    return event.priceOptionId;
  }

  if (event?.selectedRecordingSessionId) {
    return `recording-${event.selectedRecordingSessionId}`;
  }

  if (event?.selectedPackageId) {
    return `package-${event.selectedPackageId}`;
  }

  if (event?.packageName === "Custom Price") {
    return "custom";
  }

  return `base-${event?.room || defaultRoom || publicCalendarRooms[0]}`;
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

  const priceOptions = useMemo(() => {
    return buildPriceOptions(priceSettings);
  }, [priceSettings]);

  const roomOptions = useMemo(() => {
    const priceRooms = priceOptions
      .map((item) => item.roomName)
      .filter(Boolean);

    return Array.from(new Set([...publicCalendarRooms, ...priceRooms]));
  }, [priceOptions]);

  const [form, setForm] = useState({
    type: inferredType,
    room: initialEvent?.room || defaultRoom || publicCalendarRooms[0],
    date: initialEvent?.date || slot?.date || "",
    startTime: parsedTime.startTime,
    endTime: parsedTime.endTime,
    status: initialEvent?.status || "pending",

    customerName: initialEvent?.customerName || "",
    customerPhone: initialEvent?.customerPhone || "",
    peopleCount: String(initialEvent?.peopleCount || "4"),

    priceOptionId: inferPriceOptionId(initialEvent, defaultRoom),
    sessionCategory: initialEvent?.sessionCategory || "Latihan Band",
    packageName: initialEvent?.packageName || "Regular Hourly",
    selectedPackageId: initialEvent?.selectedPackageId || "",
    selectedRecordingSessionId: initialEvent?.selectedRecordingSessionId || "",

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

  useEffect(() => {
    if (isEditMode) {
      return;
    }

    setForm((current) => {
      const currentOption = priceOptions.find((item) => item.id === current.priceOptionId);

      if (!currentOption || current.price) {
        return current;
      }

      return applyPriceOption(currentOption.id, current);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusOptions = useMemo(() => {
    return statusByType[form.type] || statusByType.booking;
  }, [form.type]);

  const selectedPriceOption = useMemo(() => {
    return priceOptions.find((item) => item.id === form.priceOptionId) || priceOptions.at(-1);
  }, [form.priceOptionId, priceOptions]);

  function calculateBasePrice(option, currentForm) {
    const durationHours = Math.max(
      Number(option.minimumHours || 1),
      getDurationHours(currentForm.startTime, currentForm.endTime)
    );

    return Number(option.hourlyPrice || 0) * durationHours;
  }

  function applyPriceOption(optionId, currentForm) {
    const option = priceOptions.find((item) => item.id === optionId);

    if (!option) {
      return currentForm;
    }

    if (option.kind === "custom") {
      return {
        ...currentForm,
        priceOptionId: option.id,
        packageName: "Custom Price",
        sessionCategory: "Other",
        selectedPackageId: "",
        selectedRecordingSessionId: "",
      };
    }

    if (option.kind === "base") {
      const nextForm = {
        ...currentForm,
        priceOptionId: option.id,
        room: option.roomName || currentForm.room,
        packageName: option.packageName,
        sessionCategory: option.sessionCategory,
        selectedPackageId: "",
        selectedRecordingSessionId: "",
      };

      return {
        ...nextForm,
        price: String(calculateBasePrice(option, nextForm)),
      };
    }

    if (option.kind === "package") {
      return {
        ...currentForm,
        priceOptionId: option.id,
        room: option.roomName || currentForm.room,
        endTime: addHoursLabel(currentForm.startTime, option.durationHours),
        packageName: option.packageName,
        sessionCategory: option.sessionCategory,
        selectedPackageId: option.sourceId,
        selectedRecordingSessionId: "",
        price: String(option.price || ""),
      };
    }

    if (option.kind === "recording") {
      return {
        ...currentForm,
        priceOptionId: option.id,
        room: option.roomName || currentForm.room,
        endTime: addHoursLabel(currentForm.startTime, option.durationHours),
        packageName: option.packageName,
        sessionCategory: option.sessionCategory,
        selectedPackageId: "",
        selectedRecordingSessionId: option.sourceId,
        price: String(option.price || ""),
      };
    }

    return currentForm;
  }

  const updateField = (field, value) => {
    setForm((current) => {
      let next = {
        ...current,
        [field]: value,
      };

      if (field === "type") {
        if (value === "booking") {
          next.status = "pending";
          next = applyPriceOption(next.priceOptionId, next);
        }

        if (value === "maintenance") {
          next.status = "maintenance";
          next.packageName = "Room Maintenance";
          next.sessionCategory = "Other";
        }

        if (value === "block") {
          next.status = "blocked";
          next.packageName = "Room Blocked";
          next.sessionCategory = "Other";
        }
      }

      if (field === "priceOptionId") {
        next = applyPriceOption(value, next);
      }

      if (field === "room") {
        const option = priceOptions.find((item) => item.id === next.priceOptionId);

        if (option?.kind === "base") {
          const matchingBaseOption = priceOptions.find(
            (item) => item.kind === "base" && item.roomName === value
          );

          if (matchingBaseOption) {
            next = applyPriceOption(matchingBaseOption.id, {
              ...next,
              priceOptionId: matchingBaseOption.id,
            });
          }
        }
      }

      if (field === "startTime") {
        const option = priceOptions.find((item) => item.id === next.priceOptionId);

        if (option?.kind === "package" || option?.kind === "recording") {
          next = applyPriceOption(option.id, next);
        } else {
          if (getTimeNumber(next.endTime) <= getTimeNumber(value)) {
            next.endTime = getNextHourLabel(value);
          }

          if (option?.kind === "base") {
            next = applyPriceOption(option.id, next);
          }
        }
      }

      if (field === "endTime") {
        const option = priceOptions.find((item) => item.id === next.priceOptionId);

        if (option?.kind === "base") {
          next = applyPriceOption(option.id, next);
        }
      }

      if (field === "price" || field === "deposit") {
        next[field] = cleanMoney(value);
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

  const durationHours = getDurationHours(form.startTime, form.endTime);

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
              {form.date} · {form.startTime} - {form.endTime}
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
                  {roomOptions.map((room) => (
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
                <p className="admin-booking-section-title">Paket & Pembayaran</p>

                <div className="admin-booking-grid">
                  <AdminSelect
                    label="Pilih Paket"
                    className="admin-booking-wide"
                    value={form.priceOptionId}
                    onChange={(nextValue) => updateField("priceOptionId", nextValue)}
                    options={priceOptions.map((option) => ({
                      value: option.id,
                      label: option.label,
                      description: option.description,
                    }))}
                  />

                  <label>
                    <span>Harga</span>
                    <input
                      inputMode="numeric"
                      value={form.price}
                      placeholder="Contoh: 75000"
                      onChange={(event) => updateField("price", event.target.value)}
                    />
                  </label>

                  <label>
                    <span>DP</span>
                    <input
                      inputMode="numeric"
                      value={form.deposit}
                      placeholder="Contoh: 25000"
                      onChange={(event) => updateField("deposit", event.target.value)}
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

                  <div className="admin-booking-price-summary">
                    <span>Pricing Preview</span>
                    <strong>{formatCurrency(form.price)}</strong>
                    <small>
                      {selectedPriceOption?.label || "Custom Price"} · {durationHours} jam · {form.room}
                    </small>
                  </div>
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