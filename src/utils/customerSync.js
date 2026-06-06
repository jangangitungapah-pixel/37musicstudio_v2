import {
  getCalendarEvents,
  saveCalendarEvents,
} from "./calendarStorage.js";

import {
  getCustomers,
  normalizeCustomerPhone,
  upsertCustomerFromBooking,
} from "./customerStorage.js";

export function attachCustomerToBooking(booking) {
  if (!booking || booking.type !== "booking") {
    return booking;
  }

  const normalizedPhone = normalizeCustomerPhone(booking.customerPhone);
  const customer = upsertCustomerFromBooking(booking);

  return {
    ...booking,
    customerId: customer?.id || booking.customerId || "",
    customerPhoneNormalized: normalizedPhone,
  };
}

export function getCustomerBookingHistory(customerId, events = getCalendarEvents()) {
  if (!customerId) {
    return [];
  }

  return events
    .filter((event) => event.customerId === customerId)
    .sort((first, second) => String(second.date || "").localeCompare(String(first.date || "")));
}

export function buildCustomerSummary(customer, events = getCalendarEvents()) {
  const normalizedPhone = customer?.normalizedPhone || normalizeCustomerPhone(customer?.phone);

  const customerEvents = events.filter((event) => {
    if (customer?.id && event.customerId === customer.id) {
      return true;
    }

    return normalizeCustomerPhone(event.customerPhone) === normalizedPhone;
  });

  const bookingEvents = customerEvents.filter((event) => event.type === "booking" || !event.type);
  const activeBookings = bookingEvents.filter((event) => event.status !== "cancelled");

  const totalSpent = activeBookings.reduce((total, event) => total + Number(event.price || 0), 0);
  const totalPaid = activeBookings.reduce((total, event) => total + Number(event.deposit || 0), 0);
  const totalUnpaid = Math.max(totalSpent - totalPaid, 0);

  const sortedBookings = [...bookingEvents].sort((first, second) => {
    return String(second.date || "").localeCompare(String(first.date || ""));
  });

  const lastBooking = sortedBookings[0] || null;

  return {
    customer,
    bookings: sortedBookings,
    totalBookings: bookingEvents.length,
    activeBookings: activeBookings.length,
    cancelledBookings: bookingEvents.length - activeBookings.length,
    totalSpent,
    totalPaid,
    totalUnpaid,
    lastBookingAt: lastBooking?.date || customer?.lastBookingAt || "",
    lastRoom: lastBooking?.room || customer?.lastRoom || "",
    lastPackage: lastBooking?.packageName || lastBooking?.label || customer?.lastPackage || "",
    lastBooking,
  };
}

export function buildCustomerSummaries(customers = getCustomers(), events = getCalendarEvents()) {
  return customers.map((customer) => buildCustomerSummary(customer, events));
}

export function backfillCustomersFromCalendar() {
  const events = getCalendarEvents();

  const nextEvents = events.map((event) => {
    if (event.type === "booking" || !event.type) {
      return attachCustomerToBooking(event);
    }

    return event;
  });

  saveCalendarEvents(nextEvents);

  return {
    events: nextEvents,
    customers: getCustomers(),
  };
}
