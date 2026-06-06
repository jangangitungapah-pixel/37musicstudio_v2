import AdminPagePlaceholder from "../../components/admin/AdminPagePlaceholder.jsx";

export default function AdminInventoryPage() {
  return (
    <AdminPagePlaceholder
      eyebrow="Inventory"
      title="Studio inventory"
      description="Nanti halaman ini untuk tracking gear studio, kondisi alat, jadwal maintenance, dan kebutuhan penggantian equipment."
      items={[
        { title: "Gear list", description: "Gitar, bass, drum, mic, interface, speaker, kabel, dan aksesoris." },
        { title: "Condition tracking", description: "Status alat: ready, perlu dicek, rusak, maintenance." },
        { title: "Maintenance log", description: "Catatan servis dan jadwal pengecekan alat." },
      ]}
    />
  );
}
