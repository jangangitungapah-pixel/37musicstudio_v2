function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function normalizeWhatsAppPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("62")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return "62" + digits.slice(1);
  }

  return digits;
}

export function getRemainingPayment(event) {
  return Math.max(Number(event?.price || 0) - Number(event?.deposit || 0), 0);
}

export function buildWhatsAppUrl(phone, message) {
  const normalizedPhone = normalizeWhatsAppPhone(phone);

  if (!normalizedPhone || !message) {
    return "";
  }

  return "https://wa.me/" + normalizedPhone + "?text=" + encodeURIComponent(message);
}

export function buildBookingAcceptedMessage(event) {
  const customerName = event?.customerName || "Kak";
  const total = formatCurrency(event?.price);
  const paid = formatCurrency(event?.deposit);
  const remaining = formatCurrency(getRemainingPayment(event));

  return [
    "Halo " + customerName + ", booking 37 Music Studio sudah kami terima.",
    "",
    "Detail booking:",
    "Tanggal: " + (event?.date || "-"),
    "Jam: " + (event?.time || "-"),
    "Room: " + (event?.room || "-"),
    "Paket: " + (event?.packageName || event?.label || "-"),
    "Total: " + total,
    "Sudah dibayar: " + paid,
    "Sisa bayar: " + remaining,
    "",
    "Mohon hadir 10 menit sebelum jadwal ya. Terima kasih."
  ].join("\n");
}

export function buildScheduleReminderMessage(event) {
  const customerName = event?.customerName || "Kak";

  return [
    "Halo " + customerName + ", kami ingatkan jadwal booking 37 Music Studio:",
    "",
    "Tanggal: " + (event?.date || "-"),
    "Jam: " + (event?.time || "-"),
    "Room: " + (event?.room || "-"),
    "Paket: " + (event?.packageName || event?.label || "-"),
    "",
    "Mohon hadir tepat waktu ya. Terima kasih."
  ].join("\n");
}

export function buildPaymentReminderMessage(event) {
  const customerName = event?.customerName || "Kak";
  const remaining = getRemainingPayment(event);

  return [
    "Halo " + customerName + ", kami informasikan masih ada sisa pembayaran booking 37 Music Studio.",
    "",
    "Tanggal: " + (event?.date || "-"),
    "Jam: " + (event?.time || "-"),
    "Room: " + (event?.room || "-"),
    "Total: " + formatCurrency(event?.price),
    "Sudah dibayar: " + formatCurrency(event?.deposit),
    "Sisa pembayaran: " + formatCurrency(remaining),
    "",
    "Mohon pelunasan dapat dilakukan sebelum / saat kedatangan. Terima kasih."
  ].join("\n");
}

export function getBookingWhatsAppTemplates(event) {
  const phone = normalizeWhatsAppPhone(event?.customerPhone);
  const remaining = getRemainingPayment(event);

  return [
    {
      id: "booking-accepted",
      label: "Konfirmasi diterima",
      description: "Kirim konfirmasi booking.",
      message: buildBookingAcceptedMessage(event),
      isEnabled: Boolean(phone),
    },
    {
      id: "schedule-reminder",
      label: "Pengingat jadwal",
      description: "Ingatkan jadwal customer.",
      message: buildScheduleReminderMessage(event),
      isEnabled: Boolean(phone),
    },
    {
      id: "payment-reminder",
      label: "Pengingat tagihan",
      description: remaining > 0 ? "Kirim sisa tagihan." : "Tidak ada sisa bayar.",
      message: buildPaymentReminderMessage(event),
      isEnabled: Boolean(phone) && remaining > 0,
    },
  ].map((item) => ({
    ...item,
    url: buildWhatsAppUrl(phone, item.message),
  }));
}
