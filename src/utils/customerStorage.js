export const CUSTOMER_STORAGE_KEY = "37musicstudio_customers_v1";

export function normalizeCustomerPhone(phone) {
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

export function createCustomerId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return "cust-" + crypto.randomUUID();
  }

  return "cust-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

export function getCustomers() {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify([]));
    return [];
  }

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
}

export function saveCustomers(customers) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
}

export function findCustomerByPhone(phone, customers = getCustomers()) {
  const normalizedPhone = normalizeCustomerPhone(phone);

  if (!normalizedPhone) {
    return null;
  }

  return customers.find((customer) => customer.normalizedPhone === normalizedPhone) || null;
}

export function upsertCustomerFromBooking(booking) {
  if (!booking || booking.type !== "booking") {
    return null;
  }

  const normalizedPhone = normalizeCustomerPhone(booking.customerPhone);

  if (!normalizedPhone) {
    return null;
  }

  const customers = getCustomers();
  const existingCustomer = findCustomerByPhone(normalizedPhone, customers);
  const now = new Date().toISOString();

  if (existingCustomer) {
    const nextCustomer = {
      ...existingCustomer,
      name: booking.customerName?.trim() || existingCustomer.name,
      phone: booking.customerPhone || existingCustomer.phone,
      normalizedPhone,
      updatedAt: now,
      lastBookingAt: booking.date || existingCustomer.lastBookingAt || "",
      lastRoom: booking.room || existingCustomer.lastRoom || "",
      lastPackage: booking.packageName || booking.label || existingCustomer.lastPackage || "",
    };

    const nextCustomers = customers.map((customer) =>
      customer.id === existingCustomer.id ? nextCustomer : customer
    );

    saveCustomers(nextCustomers);
    return nextCustomer;
  }

  const customer = {
    id: createCustomerId(),
    name: booking.customerName?.trim() || "Customer",
    phone: booking.customerPhone || "",
    normalizedPhone,
    notes: "",
    tags: [],
    status: "active",
    createdAt: now,
    updatedAt: now,
    lastBookingAt: booking.date || "",
    lastRoom: booking.room || "",
    lastPackage: booking.packageName || booking.label || "",
  };

  saveCustomers([...customers, customer]);
  return customer;
}

export function updateCustomer(customerId, patch) {
  const customers = getCustomers();
  const now = new Date().toISOString();

  const nextCustomers = customers.map((customer) => {
    if (customer.id !== customerId) {
      return customer;
    }

    const nextPhone = patch.phone ?? customer.phone;

    return {
      ...customer,
      ...patch,
      phone: nextPhone,
      normalizedPhone: normalizeCustomerPhone(nextPhone),
      updatedAt: now,
    };
  });

  saveCustomers(nextCustomers);

  return nextCustomers.find((customer) => customer.id === customerId) || null;
}
