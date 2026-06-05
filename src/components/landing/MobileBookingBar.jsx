import { CalendarCheck } from "lucide-react";

export default function MobileBookingBar() {
  return (
    <div className="mobile-booking-bar">
      <a href="/booking">
        <CalendarCheck size={20} />
        Booking Sekarang
      </a>
    </div>
  );
}
