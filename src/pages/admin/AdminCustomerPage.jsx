import AdminPagePlaceholder from "../../components/admin/AdminPagePlaceholder.jsx";

export default function AdminCustomerPage() {
  return (
    <AdminPagePlaceholder
      eyebrow="Customer"
      title="Customer management"
      description="Nanti halaman ini dipakai untuk menyimpan data customer, riwayat booking, nomor kontak, dan preferensi room."
      items={[
        { title: "Customer database", description: "Nama, nomor HP, email, dan status customer." },
        { title: "Booking history", description: "Riwayat sesi studio tiap customer." },
        { title: "Customer notes", description: "Catatan internal admin untuk kebutuhan follow-up." },
      ]}
    />
  );
}
