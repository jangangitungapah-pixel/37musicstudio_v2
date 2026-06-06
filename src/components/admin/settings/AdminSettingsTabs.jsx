import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import {
  getPriceSettings,
  resetPriceSettings,
  savePriceSettings,
} from "../../../utils/priceSettingsStorage.js";

const settingsTabs = [
  {
    id: "price",
    label: "Price",
    eyebrow: "Pricing Engine",
    description: "Atur harga dasar, paket per jam, recording session, add-on, dan payment rules.",
    status: "Ready",
  },
  {
    id: "rooms",
    label: "Rooms",
    eyebrow: "Studio rooms",
    description: "Nanti dipakai untuk konfigurasi room, kapasitas, fasilitas, dan status room.",
    status: "Soon",
    disabled: true,
  },
  {
    id: "hours",
    label: "Operational Hours",
    eyebrow: "Schedule",
    description: "Nanti dipakai untuk jam buka, slot booking, hari libur, dan jam khusus.",
    status: "Soon",
    disabled: true,
  },
  {
    id: "profile",
    label: "Studio Profile",
    eyebrow: "Identity",
    description: "Nanti dipakai untuk nama studio, alamat, kontak, sosial media, dan brand info.",
    status: "Soon",
    disabled: true,
  },
  {
    id: "notification",
    label: "Notification",
    eyebrow: "Messaging",
    description: "Nanti dipakai untuk template WhatsApp, reminder, dan notifikasi booking.",
    status: "Soon",
    disabled: true,
  },
  {
    id: "access",
    label: "Admin Access",
    eyebrow: "Security",
    description: "Nanti dipakai untuk akun admin, role, permission, dan keamanan.",
    status: "Soon",
    disabled: true,
  },
];

const priceTabs = [
  {
    id: "base",
    label: "Base Room Price",
    description: "Harga dasar per jam untuk setiap room.",
  },
  {
    id: "packages",
    label: "Packages",
    description: "Paket harga berdasarkan durasi tertentu.",
  },
  {
    id: "recording",
    label: "Recording Sessions",
    description: "Paket recording/session yang bisa dibuat bebas.",
  },
  {
    id: "addons",
    label: "Add-ons",
    description: "Layanan tambahan yang bisa ditambahkan ke booking.",
  },
  {
    id: "payment",
    label: "Payment Rules",
    description: "Aturan DP, diskon, refund, dan pembayaran.",
  },
];

