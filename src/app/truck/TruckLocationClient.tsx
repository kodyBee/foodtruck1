'use client';

import { useEffect, useState } from 'react';
import type { TruckLocation, TruckEvent, WeeklySchedule } from '@/types';

export default function TruckLocationClient() {
  const [location, setLocation] = useState<TruckLocation | null>(null);
  const [events, setEvents] = useState<TruckEvent[]>([]);
  const [schedule, setSchedule] = useState<WeeklySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ address: string; lat?: number; lng?: number } | null>(null);
  const addToCalendar = (event: TruckEvent) => {
  const startTime = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  // Assume 2 hour duration if not specified
  const endTime = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title + " @ Crown Majestic Kitchen")}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || "")}&location=${encodeURIComponent(event.location)}`;
  
  window.open(url, '_blank');
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationRes, eventsRes, scheduleRes] = await Promise.all([
          fetch('/api/location'),
          fetch('/api/events'),
          fetch('/api/schedule'),
        ]);

        const locationData = await locationRes.json();
        const eventsData = await eventsRes.json();
        const scheduleData = await scheduleRes.json();

        setLocation(locationData);
        setEvents(eventsData);
        setSchedule(scheduleData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !location) {
    return (
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 truck-section-bg">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-yellow-500 text-xl">Loading location...</div>
        </div>
      </section>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // Use selected location if available, otherwise use current truck location
  const displayLocation = selectedLocation || location;
  const mapQuery = displayLocation.lat && displayLocation.lng 
    ? `${displayLocation.lat},${displayLocation.lng}`
    : encodeURIComponent(displayLocation.address);
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${mapQuery}&zoom=15`;
  const directionsUrl = displayLocation.lat && displayLocation.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${displayLocation.lat},${displayLocation.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(displayLocation.address)}`;

  const handleLocationClick = (locationAddress: string) => {
    setSelectedLocation({ address: locationAddress });
  };

  // Auto-categorize events based on date
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const categorizedEvents = events.map(event => {
    const eventDate = new Date(event.date);
    // If event is within the next 7 days, it's "this week"
    if (eventDate >= now && eventDate <= oneWeekFromNow) {
      return { ...event, type: 'this-week' as const };
    }
    // If event is in the future but more than a week away, it's "upcoming"
    if (eventDate > oneWeekFromNow) {
      return { ...event, type: 'upcoming' as const };
    }
    // Keep original type for past events or fallback
    return event;
  });

  const thisWeekEvents = categorizedEvents.filter(e => e.type === 'this-week');
  const upcomingEvents = categorizedEvents.filter(e => e.type === 'upcoming');

  return (
    
    
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 truck-section-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-serif italic mb-4" style={{ fontFamily: 'cursive' }}>
            <span className="text-primary font-bold" style={{ fontFamily: 'var(--font-dancing-script)' }}>Find Our Truck</span>
          </h2>
          <div className="flex justify-center mb-4">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          </div>
        </div>

        <div className="truck-main-card border-4 border-yellow-600/30 p-8 sm:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-primary mb-4">
              {selectedLocation ? 'Selected Location' : 'Current Location'}
            </h3>
            <p className="text-yellow-500 text-xl mb-2">📍 {displayLocation.address}</p>
            {selectedLocation && (
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-muted hover:text-yellow-500 text-sm mb-4 underline hover:scale-105 transition-all cursor-pointer underline-offset-2"
              >
                ← Back to current location
              </button>
            )}
            <p className="text-muted mb-6">
              {selectedLocation 
                ? 'Click locations below to view them on the map'
                : 'Follow us on social media for real-time location updates and schedule announcements'
              }
            </p>
            
            {/* Get Directions Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 transition-all duration-300 border-2 border-yellow-500 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50 cursor-pointer"
            >
              🚗 Get Directions
            </a>
          </div>

          {/* Google Maps Embed */}
          <div className="mb-8">
            <div className="relative w-full h-[400px] sm:h-[500px] border-4 border-yellow-600/30 overflow-hidden">
              <iframe
                title="Crown Majestic Kitchen Location Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                aria-label="Google Map showing food truck location"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="truck-schedule-card p-6 border border-yellow-600/20">
              <h4 className="text-xl font-bold text-yellow-500 mb-3">This Week</h4>
              <div className="space-y-3 text-muted">
                {schedule.length > 0 ? (
                  schedule.map((day) => (
                    <div key={day.day} className="border-b border-yellow-600/10 pb-2">
                      <div className="font-semibold text-yellow-500">{day.day}</div>
                      {day.location ? (
                        <>
                          <button
                            onClick={() => handleLocationClick(day.location!)}
                            className="text-sm hover:text-yellow-500 transition-all text-left underline decoration-dotted hover:scale-105 hover:underline-offset-4 cursor-pointer"
                          >
                            📍 {day.location}
                          </button>
                          {day.time && <div className="text-sm text-gray-400">{day.time}</div>}
                          {day.notes && <div className="text-xs text-gray-500 italic">{day.notes}</div>}
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Check back for updates</div>
                      )}
                    </div>
                  ))
                ) : thisWeekEvents.length > 0 ? (
                  thisWeekEvents.map((event) => (
                    <div key={event.id} className="border-b border-yellow-600/10 pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                          </div>
                          <button
                            onClick={() => handleLocationClick(event.location)}
                            className="text-sm hover:text-yellow-500 transition-all underline decoration-dotted hover:scale-105 hover:underline-offset-4 cursor-pointer"
                          >
                            📍 {event.location}
                          </button>
                          {event.description && (
                            <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                          )}
                        </div>
                        <button 
                          onClick={() => addToCalendar(event)}
                          className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded hover:bg-yellow-500/20 transition-colors"
                          title="Add to Google Calendar"
                        >
                          📅 Save
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Check back soon for our weekly schedule</p>
                )}
              </div>
            </div>
            
            <div className="truck-schedule-card p-6 border border-yellow-600/20">
              <h4 className="text-xl font-bold text-yellow-500 mb-3">Upcoming Events</h4>
              <div className="space-y-3 text-muted">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="border-b border-yellow-600/10 pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-sm text-gray-400">
                            {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                          </div>
                          <button
                            onClick={() => handleLocationClick(event.location)}
                            className="text-sm hover:text-yellow-500 transition-all underline decoration-dotted hover:scale-105 hover:underline-offset-4 cursor-pointer"
                          >
                            📍 {event.location}
                          </button>
                          {event.description && (
                            <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                          )}
                        </div>
                        <button 
                          onClick={() => addToCalendar(event)}
                          className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded hover:bg-yellow-500/20 transition-colors"
                          title="Add to Google Calendar"
                        >
                          📅 Save
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Private events and catering available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
