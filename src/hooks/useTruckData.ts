import { useState, useEffect } from 'react';
import type { TruckLocation, TruckEvent, WeeklySchedule } from '@/types';
import { categorizeEvents, getClosestEvent, type CategorizedEvent } from '@/lib/eventUtils';

interface UseTruckDataReturn {
  location: TruckLocation | null;
  events: TruckEvent[];
  schedule: WeeklySchedule[];
  loading: boolean;
  error: string | null;
  closestEvent: CategorizedEvent | null;
}

export function useTruckData(): UseTruckDataReturn {
  const [location, setLocation] = useState<TruckLocation | null>(null);
  const [events, setEvents] = useState<TruckEvent[]>([]);
  const [schedule, setSchedule] = useState<WeeklySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationRes, eventsRes, scheduleRes] = await Promise.all([
          fetch('/api/location'),
          fetch('/api/events'),
          fetch('/api/schedule'),
        ]);

        if (!locationRes.ok || !eventsRes.ok || !scheduleRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const locationData = await locationRes.json();
        const eventsData = await eventsRes.json();
        const scheduleData = await scheduleRes.json();

        setLocation(locationData);
        setEvents(eventsData);
        setSchedule(scheduleData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load location data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categorizedEvents = categorizeEvents(events);
  const closestEvent = getClosestEvent(categorizedEvents);

  return {
    location,
    events,
    schedule,
    loading,
    error,
    closestEvent
  };
}
