export function normalizeMoney(value) {
  return Number(String(value ?? 0).replace(/[^\d-]/g, "")) || 0;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getTimeNumber(time) {
  return Number.parseInt(String(time || "0").split(".")[0], 10);
}

function getDurationHours(startTime, endTime) {
  return Math.max(1, getTimeNumber(endTime) - getTimeNumber(startTime));
}

function parseEventTime(time) {
  const [startTime, endTime] = String(time || "")
    .split(" - ")
    .map((item) => item.trim());

  return {
    startTime: startTime || "",
    endTime: endTime || "",
  };
}

export function getResolvedBookingPrice(option, booking) {
  if (!option) {
    return 0;
  }

  if (option.kind === "base") {
    const durationHours = Math.max(
      Number(option.minimumHours || 1),
      getDurationHours(booking.startTime, booking.endTime)
    );

    return Number(option.hourlyPrice || 0) * durationHours;
  }

  if (option.kind === "package" || option.kind === "recording") {
    return Number(option.price || 0);
  }

  return Number(option.price || 0);
}

export function getSuggestedPaymentStatus({ price, deposit }) {
  const totalPrice = normalizeMoney(price);
  const paidAmount = normalizeMoney(deposit);

  if (paidAmount <= 0) {
    return "unpaid";
  }

  if (totalPrice > 0 && paidAmount >= totalPrice) {
    return "paid";
  }

  return "down_payment";
}

export function getPaymentLabel(status) {
  const map = {
    unpaid: "Belum Bayar",
    down_payment: "DP",
    paid: "Lunas",
    refund: "Refund",
  };

  return map[status] || status || "-";
}

export function getBookingFinanceImpact({ originalEvent, nextBooking, resolvedPrice }) {
  if (!nextBooking || nextBooking.type !== "booking") {
    return null;
  }

  const isEdit = Boolean(originalEvent?.id);
  const oldTime = parseEventTime(originalEvent?.time);
  const newTime = {
    startTime: nextBooking.startTime || parseEventTime(nextBooking.time).startTime,
    endTime: nextBooking.endTime || parseEventTime(nextBooking.time).endTime,
  };

  const oldPrice = normalizeMoney(originalEvent?.price);
  const newPrice = normalizeMoney(resolvedPrice);
  const oldPaid = normalizeMoney(originalEvent?.deposit);
  const paidAmount = normalizeMoney(nextBooking.deposit);

  const priceDelta = newPrice - oldPrice;
  const paidDelta = paidAmount - oldPaid;
  const remainingAmount = Math.max(newPrice - paidAmount, 0);
  const overpaidAmount = Math.max(paidAmount - newPrice, 0);

  const scheduleChanged =
    isEdit &&
    (originalEvent?.date !== nextBooking.date ||
      oldTime.startTime !== newTime.startTime ||
      oldTime.endTime !== newTime.endTime);

  const roomChanged = isEdit && originalEvent?.room !== nextBooking.room;
  const packageChanged =
    isEdit &&
    (originalEvent?.packageName || originalEvent?.label || "") !==
      (nextBooking.packageName || nextBooking.label || "");

  const priceChanged = isEdit && oldPrice !== newPrice;
  const paidChanged = isEdit && oldPaid !== paidAmount;

  const changes = [];

  if (scheduleChanged) changes.push("jadwal berubah");
  if (roomChanged) changes.push("room berubah");
  if (packageChanged) changes.push("paket berubah");
  if (priceChanged) changes.push(priceDelta > 0 ? "harga naik" : "harga turun");
  if (paidChanged) changes.push(paidDelta > 0 ? "pembayaran bertambah" : "pembayaran berkurang");

  const paymentStatus = getSuggestedPaymentStatus({
    price: newPrice,
    deposit: paidAmount,
  });

  let tone = "neutral";
  let title = "Pembayaran aman";
  let action = "Tidak ada tindakan pembayaran.";

  if (remainingAmount > 0) {
    tone = paidAmount > 0 ? "due" : "unpaid";
    title = paidAmount > 0 ? "Masih ada sisa bayar" : "Belum ada pembayaran";
    action = "Follow up sisa pembayaran ke customer.";
  }

  if (overpaidAmount > 0) {
    tone = "overpaid";
    title = "Ada kelebihan bayar";
    action = "Konfirmasi refund atau jadikan saldo booking berikutnya.";
  }

  if (newPrice > 0 && paidAmount === newPrice) {
    tone = "paid";
    title = "Pembayaran lunas";
    action = "Tidak ada tagihan tambahan.";
  }

  const customerName = nextBooking.customerName?.trim() || "Kak";
  const dateLabel = nextBooking.date || "-";
  const timeLabel =
    newTime.startTime && newTime.endTime
      ? `${newTime.startTime} - ${newTime.endTime}`
      : nextBooking.time || "-";

  const changeText = changes.length > 0 ? changes.join(", ") : "tidak ada perubahan biaya";
  const paymentLine =
    overpaidAmount > 0
      ? `Kelebihan bayar: ${formatCurrency(overpaidAmount)}. Bisa dikembalikan atau dijadikan saldo booking berikutnya.`
      : remainingAmount > 0
        ? `Sisa pembayaran: ${formatCurrency(remainingAmount)}.`
        : "Pembayaran sudah aman.";

  const customerMessage = [
    `Halo ${customerName}, kami update booking 37 Music Studio:`,
    `Jadwal: ${dateLabel}, pukul ${timeLabel}`,
    `Room: ${nextBooking.room || "-"}`,
    `Paket: ${nextBooking.packageName || nextBooking.label || "-"}`,
    `Total: ${formatCurrency(newPrice)}`,
    `Sudah dibayar: ${formatCurrency(paidAmount)}`,
    paymentLine,
    `Catatan perubahan: ${changeText}.`,
    "Terima kasih."
  ].join("\n");

  return {
    isEdit,
    changes,
    tone,
    title,
    action,
    oldPrice,
    newPrice,
    priceDelta,
    oldPaid,
    paidAmount,
    paidDelta,
    remainingAmount,
    overpaidAmount,
    paymentStatus,
    customerMessage,
  };
}
