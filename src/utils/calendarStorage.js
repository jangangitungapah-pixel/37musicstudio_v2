import { publicCalendarEvents } from "../data/publicCalendar.js";

export const CALENDAR_STORAGE_KEY = "37musicstudio_calendar_events_v1";

export function getCalendarEvents() {
  if (typeof window === "undefined") {
    return publicCalendarEvents;
  }

  const stored = window.localStorage.getItem(CALENDAR_STORAGE_KEY);

  if (!stored) {
    window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(publicCalendarEvents));
    return publicCalendarEvents;
  }

  try {
    return JSON.parse(stored);
  } catch {
    window.localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(publicCalendarEvents));
    return publicCalendarEvents;
  }
}
