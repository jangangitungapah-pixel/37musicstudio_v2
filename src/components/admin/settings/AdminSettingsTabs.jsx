import { useMemo, useState } from "react";
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

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
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
            Semua pengaturan operasional studio nanti dikumpulkan di sini. Untuk tahap awal,
            kita mulai dari pricing engine agar booking, billing, dan POS bisa punya sumber
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

  const activePriceTabData = useMemo(() => {
    return priceTabs.find((tab) => tab.id === activePriceTab) || priceTabs[0];
  }, [activePriceTab]);

  const handleReset = () => {
    const confirmed = window.confirm("Reset price settings ke data default?");

    if (!confirmed) {
      return;
    }

    const nextSettings = resetPriceSettings();
    setPriceSettings(nextSettings);
  };

  const handleSaveSnapshot = () => {
    savePriceSettings(priceSettings);
    alert("Price settings snapshot tersimpan.");
  };

  return (
    <div className="admin-price-settings">
      <div className="admin-settings-panel-head">
        <div>
          <p className="section-eyebrow">Price settings</p>
          <h3>Pricing engine</h3>
          <p>
            Di sini nanti admin bisa mengatur harga dasar, paket per durasi, recording
            session, add-on, dan aturan pembayaran. Untuk sekarang data masih preview
            dan sudah tersimpan di localStorage.
          </p>
        </div>

        <div className="admin-price-head-actions">
          <button type="button" className="admin-settings-secondary-action" onClick={handleReset}>
            Reset default
          </button>

          <button type="button" className="admin-settings-primary-action" onClick={handleSaveSnapshot}>
            Save snapshot
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

            <button type="button" className="admin-settings-primary-action">
              Create item
            </button>
          </div>

          {activePriceTab === "base" && (
            <BaseRoomPriceSection items={priceSettings.baseRoomPrices} />
          )}

          {activePriceTab === "packages" && (
            <PackagePriceSection items={priceSettings.packages} />
          )}

          {activePriceTab === "recording" && (
            <RecordingSessionSection items={priceSettings.recordingSessions} />
          )}

          {activePriceTab === "addons" && (
            <AddOnPriceSection items={priceSettings.addOns} />
          )}

          {activePriceTab === "payment" && (
            <PaymentRulesSection rules={priceSettings.paymentRules} />
          )}
        </section>
      </div>
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

function RecordingSessionSection({ items }) {
  return (
    <div className="admin-price-card-grid">
      {items.map((item) => (
        <article className="admin-price-item-card is-recording" key={item.id}>
          <span>Recording Session</span>
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