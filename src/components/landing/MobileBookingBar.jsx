import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";

export default function MobileBookingBar() {
  return (
    <div className="mobile-booking-bar">
      <Link to="/booking">
        <CalendarCheck size={20} />
        Booking Sekarang
      </Link>
    </div>
  );
}
