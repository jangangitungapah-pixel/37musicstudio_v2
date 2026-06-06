import AdminPagePlaceholder from "../../components/admin/AdminPagePlaceholder.jsx";

export default function AdminSettingsPage() {
  return (
    <AdminPagePlaceholder
      eyebrow="Settings"
      title="Studio settings"
      description="Nanti halaman ini untuk konfigurasi profile studio, jam operasional, room, pricing, WhatsApp, dan akses admin."
      items={[
        { title: "Studio profile", description: "Nama, logo, alamat, kontak, dan link sosial media." },
        { title: "Operational hours", description: "Jam buka, slot booking, dan hari libur." },
        { title: "Admin access", description: "Pengaturan akun admin saat sudah pakai backend/auth asli." },
      ]}
    />
  );
}