const roomOptions = ["Recording Room", "Rehearsal Room", "Content Room"];

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function cleanMoney(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function createId(prefix) {
  return `${prefix}-${Date.now()}`;
}

export default function AdminSettingsTabs() {
  const [activeTab, setActiveTab] = useState("price");

  const activeTabData = useMemo(() => {
    return settingsTabs.find((tab) => tab.id === activeTab) || settingsTabs[0];
  }, [activeTab]);

  return (
    <section className="admin-settings-page">
      <div className="admin-settings-hero">
        <div>
          <p className="section-eyebrow">Settings</p>
          <h2>Studio configuration center.</h2>
          <p>
            Semua pengaturan operasional studio dikumpulkan di sini. Untuk tahap awal,
            kita mulai dari pricing engine agar booking, billing, dan POS punya sumber
            harga yang konsisten.
          </p>
        </div>

        <div className="admin-settings-hero-card">
          <span>Active tab</span>
          <strong>{activeTabData.label}</strong>
          <p>{activeTabData.description}</p>
        </div>
      </div>

      <div className="admin-settings-layout">
        <aside className="admin-settings-tabs" aria-label="Settings tabs">
          {settingsTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={[
                "admin-settings-tab",
                activeTab === tab.id ? "is-active" : "",
                tab.disabled ? "is-disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>
                <strong>{tab.label}</strong>
                <small>{tab.eyebrow}</small>
              </span>

              <em>{tab.status}</em>
            </button>
          ))}
        </aside>

        <main className="admin-settings-panel">
          {activeTab === "price" && <PriceSettingsTab />}
        </main>
      </div>
    </section>
  );
}

function PriceSettingsTab() {
  const [activePriceTab, setActivePriceTab] = useState("base");
  const [priceSettings, setPriceSettings] = useState(() => getPriceSettings());
  const [recordingModalMode, setRecordingModalMode] = useState(null);
  const [selectedRecordingSession, setSelectedRecordingSession] = useState(null);

  const activePriceTabData = useMemo(() => {
    return priceTabs.find((tab) => tab.id === activePriceTab) || priceTabs[0];
  }, [activePriceTab]);

  const persistSettings = (nextSettings) => {
    setPriceSettings(nextSettings);
    savePriceSettings(nextSettings);
  };

  const handleReset = () => {
    const confirmed = window.confirm("Reset price settings ke data default?");

    if (!confirmed) {
      return;
    }

    const nextSettings = resetPriceSettings();
    setPriceSettings(nextSettings);
  };

  const handleCreateItem = () => {
    if (activePriceTab !== "recording") {
      alert("Untuk sementara create item baru baru aktif di Recording Sessions.");
      return;
    }

    setSelectedRecordingSession(null);
    setRecordingModalMode("create");
  };

  const handleEditRecordingSession = (item) => {
    setSelectedRecordingSession(item);
    setRecordingModalMode("edit");
  };

  const handleSaveRecordingSession = (payload) => {
    const nextItem = {
      ...payload,
      id: payload.id || createId("rec"),
    };

    const nextSettings = {
      ...priceSettings,
      recordingSessions:
        recordingModalMode === "edit"
          ? priceSettings.recordingSessions.map((item) =>
            item.id === nextItem.id ? nextItem : item
          )
          : [nextItem, ...priceSettings.recordingSessions],
    };

    persistSettings(nextSettings);
    setRecordingModalMode(null);
    setSelectedRecordingSession(null);
  };

  const handleDeleteRecordingSession = (itemId) => {
    const confirmed = window.confirm("Hapus recording session ini?");

    if (!confirmed) {
      return;
    }

    const nextSettings = {
      ...priceSettings,
      recordingSessions: priceSettings.recordingSessions.filter((item) => item.id !== itemId),
    };

    persistSettings(nextSettings);
  };

  return (
    <div className="admin-price-settings">
      <div className="admin-settings-panel-head">
        <div>
          <p className="section-eyebrow">Price settings</p>
          <h3>Pricing engine</h3>
          <p>
            Di sini admin bisa mengatur harga dasar, paket per durasi, recording
            session, add-on, dan aturan pembayaran. Data tersimpan di localStorage.
          </p>
        </div>

        <div className="admin-price-head-actions">
          <button type="button" className="admin-settings-secondary-action" onClick={handleReset}>
            Reset default
          </button>

          <button type="button" className="admin-settings-primary-action" onClick={handleCreateItem}>
            <Plus size={17} />
            Create item
          </button>
        </div>
      </div>

      <div className="admin-price-engine-layout">
        <nav className="admin-price-subtabs" aria-label="Price settings sections">
          {priceTabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={activePriceTab === tab.id ? "is-active" : ""}
              onClick={() => setActivePriceTab(tab.id)}
            >
              <strong>{tab.label}</strong>
              <span>{tab.description}</span>
            </button>
          ))}
        </nav>

        <section className="admin-price-content-panel">
          <div className="admin-price-content-head">
            <div>
              <span>PRICE SECTION</span>
              <h4>{activePriceTabData.label}</h4>
              <p>{activePriceTabData.description}</p>
            </div>

            <button type="button" className="admin-settings-primary-action" onClick={handleCreateItem}>
              <Plus size={17} />
              {activePriceTab === "recording" ? "Create recording session" : "Create item"}
            </button>
          </div>

          {activePriceTab === "base" && (
            <BaseRoomPriceSection items={priceSettings.baseRoomPrices} />
          )}

          {activePriceTab === "packages" && (
            <PackagePriceSection items={priceSettings.packages} />
          )}

          {activePriceTab === "recording" && (
            <RecordingSessionSection
              items={priceSettings.recordingSessions}
              onEdit={handleEditRecordingSession}
              onDelete={handleDeleteRecordingSession}
            />
          )}

          {activePriceTab === "addons" && (
            <AddOnPriceSection items={priceSettings.addOns} />
          )}

          {activePriceTab === "payment" && (
            <PaymentRulesSection rules={priceSettings.paymentRules} />
          )}
        </section>
      </div>

      {recordingModalMode && (
        <RecordingSessionModal
          mode={recordingModalMode}
          initialItem={selectedRecordingSession}
          onClose={() => {
            setRecordingModalMode(null);
            setSelectedRecordingSession(null);
          }}
          onSave={handleSaveRecordingSession}
        />
      )}
    </div>
  );
}

function BaseRoomPriceSection({ items }) {
  return (
    <div className="admin-price-table-card">
      <div className="admin-price-table-head">
        <span>Room</span>
        <span>Harga / Jam</span>
        <span>Minimum</span>
        <span>Status</span>
      </div>

      {items.map((item) => (
        <div className="admin-price-table-row" key={item.id}>
          <strong>{item.roomName}</strong>
          <span>{formatCurrency(item.hourlyPrice)}</span>
          <span>{item.minimumHours} jam</span>
          <em>{item.isActive ? "Active" : "Inactive"}</em>
        </div>
      ))}
    </div>
  );
}

