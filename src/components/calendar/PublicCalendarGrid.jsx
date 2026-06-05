import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  publicCalendarEvents,
  publicCalendarRooms,
  publicCalendarTimeSlots,
} from "../../data/publicCalendar.js";

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function toDateInputValue(date) {
  return date.toISOString().split("T")[0];
}

function addDays(date, amount) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

function startOfWeek(date) {
  const clone = new Date(date);
  const day = clone.getDay();
  clone.setDate(clone.getDate() - day);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getSlotStatus({ date, time, room }) {
  const event = publicCalendarEvents.find(
    (item) => item.date === date && item.time === time && item.room === room
  );

  if (!event) {
    return {
      status: "available",
      label: "Available",
    };
  }

  return event;
}

function getStatusText(status) {
  const map = {
    available: "Tersedia",
    pending: "Pending",
    booked: "Booked",
    maintenance: "Maintenance",
  };

  return map[status] || status;
}

export default function PublicCalendarGrid() {
  const [selectedRoom, setSelectedRoom] = useState(publicCalendarRooms[0]);
  const [anchorDate, setAnchorDate] = useState(new Date());

  const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);

      return {
        date,
        value: toDateInputValue(date),
        dayName: dayNames[date.getDay()],
        label: formatDateLabel(date),
        isToday: toDateInputValue(date) === toDateInputValue(new Date()),
      };
    });
  }, [weekStart]);

  const weekLabel = `${formatDateLabel(weekDays[0].date)} - ${formatDateLabel(
    weekDays[6].date
  )}`;

  return (
    <section className="public-calendar-shell">
      <div className="public-calendar-toolbar">
        <div>
          <p className="section-eyebrow">Public calendar</p>
          <h2>Cek slot studio sebelum booking.</h2>
          <span>{formatMonthLabel(anchorDate)} · {weekLabel}</span>
        </div>

        <div className="calendar-nav-actions">
          <button type="button" onClick={() => setAnchorDate(addDays(anchorDate, -7))}>
            ‹ Minggu lalu
          </button>
          <button type="button" onClick={() => setAnchorDate(new Date())}>
            Hari ini
          </button>
          <button type="button" onClick={() => setAnchorDate(addDays(anchorDate, 7))}>
            Minggu depan ›
          </button>
        </div>
      </div>

      <div className="public-room-tabs" aria-label="Pilih room">
        {publicCalendarRooms.map((room) => (
          <button
            type="button"
            key={room}
            className={room === selectedRoom ? "is-active" : ""}
            onClick={() => setSelectedRoom(room)}
          >
            {room}
          </button>
        ))}
      </div>

      <div className="calendar-status-legend" aria-label="Legenda status">
        <span><i className="status-dot status-available" /> Tersedia</span>
        <span><i className="status-dot status-pending" /> Pending</span>
        <span><i className="status-dot status-booked" /> Booked</span>
        <span><i className="status-dot status-maintenance" /> Maintenance</span>
      </div>

      <div className="public-calendar-scroll">
        <div className="public-calendar-grid">
          <div className="calendar-corner">Jam</div>

          {weekDays.map((day) => (
            <div className={`calendar-day-head ${day.isToday ? "is-today" : ""}`} key={day.value}>
              <strong>{day.dayName}</strong>
              <span>{day.label}</span>
            </div>
          ))}

          {publicCalendarTimeSlots.map((time) => (
            <div className="calendar-row-fragment" key={time}>
              <div className="calendar-time-cell">{time}</div>

              {weekDays.map((day) => {
                const slot = getSlotStatus({
                  date: day.value,
                  time,
                  room: selectedRoom,
                });

                const bookingHref = `/booking?room=${encodeURIComponent(
                  selectedRoom
                )}&date=${encodeURIComponent(day.value)}&time=${encodeURIComponent(time)}`;

                const isAvailable = slot.status === "available";

                if (isAvailable) {
                  return (
                    <Link
                      to={bookingHref}
                      className={`calendar-slot-cell status-${slot.status}`}
                      key={`${day.value}-${time}`}
                    >
                      <span>{getStatusText(slot.status)}</span>
                      <small>Booking</small>
                    </Link>
                  );
                }

                return (
                  <div
                    className={`calendar-slot-cell status-${slot.status}`}
                    key={`${day.value}-${time}`}
                  >
                    <span>{getStatusText(slot.status)}</span>
                    <small>{slot.label}</small>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-mobile-list">
        {weekDays.map((day) => (
          <article className="calendar-mobile-day" key={day.value}>
            <div className="calendar-mobile-day-head">
              <strong>{day.dayName}, {day.label}</strong>
              {day.isToday && <span>Hari ini</span>}
            </div>

            <div className="calendar-mobile-slots">
              {publicCalendarTimeSlots.map((time) => {
                const slot = getSlotStatus({
                  date: day.value,
                  time,
                  room: selectedRoom,
                });

                const bookingHref = `/booking?room=${encodeURIComponent(
                  selectedRoom
                )}&date=${encodeURIComponent(day.value)}&time=${encodeURIComponent(time)}`;

                const isAvailable = slot.status === "available";

                if (isAvailable) {
                  return (
                    <Link
                      to={bookingHref}
                      className={`mobile-slot-card status-${slot.status}`}
                      key={time}
                    >
                      <span>{time}</span>
                      <strong>{getStatusText(slot.status)}</strong>
                    </Link>
                  );
                }

                return (
                  <div className={`mobile-slot-card status-${slot.status}`} key={time}>
                    <span>{time}</span>
                    <strong>{getStatusText(slot.status)}</strong>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
