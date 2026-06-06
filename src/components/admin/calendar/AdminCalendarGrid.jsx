import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { publicCalendarRooms } from "../../../data/publicCalendar.js";
import {
  addCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents,
  updateCalendarEvent,
} from "../../../utils/calendarStorage.js";
import AdminBookingModal from "./AdminBookingModal.jsx";
import AdminBookingDetailModal from "./AdminBookingDetailModal.jsx";

const viewOptions = [
  { value: "day", label: "Hari" },
  { value: "week", label: "Minggu" },
  { value: "month", label: "Bulan" },
];
const statusFilterOptions = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "booked", label: "Booked" },
  { value: "maintenance", label: "Maintenance" },
  { value: "blocked", label: "Blocked" },
  { value: "cancelled", label: "Batal" },
];

const paymentFilterOptions = [
  { value: "all", label: "Semua" },
  { value: "unpaid", label: "Belum Bayar" },
  { value: "down_payment", label: "DP" },
  { value: "paid", label: "Lunas" },
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

function formatCurrencyCompact(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

function getEventStartTime(time) {
  if (!time) {
    return "";
  }

  return time.split(" - ")[0].trim();
}

function getEventEndTime(time) {
  if (!time || !time.includes(" - ")) {
    return "";
  }

  return time.split(" - ")[1].trim();
}

function getHourNumber(time) {
  return Number.parseInt(String(time || "0").split(".")[0], 10);
}

function getEventDurationSpan(event) {
  const startHour = getHourNumber(getEventStartTime(event.time));
  const endTime = getEventEndTime(event.time);
  const endHour = endTime ? getHourNumber(endTime) : startHour + 1;

  return Math.max(1, endHour - startHour);
}

function formatHourLabel(hourNumber) {
  return `${String(Math.min(Math.max(hourNumber, 0), 23)).padStart(2, "0")}.00`;
}

function getEventTimeRange(event) {
  const startHour = getHourNumber(getEventStartTime(event.time));
  const endTime = getEventEndTime(event.time);
  const parsedEndHour = endTime ? getHourNumber(endTime) : startHour + 1;

  return {
    startHour,
    endHour: Math.max(startHour + 1, parsedEndHour),
  };
}

function getPatchTimeRange(patch) {
  const startHour = getHourNumber(getEventStartTime(patch.time));
  const endTime = getEventEndTime(patch.time);
  const parsedEndHour = endTime ? getHourNumber(endTime) : startHour + 1;

  return {
    startHour,
    endHour: Math.max(startHour + 1, parsedEndHour),
  };
}

function hasTimeOverlap(firstRange, secondRange) {
  return firstRange.startHour < secondRange.endHour && secondRange.startHour < firstRange.endHour;
}

function getCalendarSlotFromPoint(clientX, clientY) {
  const dayHeaders = Array.from(document.querySelectorAll("[data-calendar-day]"));
  const hourCells = Array.from(document.querySelectorAll("[data-calendar-hour]"));

  const dayTarget = dayHeaders.find((element) => {
    const rect = element.getBoundingClientRect();

    return clientX >= rect.left && clientX <= rect.right;
  });

  const hourTarget = hourCells.find((element) => {
    const rect = element.getBoundingClientRect();

    return clientY >= rect.top && clientY <= rect.bottom;
  });

  if (dayTarget?.dataset?.calendarDay && hourTarget?.dataset?.calendarHour) {
    return {
      date: dayTarget.dataset.calendarDay,
      hour: hourTarget.dataset.calendarHour,
    };
  }

  const elementsAtPoint = document.elementsFromPoint(clientX, clientY);

  const target = elementsAtPoint
    .map((element) => element?.closest?.("[data-calendar-slot='true']"))
    .find(Boolean);

  if (!target?.dataset?.date || !target?.dataset?.hour) {
    return null;
  }

  return {
    date: target.dataset.date,
    hour: target.dataset.hour,
  };
}


function getTimeRangeFromEvent(event) {
  const startHour = getHourNumber(getEventStartTime(event.time));
  const endTime = getEventEndTime(event.time);
  const endHour = endTime ? getHourNumber(endTime) : startHour + 1;

  return {
    startHour,
    endHour: Math.max(startHour + 1, endHour),
  };
}

function getTimeRangeFromPayload(payload) {
  const startHour = getHourNumber(payload.startTime);
  const endHour = getHourNumber(payload.endTime);

  return {
    startHour,
    endHour: Math.max(startHour + 1, endHour),
  };
}

function isCellCoveredByPreviousSpan(events, { date, hour, room }) {
  const currentHour = getHourNumber(hour);

  return events.some((event) => {
    const matchDate = event.date === date;
    const matchRoom = room === "all" || event.room === room;

    if (!matchDate || !matchRoom) {
      return false;
    }

    const startHour = getHourNumber(getEventStartTime(event.time));
    const span = getEventDurationSpan(event);
    const endHour = startHour + span;

    return currentHour > startHour && currentHour < endHour;
  });
}

function getStatusLabel(status) {
  const map = {
    available: "Tersedia",
    pending: "Pending",
    booked: "Booked",
    maintenance: "Maintenance",
    blocked: "Blocked",
  };

  return map[status] || status;
}

function eventMatchesSearch(event, query) {
  if (!query) {
    return true;
  }

  const haystack = [
    event.customerName,
    event.customerPhone,
    event.packageName,
    event.label,
    event.room,
    event.sessionCategory,
    event.customerNote,
    event.adminNote,
    event.paymentStatus,
    event.status,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}


function getPaymentShortLabel(paymentStatus) {
  const map = {
    unpaid: "Unpaid",
    down_payment: "DP",
    paid: "Lunas",
    refund: "Refund",
  };

  return map[paymentStatus] || "Unpaid";
}

function getEventsForCell(events, { date, hour, room }) {
  return events.filter((event) => {
    const matchDate = event.date === date;
    const matchHour = getEventStartTime(event.time) === hour;
    const matchRoom = room === "all" || event.room === room;

    return matchDate && matchHour && matchRoom;
  });
}

function getColumnsForView(viewMode, activeDate) {
  if (viewMode === "day") {
    return [activeDate].map((date) => ({
      date,
      value: toDateInputValue(date),
      dayName: dayNames[date.getDay()],
      label: formatDateShort(date),
      isToday: toDateInputValue(date) === toDateInputValue(new Date()),
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [events, setEvents] = useState(() => getCalendarEvents());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null);
  const dragActionRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [dragFeedback, setDragFeedback] = useState(null);
  const [dragGhost, setDragGhost] = useState(null);
  const [dropPreview, setDropPreview] = useState(null);

  const roomOptions = useMemo(() => ["all", ...publicCalendarRooms], []);

  const columns = useMemo(() => {
    return getColumnsForView(viewMode, activeDate);
  }, [viewMode, activeDate]);

  const rangeLabel = useMemo(() => {
    return getRangeLabel(viewMode, activeDate, columns);
  }, [viewMode, activeDate, columns]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim();

    return events.filter((event) => {
      const paymentStatus = event.paymentStatus || "unpaid";
      const matchesSearch = eventMatchesSearch(event, query);
      const matchesStatus = selectedStatus === "all" || event.status === selectedStatus;
      const matchesPayment = selectedPayment === "all" || paymentStatus === selectedPayment;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [events, searchQuery, selectedStatus, selectedPayment]);

  const visibleSummary = useMemo(() => {
    const visibleDates = new Set(columns.map((column) => column.value));

    const visibleEvents = filteredEvents.filter((event) => visibleDates.has(event.date));
    const activeBookings = visibleEvents.filter((event) => event.status !== "cancelled");

    const totalBookings = activeBookings.length;
    const pendingBookings = activeBookings.filter((event) => event.status === "pending").length;
    const downPaymentBookings = activeBookings.filter(
      (event) => event.paymentStatus === "down_payment"
    ).length;
    const paidBookings = activeBookings.filter((event) => event.paymentStatus === "paid").length;

    const estimatedIncome = activeBookings.reduce((total, event) => {
      return total + Number(event.price || 0);
    }, 0);

    return {
      totalBookings,
      pendingBookings,
      downPaymentBookings,
      paidBookings,
      estimatedIncome,
    };
  }, [columns, filteredEvents]);



  const gridColumnStyle = useMemo(() => {
    return {
      gridTemplateColumns: `92px repeat(${columns.length}, minmax(132px, 1fr))`,
    };
  }, [columns.length]);

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
    setSelectedEvent(null);
    setSelectedSlot({
      date,
      dateLabel,
      dayName,
      hour,
      room: selectedRoom === "all" ? publicCalendarRooms[0] : selectedRoom,
    });
  }

  function handleOpenDetailModal(event) {
    setSelectedSlot(null);
    setSelectedEvent(null);
    setSelectedDetailEvent(event);
  }

  function handleOpenEditModal(event) {
    setSelectedSlot(null);
    setSelectedDetailEvent(null);
    setSelectedEvent(event);
  }

  function handleEditFromDetail() {
    setSelectedEvent(selectedDetailEvent);
    setSelectedDetailEvent(null);
  }

  function closeModal() {
    setSelectedSlot(null);
    setSelectedEvent(null);
    setSelectedDetailEvent(null);
  }

  function getDropPreviewForSlot(bookingEvent, targetSlot) {
    if (!targetSlot) {
      return null;
    }

    const columnIndex = columns.findIndex((column) => column.value === targetSlot.date);
    const hourIndex = adminCalendarHours.indexOf(targetSlot.hour);

    if (columnIndex < 0 || hourIndex < 0) {
      return null;
    }

    const span = getEventDurationSpan(bookingEvent);
    const patch = buildMovePatch(bookingEvent, targetSlot);

    if (!patch) {
      return null;
    }

    const conflict = findMoveConflict(bookingEvent, patch);

    return {
      date: targetSlot.date,
      hour: targetSlot.hour,
      span,
      isConflict: Boolean(conflict),
      gridColumn: columnIndex + 2,
      gridRow: `${hourIndex + 2} / span ${span}`,
    };
  }

  function buildDragGhost(bookingEvent, pointerEvent, targetSlot) {
    const patch = targetSlot ? buildMovePatch(bookingEvent, targetSlot) : null;
    const preview = targetSlot ? getDropPreviewForSlot(bookingEvent, targetSlot) : null;

    return {
      x: pointerEvent.clientX,
      y: pointerEvent.clientY,
      label: bookingEvent.label || bookingEvent.packageName || bookingEvent.customerName || "Booking",
      room: bookingEvent.room,
      time: patch?.time || bookingEvent.time,
      hours: getEventDurationSpan(bookingEvent),
      isConflict: Boolean(preview?.isConflict),
    };
  }

  function showDragFeedback(feedback) {
    setDragFeedback(feedback);
    window.clearTimeout(showDragFeedback.timeoutId);

    showDragFeedback.timeoutId = window.setTimeout(() => {
      setDragFeedback(null);
    }, feedback.type === "error" ? 2600 : 1400);
  }

  function buildMovePatch(bookingEvent, targetSlot) {
    const duration = getEventDurationSpan(bookingEvent);
    const startHour = getHourNumber(targetSlot.hour);
    const endHour = Math.min(startHour + duration, 23);

    if (!targetSlot.date || !targetSlot.hour || endHour <= startHour) {
      return null;
    }

    return {
      date: targetSlot.date,
      time: `${targetSlot.hour} - ${formatHourLabel(endHour)}`,
    };
  }

  function findMoveConflict(bookingEvent, patch) {
    const patchRange = getPatchTimeRange(patch);

    return events.find((event) => {
      const isSameEvent = event.id === bookingEvent.id;
      const sameDate = event.date === patch.date;
      const sameRoom = event.room === bookingEvent.room;
      const isCancelled = event.status === "cancelled";

      if (isSameEvent || isCancelled || !sameDate || !sameRoom) {
        return false;
      }

      return hasTimeOverlap(patchRange, getEventTimeRange(event));
    });
  }

  function moveBookingToSlot(bookingEvent, targetSlot) {
    const patch = buildMovePatch(bookingEvent, targetSlot);

    if (!patch) {
      showDragFeedback({
        type: "error",
        title: "Move gagal",
        text: "Target slot tidak valid.",
      });
      return;
    }

    const currentStart = getEventStartTime(bookingEvent.time);

    if (bookingEvent.date === patch.date && currentStart === targetSlot.hour) {
      return;
    }

    const conflict = findMoveConflict(bookingEvent, patch);

    if (conflict) {
      showDragFeedback({
        type: "error",
        title: "Jadwal bentrok",
        text: `${conflict.label || conflict.packageName || conflict.customerName || "Booking lain"} · ${conflict.time}`,
      });
      return;
    }

    const nextEvents = updateCalendarEvent(bookingEvent.id, patch);
    const nextEvent = nextEvents.find((event) => event.id === bookingEvent.id);

    setEvents(nextEvents);
    setSelectedDetailEvent((current) => (current?.id === bookingEvent.id ? nextEvent : current));

    showDragFeedback({
      type: "success",
      title: "Jadwal dipindah",
      text: `${patch.date} · ${patch.time}`,
    });
  }

  function buildResizePatch(bookingEvent, targetSlot) {
    if (!targetSlot?.hour || targetSlot.date !== bookingEvent.date) {
      return null;
    }

    const startTime = getEventStartTime(bookingEvent.time);
    const startHour = getHourNumber(startTime);
    const targetHour = getHourNumber(targetSlot.hour);
    const endHour = Math.max(startHour + 1, Math.min(targetHour + 1, 23));

    return {
      time: `${startTime} - ${formatHourLabel(endHour)}`,
    };
  }

  function findResizeConflict(bookingEvent, patch) {
    const patchRange = getPatchTimeRange(patch);

    return events.find((event) => {
      const isSameEvent = event.id === bookingEvent.id;
      const sameDate = event.date === bookingEvent.date;
      const sameRoom = event.room === bookingEvent.room;
      const isCancelled = event.status === "cancelled";

      if (isSameEvent || isCancelled || !sameDate || !sameRoom) {
        return false;
      }

      return hasTimeOverlap(patchRange, getEventTimeRange(event));
    });
  }

  function getResizePreviewForSlot(bookingEvent, targetSlot) {
    if (!targetSlot || targetSlot.date !== bookingEvent.date) {
      return null;
    }

    const columnIndex = columns.findIndex((column) => column.value === bookingEvent.date);
    const startHour = getHourNumber(getEventStartTime(bookingEvent.time));
    const startHourLabel = formatHourLabel(startHour);
    const startHourIndex = adminCalendarHours.indexOf(startHourLabel);
    const patch = buildResizePatch(bookingEvent, targetSlot);

    if (columnIndex < 0 || startHourIndex < 0 || !patch) {
      return null;
    }

    const patchRange = getPatchTimeRange(patch);
    const span = Math.max(1, patchRange.endHour - patchRange.startHour);
    const conflict = findResizeConflict(bookingEvent, patch);

    return {
      date: bookingEvent.date,
      hour: startHourLabel,
      span,
      label: conflict ? "Bentrok" : "Resize",
      isConflict: Boolean(conflict),
      gridColumn: columnIndex + 2,
      gridRow: `${startHourIndex + 2} / span ${span}`,
    };
  }

  function buildResizeGhost(bookingEvent, pointerEvent, targetSlot) {
    const patch = targetSlot ? buildResizePatch(bookingEvent, targetSlot) : null;
    const preview = targetSlot ? getResizePreviewForSlot(bookingEvent, targetSlot) : null;

    return {
      x: pointerEvent.clientX,
      y: pointerEvent.clientY,
      label: bookingEvent.label || bookingEvent.packageName || bookingEvent.customerName || "Booking",
      room: bookingEvent.room,
      time: patch?.time || bookingEvent.time,
      hours: preview?.span || getEventDurationSpan(bookingEvent),
      isConflict: Boolean(preview?.isConflict),
    };
  }

  function resizeBookingToSlot(bookingEvent, targetSlot) {
    const patch = buildResizePatch(bookingEvent, targetSlot);

    if (!patch) {
      showDragFeedback({
        type: "error",
        title: "Resize gagal",
        text: "Tarik handle di tanggal yang sama.",
      });
      return;
    }

    if (patch.time === bookingEvent.time) {
      return;
    }

    const conflict = findResizeConflict(bookingEvent, patch);

    if (conflict) {
      showDragFeedback({
        type: "error",
        title: "Jadwal bentrok",
        text: `${conflict.label || conflict.packageName || conflict.customerName || "Booking lain"} · ${conflict.time}`,
      });
      return;
    }

    const nextEvents = updateCalendarEvent(bookingEvent.id, patch);
    const nextEvent = nextEvents.find((event) => event.id === bookingEvent.id);

    setEvents(nextEvents);
    setSelectedDetailEvent((current) => (current?.id === bookingEvent.id ? nextEvent : current));

    showDragFeedback({
      type: "success",
      title: "Durasi diubah",
      text: patch.time,
    });
  }

  function handleResizePointerDown(pointerEvent, bookingEvent) {
    if (pointerEvent.button !== 0) {
      return;
    }

    pointerEvent.preventDefault();
    pointerEvent.stopPropagation();

    const sourceElement = pointerEvent.currentTarget.closest(".admin-time-slot-cell.has-event");

    try {
      pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
    } catch {
      // Browser may reject pointer capture in edge cases.
    }

    sourceElement?.classList.add("is-resize-source");

    const pointerStartX = pointerEvent.clientX;
    const pointerStartY = pointerEvent.clientY;

    dragActionRef.current = {
      type: "resize",
      bookingEvent,
      pointerStartX,
      pointerStartY,
      hasMoved: false,
    };

    setDragGhost(buildResizeGhost(bookingEvent, pointerEvent, null));
    setDropPreview(null);

    const handlePointerMove = (moveEvent) => {
      const action = dragActionRef.current;

      if (!action) {
        return;
      }

      const distanceX = Math.abs(moveEvent.clientX - action.pointerStartX);
      const distanceY = Math.abs(moveEvent.clientY - action.pointerStartY);
      const hasMovedEnough = distanceX > 3 || distanceY > 3;

      if (!hasMovedEnough) {
        return;
      }

      action.hasMoved = true;
      suppressClickRef.current = true;
      document.body.classList.add("is-admin-calendar-resizing");

      const targetSlot = getCalendarSlotFromPoint(moveEvent.clientX, moveEvent.clientY);
      const preview = getResizePreviewForSlot(action.bookingEvent, targetSlot);

      setDropPreview(preview);
      setDragGhost(buildResizeGhost(action.bookingEvent, moveEvent, targetSlot));

      setDragFeedback({
        type: preview?.isConflict ? "error" : "resize",
        title: preview?.isConflict ? "Slot bentrok" : "Ubah durasi",
        text: preview ? `${preview.date} · ${preview.span} jam` : "Tarik di tanggal yang sama",
      });
    };

    const handlePointerUp = (upEvent) => {
      const action = dragActionRef.current;

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.classList.remove("is-admin-calendar-resizing");
      sourceElement?.classList.remove("is-resize-source");

      try {
        pointerEvent.currentTarget.releasePointerCapture(upEvent.pointerId);
      } catch {
        // Ignore release failures.
      }

      dragActionRef.current = null;
      setDragGhost(null);
      setDropPreview(null);

      if (!action?.hasMoved) {
        window.setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
        return;
      }

      const targetSlot = getCalendarSlotFromPoint(upEvent.clientX, upEvent.clientY);

      if (targetSlot) {
        resizeBookingToSlot(action.bookingEvent, targetSlot);
      }

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function handleEventPointerDown(pointerEvent, bookingEvent) {
    if (pointerEvent.button !== 0) {
      return;
    }

    pointerEvent.preventDefault();

    try {
      pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
    } catch {
      // Browser may reject pointer capture in edge cases.
    }

    const sourceElement = pointerEvent.currentTarget;
    sourceElement.classList.add("is-drag-source");

    const pointerStartX = pointerEvent.clientX;
    const pointerStartY = pointerEvent.clientY;

    dragActionRef.current = {
      bookingEvent,
      pointerStartX,
      pointerStartY,
      hasMoved: false,
    };

    const handlePointerMove = (moveEvent) => {
      const action = dragActionRef.current;

      if (!action) {
        return;
      }

      const distanceX = Math.abs(moveEvent.clientX - action.pointerStartX);
      const distanceY = Math.abs(moveEvent.clientY - action.pointerStartY);
      const hasMovedEnough = distanceX > 3 || distanceY > 3;

      if (!hasMovedEnough) {
        return;
      }

      action.hasMoved = true;
      suppressClickRef.current = true;
      document.body.classList.add("is-admin-calendar-dragging");

      const targetSlot = getCalendarSlotFromPoint(moveEvent.clientX, moveEvent.clientY);
      const preview = getDropPreviewForSlot(action.bookingEvent, targetSlot);

      setDropPreview(preview);
      setDragGhost(buildDragGhost(action.bookingEvent, moveEvent, targetSlot));

      setDragFeedback({
        type: preview?.isConflict ? "error" : "move",
        title: preview?.isConflict ? "Slot bentrok" : "Pindah jadwal",
        text: targetSlot ? `${targetSlot.date} · ${targetSlot.hour}` : "Arahkan ke slot tujuan",
      });
    };

    const handlePointerUp = (upEvent) => {
      const action = dragActionRef.current;

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.classList.remove("is-admin-calendar-dragging");
      sourceElement.classList.remove("is-drag-source");

      try {
        sourceElement.releasePointerCapture(upEvent.pointerId);
      } catch {
        // Ignore release failures.
      }

      dragActionRef.current = null;
      setDragGhost(null);
      setDropPreview(null);

      if (!action?.hasMoved) {
        return;
      }

      const targetSlot = getCalendarSlotFromPoint(upEvent.clientX, upEvent.clientY);

      if (targetSlot) {
        moveBookingToSlot(action.bookingEvent, targetSlot);
      }

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function handleEventClick(clickEvent, bookingEvent) {
    if (suppressClickRef.current) {
      clickEvent.preventDefault();
      clickEvent.stopPropagation();
      return;
    }

    handleOpenDetailModal(bookingEvent);
  }

  function handleSaveModalBooking(payload) {
    const time = payload.startTime + " - " + payload.endTime;

    const payloadRange = getTimeRangeFromPayload(payload);

    const conflictingEvent = events.find((event) => {
      const isSameEvent = selectedEvent && event.id === selectedEvent.id;
      const sameDate = event.date === payload.date;
      const sameRoom = event.room === payload.room;

      if (isSameEvent || !sameDate || !sameRoom) {
        return false;
      }

      return hasTimeOverlap(payloadRange, getTimeRangeFromEvent(event));
    });

    if (conflictingEvent) {
      const conflictTitle =
        conflictingEvent.label ||
        conflictingEvent.packageName ||
        conflictingEvent.customerName ||
        "booking lain";

      alert(
        `Jadwal bentrok dengan "${conflictTitle}" (${conflictingEvent.time}) di ${conflictingEvent.room}.`
      );
      return;
    }

    if (selectedEvent) {
      const nextEvents = updateCalendarEvent(selectedEvent.id, {
        ...payload,
        time,
      });

      setEvents(nextEvents);
      setSelectedEvent(null);
      return;
    }

    const nextEvents = addCalendarEvent({
      ...payload,
      time,
    });

    setEvents(nextEvents);
    setSelectedSlot(null);
  }

  function handleDeleteModalBooking() {
    if (!selectedEvent) {
      return;
    }

    const nextEvents = deleteCalendarEvent(selectedEvent.id);
    setEvents(nextEvents);
    setSelectedEvent(null);
  }

  function handleQuickUpdateFromDetail(patch) {
    if (!selectedDetailEvent) {
      return;
    }

    const nextEvents = updateCalendarEvent(selectedDetailEvent.id, patch);
    const nextEvent = nextEvents.find((event) => event.id === selectedDetailEvent.id);

    setEvents(nextEvents);
    setSelectedDetailEvent(nextEvent || null);
  }

  return (
    <section className="admin-calendar-grid-shell">
      <div className="admin-calendar-grid-toolbar">
        <div>
          <p className="section-eyebrow">Jadwal Studio</p>
          <h2>{rangeLabel}</h2>
          <span>
            Atur booking, status, dan pembayaran per room.
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

      <div className="admin-calendar-summary-row">
        <article>
          <span>Total Jadwal</span>
          <strong>{visibleSummary.totalBookings}</strong>
          <small>{rangeLabel}</small>
        </article>

        <article>
          <span>Pending</span>
          <strong>{visibleSummary.pendingBookings}</strong>
          <small>Perlu follow-up</small>
        </article>

        <article>
          <span>DP</span>
          <strong>{visibleSummary.downPaymentBookings}</strong>
          <small>Belum lunas</small>
        </article>

        <article>
          <span>Lunas</span>
          <strong>{visibleSummary.paidBookings}</strong>
          <small>Sudah lunas</small>
        </article>

        <article>
          <span>Estimasi Omzet</span>
          <strong>{formatCurrencyCompact(visibleSummary.estimatedIncome)}</strong>
          <small>Booking aktif</small>
        </article>
      </div>

      <div className="admin-calendar-filter-bar">
        <label className="admin-calendar-search-box">
          <span>Cari</span>
          <input
            value={searchQuery}
            placeholder="Cari nama, WA, paket..."
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        <div className="admin-calendar-filter-group">
          <span>Status</span>
          <div>
            {statusFilterOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={selectedStatus === option.value ? "is-active" : ""}
                onClick={() => setSelectedStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-calendar-filter-group">
          <span>Pembayaran</span>
          <div>
            {paymentFilterOptions.map((option) => (
              <button
                type="button"
                key={option.value}
                className={selectedPayment === option.value ? "is-active" : ""}
                onClick={() => setSelectedPayment(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-calendar-status-row">
        <span><i className="status-dot status-available" /> Tersedia</span>
        <span><i className="status-dot status-pending" /> Pending</span>
        <span><i className="status-dot status-booked" /> Booked</span>
        <span><i className="status-dot status-maintenance" /> Maintenance</span>
        <span><i className="status-dot status-cancelled" /> Cancelled</span>
        <span><i className="payment-dot payment-down_payment" /> DP</span>
        <span><i className="payment-dot payment-paid" /> Lunas</span>
      </div>

      {dragGhost && (
        <div
          className={`admin-calendar-drag-ghost ${dragGhost.isConflict ? "is-conflict" : ""}`}
          style={{
            "--ghost-x": `${dragGhost.x}px`,
            "--ghost-y": `${dragGhost.y}px`,
            "--ghost-hours": dragGhost.hours,
          }}
        >
          <strong>{dragGhost.label}</strong>
          <span>{dragGhost.room} · {dragGhost.time}</span>
        </div>
      )}

      {dragFeedback && (
        <div className={`admin-calendar-drag-feedback is-${dragFeedback.type}`}>
          <strong>{dragFeedback.title}</strong>
          <span>{dragFeedback.text}</span>
        </div>
      )}

      <div className={`admin-time-calendar-scroll view-${viewMode}`}>
        <div className="admin-time-calendar-grid" style={gridColumnStyle}>
          <div
            className="admin-time-corner"
            style={{
              gridColumn: 1,
              gridRow: 1,
            }}
          >
            Jam
          </div>

          {columns.map((column, columnIndex) => (
            <div
              className={`admin-time-day-head ${column.isToday ? "is-today" : ""}`}
              key={column.value}
              data-calendar-day={column.value}
              style={{
                gridColumn: columnIndex + 2,
                gridRow: 1,
              }}
            >
              <strong>{column.dayName}</strong>
              <span>{column.label}</span>
            </div>
          ))}

          {dropPreview && (
            <div
              className={`admin-calendar-drop-guide ${dropPreview.isConflict ? "is-conflict" : ""}`}
              style={{
                gridColumn: dropPreview.gridColumn,
                gridRow: dropPreview.gridRow,
              }}
            >
              <span>{dropPreview.label || (dropPreview.isConflict ? "Bentrok" : "Drop")}</span>
            </div>
          )}

          {adminCalendarHours.map((hour, hourIndex) => (
            <div className="admin-time-row" key={hour}>
              <div
                className="admin-time-hour-cell"
                  data-calendar-hour={hour}
                  style={{
                  gridColumn: 1,
                  gridRow: hourIndex + 2,
                }}
              >
                {hour}
              </div>

              {columns.map((column, columnIndex) => {
                const slotEvents = getEventsForCell(filteredEvents, {
                  date: column.value,
                  hour,
                  room: selectedRoom,
                });

                const isCoveredByPreviousEvent = isCellCoveredByPreviousSpan(filteredEvents, {
                  date: column.value,
                  hour,
                  room: selectedRoom,
                });

                if (isCoveredByPreviousEvent) {
                  return null;
                }

                const eventSpan =
                  slotEvents.length > 0
                    ? Math.max(...slotEvents.map((event) => getEventDurationSpan(event)))
                    : 1;

                const cellGridStyle = {
                  gridColumn: columnIndex + 2,
                  gridRow: `${hourIndex + 2} / span ${eventSpan}`,
                };

                if (slotEvents.length === 0) {
                  return (
                    <button
                      type="button"
                      className="admin-time-slot-cell is-empty"
                      key={column.value + "-" + hour}
                      style={cellGridStyle}
                      data-calendar-slot="true"
                      data-date={column.value}
                      data-hour={hour}
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
                    key={column.value + "-" + hour}
                    style={cellGridStyle}
                    data-calendar-slot="true"
                    data-date={column.value}
                    data-hour={hour}
                    onPointerDown={(pointerEvent) => handleEventPointerDown(pointerEvent, slotEvents[0])}
                    onClick={(clickEvent) => handleEventClick(clickEvent, slotEvents[0])}
                  >
                    {slotEvents.slice(0, 2).map((event) => (
                      <span className={`admin-time-event-pill status-${event.status} payment-${event.paymentStatus || "unpaid"}`} key={event.id}>
                        <strong>{event.label || getStatusLabel(event.status)}</strong>
                        <small>{event.room}</small>
                        <span className={`admin-event-payment-chip payment-${event.paymentStatus || "unpaid"}`}>
                          {getPaymentShortLabel(event.paymentStatus)}
                        </span>
                        <span
                          className="admin-time-resize-handle"
                          aria-hidden="true"
                          onPointerDown={(pointerEvent) => handleResizePointerDown(pointerEvent, event)}
                          onClick={(clickEvent) => {
                            clickEvent.preventDefault();
                            clickEvent.stopPropagation();
                          }}
                        />
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
      {selectedDetailEvent && (
        <AdminBookingDetailModal
          event={selectedDetailEvent}
          onClose={closeModal}
          onEdit={handleEditFromDetail}
          onQuickUpdate={handleQuickUpdateFromDetail}
        />
      )}
      {(selectedSlot || selectedEvent) && (
        <AdminBookingModal
          slot={selectedSlot || selectedEvent}
          defaultRoom={(selectedSlot || selectedEvent)?.room}
          mode={selectedEvent ? "edit" : "create"}
          initialEvent={selectedEvent}
          calendarEvents={events}
          onClose={closeModal}
          onSave={handleSaveModalBooking}
          onDelete={selectedEvent ? handleDeleteModalBooking : undefined}
        />
      )}
    </section>
  );
}
