export const PRICE_SETTINGS_STORAGE_KEY = "37musicstudio_price_settings_v1";

export const defaultPriceSettings = {
  baseRoomPrices: [
    {
      id: "base-rehearsal",
      roomName: "Rehearsal Room",
      hourlyPrice: 75000,
      minimumHours: 1,
      isActive: true,
    },
    {
      id: "base-recording",
      roomName: "Recording Room",
      hourlyPrice: 150000,
      minimumHours: 1,
      isActive: true,
    },
    {
      id: "base-content",
      roomName: "Content Room",
      hourlyPrice: 100000,
      minimumHours: 1,
      isActive: true,
    },
  ],
  packages: [
    {
      id: "pkg-band-2h",
      name: "Band Practice 2 Jam",
      roomName: "Rehearsal Room",
      durationHours: 2,
      price: 140000,
      description: "Paket latihan band reguler 2 jam.",
      isActive: true,
    },
    {
      id: "pkg-band-3h",
      name: "Band Practice 3 Jam",
      roomName: "Rehearsal Room",
      durationHours: 3,
      price: 200000,
      description: "Paket latihan band reguler 3 jam.",
      isActive: true,
    },
  ],
  recordingSessions: [
    {
      id: "rec-basic",
      name: "Recording Basic",
      roomName: "Recording Room",
      durationHours: 2,
      price: 300000,
      description: "Session recording basic untuk vocal/guitar take.",
      isActive: true,
    },
    {
      id: "rec-pro",
      name: "Recording Pro",
      roomName: "Recording Room",
      durationHours: 4,
      price: 550000,
      description: "Session recording multi-track dengan durasi lebih panjang.",
      isActive: true,
    },
  ],
  addOns: [
    {
      id: "addon-operator",
      name: "Operator",
      chargeType: "per_session",
      price: 50000,
      description: "Tambahan operator selama sesi berlangsung.",
      isActive: true,
    },
    {
      id: "addon-extra-mic",
      name: "Extra Mic",
      chargeType: "per_unit",
      price: 25000,
      description: "Tambahan microphone per unit.",
      isActive: true,
    },
  ],
  paymentRules: {
    minimumDepositType: "percent",
    minimumDepositValue: 30,
    allowManualDiscount: true,
    refundPolicy: "Manual approval by admin",
  },
};

export function getPriceSettings() {
  if (typeof window === "undefined") {
    return defaultPriceSettings;
  }

  const stored = window.localStorage.getItem(PRICE_SETTINGS_STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(PRICE_SETTINGS_STORAGE_KEY, JSON.stringify(defaultPriceSettings));
    return defaultPriceSettings;
  }

  try {
    return JSON.parse(stored);
  } catch {
    window.localStorage.setItem(PRICE_SETTINGS_STORAGE_KEY, JSON.stringify(defaultPriceSettings));
    return defaultPriceSettings;
  }
}

export function savePriceSettings(settings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PRICE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function resetPriceSettings() {
  savePriceSettings(defaultPriceSettings);
  return defaultPriceSettings;
}