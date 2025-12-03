import type { TruckEvent } from '@/types';
import { isDateWithinWeek, parseDateString, getTodayAtMidnight, ONE_WEEK_MS } from './dateUtils';

export type CategorizedEvent = Omit<TruckEvent, 'type'> & {
  type: 'this-week' | 'upcoming' | 'past';
};

/**
 * Categorize events based on their date relative to today
 */
export function categorizeEvents(events: TruckEvent[]): CategorizedEvent[] {
  const today = getTodayAtMidnight();
  const oneWeekFromNow = new Date(today.getTime() + ONE_WEEK_MS);
  
  return events.map(event => {
    const eventDate = parseDateString(event.date);
    
    if (eventDate >= today && eventDate <= oneWeekFromNow) {
      return { ...event, type: 'this-week' as const };
    }
    if (eventDate > oneWeekFromNow) {
      return { ...event, type: 'upcoming' as const };
    }
    return { ...event, type: 'past' as const };
  });
}

/**
 * Filter and sort events for "this week" view
 */
export function getThisWeekEvents(events: CategorizedEvent[]): CategorizedEvent[] {
  return events
    .filter(e => e.type === 'this-week')
    .sort((a, b) => parseDateString(a.date).getTime() - parseDateString(b.date).getTime());
}

/**
 * Filter and sort upcoming events (beyond this week)
 */
export function getUpcomingEvents(events: CategorizedEvent[]): CategorizedEvent[] {
  return events
    .filter(e => e.type === 'upcoming')
    .sort((a, b) => parseDateString(a.date).getTime() - parseDateString(b.date).getTime());
}

/**
 * Find the closest upcoming event
 */
export function getClosestEvent(events: CategorizedEvent[]): CategorizedEvent | null {
  const thisWeekEvents = getThisWeekEvents(events);
  return thisWeekEvents.length > 0 ? thisWeekEvents[0] : null;
}
