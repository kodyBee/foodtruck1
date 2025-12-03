import type { CategorizedEvent } from '@/lib/eventUtils';
import { formatDateForDisplay } from '@/lib/dateUtils';
import { addToCalendar } from '@/lib/calendarUtils';

interface EventCardProps {
  event: CategorizedEvent;
  showAddToCalendar?: boolean;
}

export default function EventCard({ event, showAddToCalendar = true }: EventCardProps) {
  const dayOfWeek = new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' });
  const locationDisplay = event.locationName || event.location;

  return (
    <div className="glass-card glass-card-border shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center hover:shadow-yellow-900/30 transition-all duration-300">
      <div className="flex flex-col items-center w-full">
        <div className="text-4xl font-black glass-text-heading tracking-widest mb-2 drop-shadow-lg uppercase">
          {dayOfWeek}
        </div>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-3"></div>
        <div className="text-xl font-bold glass-text-subheading text-center mb-2">
          {event.title}
        </div>
        <div className="text-md glass-text-body flex items-center gap-2 mb-1">
          <span className="text-lg" aria-hidden="true">📅</span>
          <time dateTime={event.date}>{formatDateForDisplay(event.date)}</time>
        </div>
        {event.time && (
          <div className="text-md glass-text-body flex items-center gap-2 mb-1">
            <span className="text-lg" aria-hidden="true">🕒</span>
            <time>{event.time}</time>
          </div>
        )}
        <div className="text-md glass-text-body flex items-center gap-2 mb-1">
          <span className="text-lg" aria-hidden="true">📍</span>
          <span>{locationDisplay}</span>
        </div>
        {event.description && (
          <div className="text-sm glass-text-body italic mb-2 text-center">
            {event.description}
          </div>
        )}
        <div className="flex gap-2 mt-3 flex-wrap justify-center">
          {showAddToCalendar && (
            <button 
              onClick={() => addToCalendar(event)}
              className="px-4 py-1.5 rounded-full glass-button text-black font-semibold shadow hover:scale-105 transition-all flex items-center gap-1.5 text-sm border border-yellow-400"
              aria-label={`Add ${event.title} to Google Calendar`}
            >
              <span aria-hidden="true">📅</span>
              <span>Add to Calendar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
