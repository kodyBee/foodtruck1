'use client';

import { useEffect, useState } from 'react';
import type { TruckLocation, TruckEvent, WeeklySchedule } from '@/types';

interface TruckLocationClientProps {
  apiKey: string;
}

export default function TruckLocationClient({ apiKey }: TruckLocationClientProps) {
  const [location, setLocation] = useState<TruckLocation | null>(null);
  const [events, setEvents] = useState<TruckEvent[]>([]);
  const [schedule, setSchedule] = useState<WeeklySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ address: string; lat?: number; lng?: number } | null>(null);
  
  const addToCalendar = (event: TruckEvent) => {
    const eventDate = new Date(event.date);
    
    // If event has a time, parse it and set it on the date
    if (event.time) {
      const [hours, minutes] = event.time.split(':').map(part => {
        // Handle formats like "11:00 AM" or "11:00"
        const cleaned = part.replace(/[^\d]/g, '');
        return parseInt(cleaned, 10);
      });
      
      // Check if it's PM
      const isPM = event.time.toLowerCase().includes('pm') && hours !== 12;
      const isAM = event.time.toLowerCase().includes('am') && hours === 12;
      
      eventDate.setHours(isPM ? hours + 12 : (isAM ? 0 : hours));
      eventDate.setMinutes(minutes || 0);
    } else {
      // Default to 11:00 AM if no time specified
      eventDate.setHours(11, 0, 0, 0);
    }
    
    const startTime = eventDate.toISOString().replace(/-|:|\.\d+/g, "");
    // Assume 2 hour duration
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
    const endTime = endDate.toISOString().replace(/-|:|\.\d+/g, "");
    
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title + " @ Crown Majestic Kitchen")}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description || "Visit us at Crown Majestic Kitchen!")}&location=${encodeURIComponent(event.location)}`;
    
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
  
  // Use selected location if available, otherwise use current truck location
  const displayLocation = selectedLocation || location;
  
  // For embed URL, use coordinates if available, otherwise use search mode with address
  let mapEmbedUrl: string;
  if (displayLocation.lat && displayLocation.lng && displayLocation.lat !== 0 && displayLocation.lng !== 0) {
    mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${displayLocation.lat},${displayLocation.lng}&zoom=15`;
  } else {
    // Use search mode which is more flexible with address strings
    mapEmbedUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(displayLocation.address)}&zoom=15`;
  }
  
  console.log('Display location:', displayLocation);
  console.log('Map embed URL:', mapEmbedUrl);
  
  const directionsUrl = (displayLocation.lat && displayLocation.lng && displayLocation.lat !== 0 && displayLocation.lng !== 0)
    ? `https://www.google.com/maps/dir/?api=1&destination=${displayLocation.lat},${displayLocation.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(displayLocation.address)}`;

  const handleLocationClick = async (locationAddress: string) => {
    console.log('Location clicked:', locationAddress);
    
    // Check if it's a Google Maps short link
    if (locationAddress.includes('maps.app.goo.gl') || locationAddress.includes('goo.gl')) {
      try {
        const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(locationAddress)}`);
        const data = await response.json();
        console.log('API response:', data);
        
        if (data.placeName || (data.lat && data.lng)) {
          const newLocation = {
            address: data.placeName || locationAddress,
            lat: data.lat,
            lng: data.lng
          };
          console.log('Setting location:', newLocation);
          setSelectedLocation(newLocation);
          return;
        }
        
        // Fallback: parse the resolved URL if API didn't extract info
        if (data.resolvedUrl) {
          const fullUrl = data.resolvedUrl;
          console.log('Parsing resolved URL:', fullUrl);
          
          // Try to extract place name from the URL path
          const placeMatch = fullUrl.match(/\/maps\/place\/([^\/]+)/);
          if (placeMatch) {
            const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
            console.log('Setting location with place name:', placeName);
            setSelectedLocation({ address: placeName });
            return;
          }
        }
      } catch (error) {
        console.error('Error resolving maps link:', error);
      }
    }
    
    // Default: just use the address as-is
    console.log('Setting location as-is:', locationAddress);
    setSelectedLocation({ address: locationAddress });
  };

  // Auto-categorize events based on date
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const categorizedEvents = events.map(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0); // Normalize to start of day
    // If event is within the next 7 days (including today), it's "this week"
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

  // Filter and sort events
  const thisWeekEvents = categorizedEvents
    .filter(e => e.type === 'this-week')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending
  const upcomingEvents = categorizedEvents
    .filter(e => e.type === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

  // Reorder schedule to start from today
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = now.getDay(); // 0-6, where 0 is Sunday
  const todayDayName = daysOfWeek[today];
  
  // Sort schedule to start from today
  const reorderedSchedule = schedule
    .slice()
    .sort((a, b) => {
      const aIndex = daysOfWeek.indexOf(a.day);
      const bIndex = daysOfWeek.indexOf(b.day);
      
      // Calculate days from today (0 = today, 1 = tomorrow, etc.)
      const aDaysFromToday = (aIndex - today + 7) % 7;
      const bDaysFromToday = (bIndex - today + 7) % 7;
      
      return aDaysFromToday - bDaysFromToday;
    });

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
          <div className="flex flex-col-reverse md:flex-row gap-10 items-start">
            {/* Upcoming Events Table */}
            <div className="md:w-1/2 w-full">
              <h4 className="text-2xl font-extrabold text-yellow-400 mb-6 flex items-center gap-2">
                <span className="inline-block w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></span>
                <span>Upcoming Events</span>
              </h4>
              <div className="space-y-4">
                {thisWeekEvents.length > 0 ? (
                  thisWeekEvents.map((event) => (
                    <div key={event.id} className="glass-card glass-card-border shadow-2xl rounded-3xl p-6 mb-6 flex flex-col items-center justify-center hover:shadow-yellow-900/30 transition-all duration-300">
                      <div className="flex flex-col items-center w-full">
                        <div className="text-4xl font-black glass-text-heading tracking-widest mb-2 drop-shadow-lg uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="w-10 h-1 bg-gradient-to-r from-yellow-500 via-yellow-700 to-yellow-500 rounded-full mb-3 shadow-yellow-700/40 shadow"></div>
                        <div className="text-xl font-bold glass-text-subheading text-center mb-2">
                          {event.title}
                        </div>
                        <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                          <span className="text-lg">📅</span> {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.time && (
                          <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                            <span className="text-lg">🕒</span> {event.time}
                          </div>
                        )}
                      {event.description && (
                        <div className="text-sm glass-text-body italic mb-2 text-center">{event.description}</div>
                      )}
                      <button
                        onClick={() => handleLocationClick(event.location)}
                        className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                      >
                        
                        <span>Show on map</span>
                      </button>
                      <button 
                        onClick={() => addToCalendar(event)}
                        className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                        title="Add to Google Calendar"
                      >
                        <span>📅</span>
                        <span>Add to Calendar</span>
                      </button>
                    </div>
                  </div>
                  ))
                ) : reorderedSchedule.length > 0 ? (
                  reorderedSchedule.map((day) => (
                    <div
                      key={day.day}
                      className="glass-card glass-card-border shadow-2xl rounded-3xl p-6 mb-6 flex flex-col items-center justify-center hover:shadow-yellow-900/30 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className="text-4xl font-black glass-text-heading tracking-widest mb-2 drop-shadow-lg uppercase">
                          {day.day.slice(0,3)}
                        </div>
                        <div className="w-10 h-1 bg-gradient-to-r from-yellow-500 via-yellow-700 to-yellow-500 rounded-full mb-3 shadow-yellow-700/40 shadow"></div>
                        <div className="text-xl font-bold glass-text-subheading text-center mb-2">
                          {day.location ? day.location : <span className='text-gray-500 italic'>TBD</span>}
                        </div>
                        {day.time && (
                          <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                            <span className="text-lg">🕒</span> {day.time}
                          </div>
                        )}
                        {day.notes && (
                          <div className="text-sm glass-text-body italic mb-2">{day.notes}</div>
                        )}
                        {day.location && (
                          <button
                            onClick={() => handleLocationClick(day.location!)}
                            className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                          >
                            
                            <span>Show on map</span>
                          </button>
                        )}
                        {!day.location && (
                          <div className="text-sm text-gray-500 mt-2">Check back for updates</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : thisWeekEvents.length > 0 ? (
                  thisWeekEvents.map((event) => (
                    <div key={event.id} className="bg-gradient-to-br from-black/80 via-neutral-900/90 to-neutral-950/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 mb-6 flex flex-col items-center justify-center border border-yellow-700/30 hover:shadow-yellow-900/30 transition-all duration-300">
                      <div className="flex flex-col items-center w-full">
                        <div className="text-4xl font-black text-yellow-400 tracking-widest mb-2 drop-shadow-lg uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="w-10 h-1 bg-gradient-to-r from-yellow-500 via-yellow-700 to-yellow-500 rounded-full mb-3 shadow-yellow-700/40 shadow"></div>
                        <div className="text-xl font-bold text-yellow-200 text-center mb-2">
                          {event.title}
                        </div>
                        <div className="text-md text-yellow-300 flex items-center gap-2 mb-1">
                           {new Date(event.date).toLocaleDateString()}
                        </div>
                        {event.time && (
                          <div className="text-md text-yellow-300 flex items-center gap-2 mb-1">
                             {event.time}
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <div className="text-sm text-yellow-500 italic mb-2 text-center">{event.description}</div>
                      )}
                      <button
                        onClick={() => handleLocationClick(event.location)}
                        className="mt-3 px-6 py-2 rounded-full bg-yellow-600/80 text-black font-bold shadow hover:bg-yellow-500 hover:text-yellow-950 hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                      >
                       
                        <span>Show on map</span>
                      </button>
                      <button 
                        onClick={() => addToCalendar(event)}
                        className="mt-3 px-6 py-2 rounded-full bg-yellow-600/80 text-black font-bold shadow hover:bg-yellow-500 hover:text-yellow-950 hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                        title="Add to Google Calendar"
                      >
                        <span>📅</span>
                        <span>Add to Calendar</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">Check back soon for upcoming events</p>
                )}
              </div>
            </div>
            {/* Map and Location Info */}
            <div className="md:w-1/2 w-full flex flex-col gap-8">
              <div className="glass-card glass-card-border shadow-2xl rounded-3xl p-8">
                <div className="flex flex-col items-center w-full">
                  <div className="text-2xl font-extrabold glass-text-heading mb-3">
                    <span>{selectedLocation ? 'Selected Location' : 'Current Location'}</span>
                  </div>
                  <div className="w-20 h-1 bg-gradient-to-r from-yellow-500 via-yellow-700 to-yellow-500 rounded-full mb-4 shadow-yellow-700/40 shadow"></div>
                  <div className="text-xl font-bold glass-text-subheading text-center mb-4 break-all flex items-center gap-2">

                    <span>{displayLocation.address}</span>
                  </div>
                  {selectedLocation && (
                    <button
                      onClick={() => setSelectedLocation(null)}
                      className="glass-text-heading hover:opacity-80 text-sm mb-4 underline hover:scale-105 transition-all cursor-pointer underline-offset-2 font-semibold"
                    >
                      ← Back to current location
                    </button>
                  )}
                  <p className="glass-text-muted text-center mb-6 text-sm">
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
                    className="px-8 py-3 rounded-full glass-button text-black font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                  >
                    
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
              {/* Google Maps Embed */}
              <div className="glass-card glass-card-border shadow-2xl rounded-3xl p-4">
                <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-2xl border-2 glass-card-border">
                  <iframe
                    key={mapEmbedUrl}
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
              {/* Future Events */}
              <div className="glass-card glass-card-border shadow-2xl rounded-3xl p-6">
                <h4 className="text-2xl font-extrabold glass-text-heading mb-6 flex items-center gap-2">
                  <span className="inline-block w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full"></span>
                  <span>Future Events</span>
                </h4>
                <div className="space-y-3 text-muted">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="border-b border-yellow-600/10 pb-4 last:border-0 mb-4 last:mb-0">
                        <div className="space-y-2">
                          <div className="font-bold text-lg text-yellow-500">{event.title}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <span>🗓️</span>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            {event.time && (
                              <>
                                <span>•</span>
                                <span>🕐 {event.time}</span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleLocationClick(event.location)}
                            className="text-sm text-yellow-500 hover:text-yellow-400 transition-all flex items-center gap-1 hover:gap-2 cursor-pointer"
                          >
                            
                            <span className="underline decoration-dotted">
                              {event.location.includes('maps.app.goo.gl') || event.location.includes('goo.gl') ? 'View on Map' : event.location}
                            </span>
                          </button>
                          {event.description && (
                            <div className="text-sm text-gray-400 italic pl-5">{event.description}</div>
                          )}
                          <button 
                            onClick={() => addToCalendar(event)}
                            className="mt-3 flex items-center gap-2 text-sm bg-yellow-600/20 text-yellow-500 px-4 py-2 border border-yellow-600/30 hover:bg-yellow-600/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 font-semibold w-full justify-center sm:w-auto"
                            title="Add to Google Calendar"
                          >
                           
                            <span>Add to Calendar</span>
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
      </div>
    </section>
  );
}
