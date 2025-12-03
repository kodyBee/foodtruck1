import type { TruckEvent } from '@/types';
import EventCard from './EventCard';

interface EventsListProps {
  events: TruckEvent[];
  title: string;
  emptyMessage?: string;
}

export default function EventsList({ events, title, emptyMessage = 'No events scheduled' }: EventsListProps) {
  return (
    <div className="mt-8">
      <h4 className="text-2xl font-extrabold glass-text-heading mb-6 flex items-center gap-2">
        <span>{title}</span>
      </h4>
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showAddToCalendar={true}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
