import { MessageCircle } from "lucide-react";

export default function MobileBookingBar() {
  return (
    <div className="mobile-booking-bar">
      <a
        href="https://wa.me/6281234567890?text=Halo%2037%20Music%20Studio%2C%20saya%20mau%20booking%20jadwal%20studio."
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={20} />
        Booking Sekarang
      </a>
    </div>
  );
}
