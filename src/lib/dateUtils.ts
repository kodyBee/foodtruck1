// Date utility functions for truck location features

export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
export const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

/**
 * Parse a date string (YYYY-MM-DD) into a Date object in local timezone
 * @param dateString - Date string in format YYYY-MM-DD
 * @returns Date object with time set to midnight local time
 */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get a Date object representing today at midnight in local timezone
 */
export function getTodayAtMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Format a date string for display
 */
export function formatDateForDisplay(dateString: string): string {
  return parseDateString(dateString).toLocaleDateString();
}

/**
 * Format a date for calendar events (removes special characters)
 */
export function formatDateForCalendar(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d+/g, "");
}

/**
 * Parse time string (e.g., "11:00 AM") and apply to date
 */
export function applyTimeToDate(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(part => {
    const cleaned = part.replace(/[^\d]/g, '');
    return parseInt(cleaned, 10);
  });
  
  const isPM = timeString.toLowerCase().includes('pm') && hours !== 12;
  const isAM = timeString.toLowerCase().includes('am') && hours === 12;
  
  const resultDate = new Date(date);
  resultDate.setHours(isPM ? hours + 12 : (isAM ? 0 : hours));
  resultDate.setMinutes(minutes || 0);
  resultDate.setSeconds(0, 0);
  
  return resultDate;
}

/**
 * Check if a date string represents today
 */
export function isDateToday(dateString: string): boolean {
  const eventDate = parseDateString(dateString);
  const today = getTodayAtMidnight();
  return eventDate.getTime() === today.getTime();
}

/**
 * Check if a date is within the next week
 */
export function isDateWithinWeek(dateString: string): boolean {
  const eventDate = parseDateString(dateString);
  const today = getTodayAtMidnight();
  const oneWeekFromNow = new Date(today.getTime() + ONE_WEEK_MS);
  
  return eventDate >= today && eventDate <= oneWeekFromNow;
}

/**
 * Convert 24-hour time format to 12-hour am/pm format
 * Handles various input formats: "14:30", "2:30 PM", "14:30:00", etc.
 */
export function formatTimeTo12Hour(timeString: string): string {
  // If already in 12-hour format (contains AM/PM), return as is
  if (/am|pm/i.test(timeString)) {
    return timeString;
  }

  // Parse the time string to extract hours and minutes
  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = timeParts[1] || '00';

  // Convert to 12-hour format
  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${hour12}:${minutes}${period}`;
}
