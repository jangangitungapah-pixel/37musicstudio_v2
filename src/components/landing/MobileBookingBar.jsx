import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "../../config/site.js";

export default function MobileBookingBar() {
  return (
    <div className="mobile-booking-bar">
      <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer">
        <MessageCircle size={20} />
        Booking Sekarang
      </a>
    </div>
  );
}
