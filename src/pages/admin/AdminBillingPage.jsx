import AdminPagePlaceholder from "../../components/admin/AdminPagePlaceholder.jsx";

export default function AdminBillingPage() {
  return (
    <AdminPagePlaceholder
      eyebrow="Billing / POS"
      title="Billing and POS"
      description="Nanti halaman ini untuk transaksi booking, DP, pelunasan, add-on item, invoice, dan laporan kas studio."
      items={[
        { title: "Quick transaction", description: "Input pembayaran sesi studio secara cepat." },
        { title: "Invoice", description: "Generate invoice untuk booking dan paket studio." },
        { title: "Payment status", description: "Tracking unpaid, DP, paid, dan refunded." },
      ]}
    />
  );
}