function PackagePriceSection({ items }) {
  return (
    <div className="admin-price-card-grid">
      {items.map((item) => (
        <article className="admin-price-item-card" key={item.id}>
          <span>Package</span>
          <strong>{item.name}</strong>
          <p>{item.description}</p>

          <div>
            <small>{item.roomName}</small>
            <small>{item.durationHours} jam</small>
            <small>{formatCurrency(item.price)}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function RecordingSessionSection({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="admin-settings-empty-state">
        <span>RECORDING</span>
        <h4>Belum ada recording session.</h4>
        <p>
          Klik tombol Create recording session untuk membuat paket recording baru,
          tentukan jumlah jam dan harga.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-price-card-grid">
      {items.map((item) => (
        <article className="admin-price-item-card is-recording" key={item.id}>
          <div className="admin-price-card-top">
            <span>Recording Session</span>
            <em>{item.isActive ? "Active" : "Inactive"}</em>
          </div>

          <strong>{item.name}</strong>
          <p>{item.description}</p>

          <div className="admin-price-chip-row">
            <small>{item.roomName}</small>
            <small>{item.durationHours} jam</small>
            <small>{formatCurrency(item.price)}</small>
          </div>

          <footer className="admin-price-card-actions">
            <button type="button" onClick={() => onEdit(item)}>
              <Pencil size={15} />
              Edit
            </button>

            <button type="button" className="is-danger" onClick={() => onDelete(item.id)}>
              <Trash2 size={15} />
              Delete
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}

function AddOnPriceSection({ items }) {
  return (
    <div className="admin-price-card-grid">
      {items.map((item) => (
        <article className="admin-price-item-card is-addon" key={item.id}>
          <span>Add-on</span>
          <strong>{item.name}</strong>
          <p>{item.description}</p>

          <div>
            <small>{item.chargeType.replace("_", " ")}</small>
            <small>{formatCurrency(item.price)}</small>
          </div>
        </article>
      ))}
    </div>
  );
}

function PaymentRulesSection({ rules }) {
  return (
    <div className="admin-payment-rules-card">
      <div>
        <span>Minimum DP</span>
        <strong>
          {rules.minimumDepositType === "percent"
            ? `${rules.minimumDepositValue}%`
            : formatCurrency(rules.minimumDepositValue)}
        </strong>
      </div>

      <div>
        <span>Manual Discount</span>
        <strong>{rules.allowManualDiscount ? "Allowed" : "Disabled"}</strong>
      </div>

      <div>
        <span>Refund Policy</span>
        <strong>{rules.refundPolicy}</strong>
      </div>
    </div>
  );
}

function RecordingSessionModal({ mode, initialItem, onClose, onSave }) {
  const [form, setForm] = useState({
    id: initialItem?.id || "",
    name: initialItem?.name || "",
    roomName: initialItem?.roomName || "Recording Room",
    durationHours: String(initialItem?.durationHours || "2"),
    price: String(initialItem?.price || ""),
    description: initialItem?.description || "",
    isActive: initialItem?.isActive ?? true,
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Nama recording session wajib diisi.");
      return;
    }

    if (Number(form.durationHours) <= 0) {
      alert("Durasi harus lebih dari 0 jam.");
      return;
    }

    const price = Number(cleanMoney(form.price) || 0);

    if (price <= 0) {
      alert("Harga harus lebih dari 0.");
      return;
    }

    onSave({
      ...form,
      durationHours: Number(form.durationHours),
      price,
    });
  };

  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="admin-price-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === "edit" ? "Edit recording session" : "Create recording session"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="admin-price-modal-header">
          <div>
            <span>{mode === "edit" ? "Edit Session" : "New Session"}</span>
            <h3>{mode === "edit" ? "Edit Recording Session" : "Create Recording Session"}</h3>
            <p>Tentukan nama paket, room, durasi jam, dan harga.</p>
          </div>

          <button type="button" aria-label="Tutup modal" onClick={onClose}>
            <X size={20} />
          </button>
        </header>

        <form className="admin-price-modal-form" onSubmit={handleSubmit}>
          <label>
            <span>Nama Session</span>
            <input
              value={form.name}
              placeholder="Contoh: Recording Vocal 2 Jam"
              onChange={(event) => updateField("name", event.target.value)}
            />
          </label>

          <label>
            <span>Room</span>
            <select value={form.roomName} onChange={(event) => updateField("roomName", event.target.value)}>
              {roomOptions.map((room) => (
                <option value={room} key={room}>
                  {room}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Durasi Jam</span>
            <input
              type="number"
              min="1"
              step="1"
              value={form.durationHours}
              onChange={(event) => updateField("durationHours", event.target.value)}
            />
          </label>

          <label>
            <span>Harga</span>
            <input
              inputMode="numeric"
              value={form.price}
              placeholder="Contoh: 300000"
              onChange={(event) => updateField("price", cleanMoney(event.target.value))}
            />
          </label>

          <label className="admin-price-modal-wide">
            <span>Deskripsi</span>
            <textarea
              rows="4"
              value={form.description}
              placeholder="Contoh: Paket recording vocal basic selama 2 jam."
              onChange={(event) => updateField("description", event.target.value)}
            />
          </label>

          <label className="admin-price-toggle">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => updateField("isActive", event.target.checked)}
            />
            <span>Aktifkan session ini</span>
          </label>

          <footer className="admin-price-modal-actions">
            <button type="button" className="admin-settings-secondary-action" onClick={onClose}>
              Batal
            </button>

            <button type="submit" className="admin-settings-primary-action">
              {mode === "edit" ? "Simpan Perubahan" : "Create Session"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}