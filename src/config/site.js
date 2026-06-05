export const siteConfig = {
  brand: {
    name: "37 Music Studio",
    shortName: "37 Music",
    tagline: "Rehearsal, recording, and creative music space.",
    mark: "37",
  },

  contact: {
    whatsappNumber: "6281234567890",
    whatsappText:
      "Halo 37 Music Studio, saya mau booking jadwal studio.",
    instagramUrl: "#",
    mapsUrl: "#",
  },

  business: {
    openLabel: "Open Daily",
    locationLabel: "Tangerang, Indonesia",
    rating: "4.9",
  },
};

export function getWhatsAppUrl(customText) {
  const text = customText || siteConfig.contact.whatsappText;
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}
