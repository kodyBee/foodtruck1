import type { TruckEvent } from '@/types';
import { applyTimeToDate, formatDateForCalendar, parseDateString, TWO_HOURS_MS } from './dateUtils';

interface CalendarEventOptions {
  title: string;
  date: string;
  time?: string;
  location: string;
  description?: string;
}

/**
 * Generate Google Calendar URL for an event
 */
export function generateCalendarUrl(event: CalendarEventOptions): string {
  const eventDate = parseDateString(event.date);
  
  // Apply time if provided, otherwise default to 11:00 AM
  const startDate = event.time 
    ? applyTimeToDate(eventDate, event.time)
    : new Date(eventDate.setHours(11, 0, 0, 0));
  
  const startTime = formatDateForCalendar(startDate);
  
  // Assume 2 hour duration
  const endDate = new Date(startDate.getTime() + TWO_HOURS_MS);
  const endTime = formatDateForCalendar(endDate);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} @ Crown Majestic Kitchen`,
    dates: `${startTime}/${endTime}`,
    details: event.description || "Visit us at Crown Majestic Kitchen!",
    location: event.location
  });
  
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

/**
 * Open calendar event in new window
 */
export function addToCalendar(event: TruckEvent): void {
  const url = generateCalendarUrl(event);
  window.open(url, '_blank', 'noopener,noreferrer');
}
