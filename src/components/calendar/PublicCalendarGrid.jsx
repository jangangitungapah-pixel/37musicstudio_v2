import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, CheckCircle2, Clock3, Filter, Sparkles } from "lucide-react";
import { publicCalendarEvents, publicCalendarTimeSlots } from "../../data/publicCalendar.js";

const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const statusOptions = ["all", "available", "pending", "booked", "maintenance"];
const timeOptions = [
  { value: "all", label: "Semua jam" },
  { value: "morning", label: "Pagi", range: [10, 12] },
  { value: "afternoon", label: "Siang", range: [12, 18] },
  { value: "evening", label: "Malam", range: [18, 22] },
];

function toDateInputValue(date) {
  const clone = new Date(date);
  clone.setMinutes(clone.getMinutes() - clone.getTimezoneOffset());
  return clone.toISOString().split("T")[0];
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

function formatLongDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
}

function formatMonthLabel(date) {
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getSlotHour(time) {
  return Number(time.split(".")[0]);
}

function getSlotStatus({ date, time }) {
  const event = publicCalendarEvents.find((item) => item.date === date && item.time === time);

  if (!event) {
    return {
      status: "available",
      label: "Siap booking",
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

function getBookingHref(day, time) {
  return `/booking?date=${encodeURIComponent(day.value)}&time=${encodeURIComponent(time)}`;
}

function isTimeMatch(time, filter) {
  const option = timeOptions.find((item) => item.value === filter);

  if (!option?.range) {
    return true;
  }

  const hour = getSlotHour(time);
  return hour >= option.range[0] && hour < option.range[1];
}

function createSlot(day, time) {
  const slot = getSlotStatus({ date: day.value, time });

  return {
    ...slot,
    date: day.value,
    day,
    time,
    hour: getSlotHour(time),
    isAvailable: slot.status === "available",
    bookingHref: getBookingHref(day, time),
  };
}

export default function PublicCalendarGrid() {
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const weekStart = useMemo(() => startOfWeek(anchorDate), [anchorDate]);

  const weekDays = useMemo(() => {
    const todayValue = toDateInputValue(new Date());

    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);

      return {
        date,
        value: toDateInputValue(date),
        dayName: dayNames[date.getDay()],
        label: formatDateLabel(date),
        longLabel: formatLongDate(date),
        isToday: toDateInputValue(date) === todayValue,
      };
    });
  }, [weekStart]);

  const weekSlots = useMemo(() => {
    return weekDays.flatMap((day) => publicCalendarTimeSlots.map((time) => createSlot(day, time)));
  }, [weekDays]);

  const filteredTimeSlots = useMemo(() => {
    return publicCalendarTimeSlots.filter((time) => isTimeMatch(time, timeFilter));
  }, [timeFilter]);

  const visibleSlots = useMemo(() => {
    return weekSlots.filter((slot) => {
      const matchesStatus = statusFilter === "all" || slot.status === statusFilter;
      return matchesStatus && isTimeMatch(slot.time, timeFilter);
    });
  }, [statusFilter, timeFilter, weekSlots]);

  const dailyAvailability = useMemo(() => {
    return weekDays.map((day) => {
      const slots = weekSlots.filter((slot) => slot.date === day.value);
      const available = slots.filter((slot) => slot.isAvailable);

      return {
        ...day,
        availableCount: available.length,
        firstAvailable: available[0],
      };
    });
  }, [weekDays, weekSlots]);

  const availableSlots = visibleSlots.filter((slot) => slot.isAvailable);
  const busiestDay = dailyAvailability.reduce((best, day) => {
    if (!best || day.availableCount < best.availableCount) {
      return day;
    }

    return best;
  }, null);
  const bestDay = dailyAvailability.reduce((best, day) => {
    if (!best || day.availableCount > best.availableCount) {
      return day;
    }

    return best;
  }, null);
  const recommendedSlots = availableSlots.slice(0, 3);
  const weekLabel = `${formatDateLabel(weekDays[0].date)} - ${formatDateLabel(weekDays[6].date)}`;
  const totalSlots = weekSlots.length;
  const totalAvailable = weekSlots.filter((slot) => slot.isAvailable).length;
  const availabilityPercent = Math.round((totalAvailable / totalSlots) * 100);

  return (
    <section className="public-calendar-shell">
      <div className="public-calendar-toolbar">
        <div>
          <p className="section-eyebrow">Smart calendar</p>
          <h2>Cari slot kosong tanpa tebak-tebakan.</h2>
          <span>
            {formatMonthLabel(anchorDate)} · {weekLabel}
          </span>
        </div>

        <div className="calendar-nav-actions">
          <button type="button" onClick={() => setAnchorDate(addDays(anchorDate, -7))}>
            Minggu lalu
          </button>
          <button type="button" onClick={() => setAnchorDate(new Date())}>
            Hari ini
          </button>
          <button type="button" onClick={() => setAnchorDate(addDays(anchorDate, 7))}>
            Minggu depan
          </button>
        </div>
      </div>

      <div className="calendar-intelligence-panel">
        <div className="calendar-score">
          <CheckCircle2 size={21} />
          <strong>{availabilityPercent}%</strong>
          <span>slot minggu ini masih bisa diajukan</span>
        </div>

        <div className="calendar-insight">
          <Sparkles size={18} />
          <span>
            Rekomendasi: {bestDay?.firstAvailable ? `${bestDay.longLabel}, ${bestDay.firstAvailable.time}` : "cek minggu depan"}
          </span>
        </div>

        <div className="calendar-insight">
          <Clock3 size={18} />
          <span>
            Paling padat: {busiestDay ? `${busiestDay.longLabel} (${busiestDay.availableCount} slot kosong)` : "-"}
          </span>
        </div>
      </div>

      <div className="calendar-controls" aria-label="Filter kalender">
        <label className="calendar-date-jump">
          <CalendarClock size={18} />
          <span>Pilih tanggal</span>
          <input
            type="date"
            value={toDateInputValue(anchorDate)}
            onChange={(event) => setAnchorDate(new Date(`${event.target.value}T12:00:00`))}
          />
        </label>

        <div className="calendar-segmented" aria-label="Filter status">
          {statusOptions.map((status) => (
            <button
              type="button"
              key={status}
              className={statusFilter === status ? "is-active" : ""}
              onClick={() => setStatusFilter(status)}
            >
              {status === "all" ? "Semua" : getStatusText(status)}
            </button>
          ))}
        </div>

        <label className="calendar-filter-select">
          <Filter size={18} />
          <span>Jam</span>
          <select value={timeFilter} onChange={(event) => setTimeFilter(event.target.value)}>
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="calendar-recommendations" aria-label="Slot rekomendasi">
        {recommendedSlots.length > 0 ? (
          recommendedSlots.map((slot) => (
            <Link to={slot.bookingHref} className="calendar-recommendation" key={`${slot.date}-${slot.time}`}>
              <span>{slot.day.longLabel}</span>
              <strong>{slot.time}</strong>
              <small>Booking slot ini</small>
            </Link>
          ))
        ) : (
          <div className="calendar-empty-state">
            <strong>Tidak ada slot yang cocok.</strong>
            <span>Ubah filter status atau jam untuk melihat opsi lain.</span>
          </div>
        )}
      </div>

      <div className="calendar-day-strip" aria-label="Ringkasan harian">
        {dailyAvailability.map((day) => (
          <button
            type="button"
            key={day.value}
            className={day.isToday ? "is-today" : ""}
            onClick={() => setAnchorDate(day.date)}
          >
            <strong>{day.dayName}</strong>
            <span>{day.availableCount} slot</span>
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
        <div
          className="public-calendar-grid"
          style={{ "--calendar-row-count": filteredTimeSlots.length }}
        >
          <div className="calendar-corner">Jam</div>

          {weekDays.map((day) => (
            <div className={`calendar-day-head ${day.isToday ? "is-today" : ""}`} key={day.value}>
              <strong>{day.dayName}</strong>
              <span>{day.label}</span>
            </div>
          ))}

          {filteredTimeSlots.map((time) => (
            <div className="calendar-row-fragment" key={time}>
              <div className="calendar-time-cell">{time}</div>

              {weekDays.map((day) => {
                const slot = createSlot(day, time);
                const isHidden = statusFilter !== "all" && slot.status !== statusFilter;

                if (slot.isAvailable) {
                  return (
                    <Link
                      to={slot.bookingHref}
                      className={`calendar-slot-cell status-${slot.status} ${isHidden ? "is-filtered-out" : ""}`}
                      key={`${day.value}-${time}`}
                      aria-label={`Booking ${day.longLabel} jam ${time}`}
                    >
                      <span>{getStatusText(slot.status)}</span>
                      <small>{slot.label}</small>
                    </Link>
                  );
                }

                return (
                  <div
                    className={`calendar-slot-cell status-${slot.status} ${isHidden ? "is-filtered-out" : ""}`}
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
        {weekDays.map((day) => {
          const daySlots = filteredTimeSlots
            .map((time) => createSlot(day, time))
            .filter((slot) => statusFilter === "all" || slot.status === statusFilter);

          if (daySlots.length === 0) {
            return null;
          }

          return (
            <article className="calendar-mobile-day" key={day.value}>
              <div className="calendar-mobile-day-head">
                <strong>{day.dayName}, {day.label}</strong>
                {day.isToday && <span>Hari ini</span>}
              </div>

              <div className="calendar-mobile-slots">
                {daySlots.map((slot) => {
                  if (slot.isAvailable) {
                    return (
                      <Link
                        to={slot.bookingHref}
                        className={`mobile-slot-card status-${slot.status}`}
                        key={slot.time}
                      >
                        <span>{slot.time}</span>
                        <strong>{getStatusText(slot.status)}</strong>
                      </Link>
                    );
                  }

                  return (
                    <div className={`mobile-slot-card status-${slot.status}`} key={slot.time}>
                      <span>{slot.time}</span>
                      <strong>{getStatusText(slot.status)}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
