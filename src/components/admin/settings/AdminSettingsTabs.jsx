import { useMemo, useState } from "react";

const settingsTabs = [
  {
    id: "price",
    label: "Price",
    eyebrow: "Pricing",
    description: "Atur struktur harga studio, paket, add-on, dan aturan pembayaran.",
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

const pricePreviewCards = [
  {
    title: "Room Price",
    description: "Harga dasar setiap room, misalnya rehearsal room, recording room, dan content room.",
    meta: "Base rate",
  },
  {
    title: "Session Package",
    description: "Paket booking seperti regular session, band package, recording basic, atau custom package.",
    meta: "Package",
  },
  {
    title: "Add-on Service",
    description: "Tambahan seperti operator, extra mic, extended hour, mixing, atau equipment tambahan.",
    meta: "Add-on",
  },
  {
    title: "Payment Rules",
    description: "Aturan DP, pelunasan, refund, dan status pembayaran yang nanti terhubung ke Billing/POS.",
    meta: "Payment",
  },
];

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
            kita siapkan struktur tab dan mulai dari pengaturan harga.
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
  return (
    <div className="admin-price-settings">
      <div className="admin-settings-panel-head">
        <div>
          <p className="section-eyebrow">Price settings</p>
          <h3>Price structure</h3>
          <p>
            Tab ini disiapkan sebagai pusat pengaturan harga. Nanti isinya bisa kita pecah
            menjadi harga room, paket sesi, add-on, dan aturan pembayaran.
          </p>
        </div>

        <button type="button" className="admin-settings-primary-action">
          Add price item
        </button>
      </div>

      <div className="admin-price-preview-grid">
        {pricePreviewCards.map((item) => (
          <article className="admin-price-preview-card" key={item.title}>
            <span>{item.meta}</span>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <div className="admin-settings-empty-state">
        <span>PRICE</span>
        <h4>Belum ada konfigurasi harga.</h4>
        <p>
          Struktur halaman sudah siap. Nanti setelah fungsi price kamu jelasin, kita bisa
          isi dengan form, tabel harga, paket, add-on, dan koneksi ke booking calendar.
        </p>
      </div>
    </div>
  );
}