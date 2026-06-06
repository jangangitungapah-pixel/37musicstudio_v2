import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { publicCalendarRooms } from "../../../data/publicCalendar.js";
import { addCalendarEvent, getCalendarEvents } from "../../../utils/calendarStorage.js";
import AdminBookingModal from "./AdminBookingModal.jsx";

const viewOptions = [
  { value: "day", label: "Hari" },
  { value: "week", label: "Minggu" },
  { value: "month", label: "Bulan" },
];

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const adminCalendarHours = Array.from({ length: 13 }, (_, index) => {
  const hour = 10 + index;
  return `${String(hour).padStart(2, "0")}.00`;
});

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + amount);
  return clone;
}

function addMonths(date, amount) {
  const clone = new Date(date);
  clone.setMonth(clone.getMonth() + amount);
  return clone;
}

function startOfWeek(date) {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  clone.setDate(clone.getDate() - clone.getDay());
  return clone;
}

function startOfMonth(date) {
  const clone = new Date(date);
  clone.setDate(1);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function endOfMonth(date) {
  const clone = new Date(date);
  clone.setMonth(clone.getMonth() + 1);
  clone.setDate(0);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function formatDateShort(date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatMonthYear(date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status) {
  const map = {
    available: "Tersedia",
    pending: "Pending",
    booked: "Booked",
    maintenance: "Maintenance",
  };

  return map[status] || status;
}

function getEventStartTime(time) {
  if (!time) {
    return "";
  }

  return time.split(" - ")[0].trim();
}

function getColumnsForView(viewMode, activeDate) {
  if (viewMode === "day") {
    return [activeDate].map((date) => ({
      date,
      value: toDateInputValue(date),
      dayName: dayNames[date.getDay()],
      label: formatDateShort(date),
      isToday: toDateInputValue(date) === toDateInputValue(new Date()),
      inCurrentMonth: true,
    }));
  }

  if (viewMode === "week") {
    const start = startOfWeek(activeDate);

    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(start, index);

      return {
        date,
        value: toDateInputValue(date),
        dayName: dayNames[date.getDay()],
        label: formatDateShort(date),
        isToday: toDateInputValue(date) === toDateInputValue(new Date()),
        inCurrentMonth: true,
      };
    });
  }

  const monthStart = startOfMonth(activeDate);
  const monthEnd = endOfMonth(activeDate);
  const totalDays = monthEnd.getDate();

  return Array.from({ length: totalDays }, (_, index) => {
    const date = addDays(monthStart, index);

    return {
      date,
      value: toDateInputValue(date),
      dayName: dayNames[date.getDay()],
      label: formatDateShort(date),
      isToday: toDateInputValue(date) === toDateInputValue(new Date()),
      inCurrentMonth: true,
    };
  });
}

function getRangeLabel(viewMode, activeDate, columns) {
  if (viewMode === "day") {
    return `${columns[0].dayName}, ${columns[0].label}`;
  }

  if (viewMode === "week") {
    const start = columns[0];
    const end = columns[columns.length - 1];
    return `${start.label} - ${end.label} ${end.date.getFullYear()}`;
  }

  return formatMonthYear(activeDate);
}

export default function AdminCalendarGrid() {
  const [viewMode, setViewMode] = useState("week");
  const [activeDate, setActiveDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [events, setEvents] = useState(() => getCalendarEvents());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const roomOptions = useMemo(() => ["all", ...publicCalendarRooms], []);

  const columns = useMemo(() => {
    return getColumnsForView(viewMode, activeDate);
  }, [viewMode, activeDate]);

  const rangeLabel = useMemo(() => {
    return getRangeLabel(viewMode, activeDate, columns);
  }, [viewMode, activeDate, columns]);

  const gridColumnStyle = useMemo(() => {
    return {
      gridTemplateColumns: `92px repeat(${columns.length}, minmax(132px, 1fr))`,
    };
  }, [columns.length]);

  function getEventsForCell({ date, hour }) {
    return events.filter((event) => {
      const matchDate = event.date === date;
      const matchHour = getEventStartTime(event.time) === hour;
      const matchRoom = selectedRoom === "all" || event.room === selectedRoom;

      return matchDate && matchHour && matchRoom;
    });
  }

  const goPrevious = () => {
    if (viewMode === "day") {
      setActiveDate((current) => addDays(current, -1));
      return;
    }

    if (viewMode === "week") {
      setActiveDate((current) => addDays(current, -7));
      return;
    }

    setActiveDate((current) => addMonths(current, -1));
  };

  const goNext = () => {
    if (viewMode === "day") {
      setActiveDate((current) => addDays(current, 1));
      return;
    }

    if (viewMode === "week") {
      setActiveDate((current) => addDays(current, 7));
      return;
    }

    setActiveDate((current) => addMonths(current, 1));
  };

  function handleOpenCreateModal({ date, dateLabel, dayName, hour }) {
    setSelectedSlot({
      date,
      dateLabel,
      dayName,
      hour,
      room: selectedRoom === "all" ? publicCalendarRooms[0] : selectedRoom,
    });
  }

  function handleSaveBooking(payload) {
    const time = payload.startTime + " - " + payload.endTime;

    const isConflict = events.some((event) => {
      const sameDate = event.date === payload.date;
      const sameRoom = event.room === payload.room;
      const sameStart = getEventStartTime(event.time) === payload.startTime;

      return sameDate && sameRoom && sameStart;
    });

    if (isConflict) {
      alert("Slot ini sudah memiliki jadwal untuk room tersebut.");
      return;
    }

    const nextEvents = addCalendarEvent({
      ...payload,
      time,
    });

    setEvents(nextEvents);
    setSelectedSlot(null);
  }
  return (
    <section className="admin-calendar-grid-shell">
      <div className="admin-calendar-grid-toolbar">
        <div>
          <p className="section-eyebrow">Calendar grid</p>
          <h2>{rangeLabel}</h2>
          <span>
            Header atas berisi hari dan tanggal. Kolom kiri berisi jam operasional studio
            dari 10.00 sampai 22.00.
          </span>
        </div>

        <div className="admin-calendar-toolbar-actions">
          <div className="admin-calendar-view-toggle" aria-label="Pilih tampilan kalender">
            {viewOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={viewMode === option.value ? "is-active" : ""}
                onClick={() => setViewMode(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="admin-calendar-room-filter">
            {roomOptions.map((room) => (
              <button
                type="button"
                key={room}
                className={selectedRoom === room ? "is-active" : ""}
                onClick={() => setSelectedRoom(room)}
              >
                {room === "all" ? "Semua Room" : room}
              </button>
            ))}
          </div>

          <div className="admin-calendar-nav">
            <button type="button" onClick={goPrevious} aria-label="Sebelumnya">
              <ChevronLeft size={18} />
            </button>

            <button type="button" onClick={() => setActiveDate(new Date())}>
              Hari ini
            </button>

            <button type="button" onClick={goNext} aria-label="Berikutnya">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="admin-calendar-status-row">
        <span><i className="status-dot status-available" /> Tersedia</span>
        <span><i className="status-dot status-pending" /> Pending</span>
        <span><i className="status-dot status-booked" /> Booked</span>
        <span><i className="status-dot status-maintenance" /> Maintenance</span>
      </div>

      <div className={`admin-time-calendar-scroll view-${viewMode}`}>
        <div className="admin-time-calendar-grid" style={gridColumnStyle}>
          <div className="admin-time-corner">Jam</div>

          {columns.map((column) => (
            <div
              className={`admin-time-day-head ${column.isToday ? "is-today" : ""}`}
              key={column.value}
            >
              <strong>{column.dayName}</strong>
              <span>{column.label}</span>
            </div>
          ))}

          {adminCalendarHours.map((hour) => (
            <div className="admin-time-row" key={hour}>
              <div className="admin-time-hour-cell">{hour}</div>

              {columns.map((column) => {
                const slotEvents = getEventsForCell({
                  date: column.value,
                  hour,
                });

                if (slotEvents.length === 0) {
                  return (
                    <button
                      type="button"
                      className="admin-time-slot-cell is-empty"
                      key={column.value + "-" + hour}
                      aria-label={"Tambah jadwal " + column.label + " jam " + hour}
                      onClick={() =>
                        handleOpenCreateModal({
                          date: column.value,
                          dateLabel: column.label,
                          dayName: column.dayName,
                          hour,
                        })
                      }
                    />
                  );
                }

                return (
                  <button
                    type="button"
                    className="admin-time-slot-cell has-event"
                    key={`${column.value}-${hour}`}
                  >
                    {slotEvents.slice(0, 2).map((event) => (
                      <span className={`admin-time-event-pill status-${event.status}`} key={event.id}>
                        <strong>{event.label}</strong>
                        <small>{event.room}</small>
                      </span>
                    ))}

                    {slotEvents.length > 2 && (
                      <em>+{slotEvents.length - 2} agenda lain</em>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {selectedSlot && (
        <AdminBookingModal
          slot={selectedSlot}
          defaultRoom={selectedSlot.room}
          onClose={() => setSelectedSlot(null)}
          onSave={handleSaveBooking}
        />
      )}
    </section>
  );
}



