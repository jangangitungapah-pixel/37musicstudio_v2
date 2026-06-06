import AdminPagePlaceholder from "../../components/admin/AdminPagePlaceholder.jsx";

export default function AdminBookkeepingPage() {
  return (
    <AdminPagePlaceholder
      eyebrow="Pembukuan"
      title="Pembukuan studio"
      description="Nanti halaman ini untuk pemasukan, pengeluaran, laporan bulanan, profit, biaya maintenance, dan cashflow studio."
      items={[
        { title: "Income", description: "Pemasukan dari booking, recording, paket band, dan add-on." },
        { title: "Expense", description: "Pengeluaran operasional, listrik, perawatan alat, dan gaji." },
        { title: "Monthly report", description: "Ringkasan laporan keuangan per bulan." },
      ]}
    />
  );
}
