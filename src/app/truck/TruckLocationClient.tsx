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
        
        // After loading, resolve the closest event's location if it's a short link
        if (eventsData.length > 0) {
          const now = new Date();
          const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const oneWeekFromNow = new Date(localNow.getTime() + 7 * 24 * 60 * 60 * 1000);
          
          // Find events within this week
          const thisWeekEvents = eventsData
            .map((event: any) => {
              const [year, month, day] = event.date.split('-').map(Number);
              const eventDate = new Date(year, month - 1, day);
              if (eventDate >= localNow && eventDate <= oneWeekFromNow) {
                return event;
              }
              return null;
            })
            .filter((e: any) => e !== null)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          // If there's a closest event, try to resolve its location
          if (thisWeekEvents.length > 0) {
            const closestEvent = thisWeekEvents[0];
            const locationAddress = closestEvent.location;
            
            // Check if it's a Google Maps short link
            if (locationAddress.includes('maps.app.goo.gl') || locationAddress.includes('goo.gl')) {
              try {
                const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(locationAddress)}`);
                const data = await response.json();
                
                if (data.placeName || (data.lat && data.lng)) {
                  setSelectedLocation({
                    address: data.placeName || locationAddress,
                    lat: data.lat,
                    lng: data.lng
                  });
                } else {
                  setSelectedLocation({ address: locationAddress, lat: 0, lng: 0 });
                }
              } catch (error) {
                console.error('Error resolving event location:', error);
                setSelectedLocation({ address: locationAddress, lat: 0, lng: 0 });
              }
            } else {
              setSelectedLocation({ address: locationAddress, lat: 0, lng: 0 });
            }
          }
        }
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
  
  // Auto-categorize events based on date
  const now = new Date();
  // Create a clean date object for today in local timezone
  const localNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneWeekFromNow = new Date(localNow.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const categorizedEvents = events.map(event => {
    // Parse date string directly without adding time to avoid timezone shifts
    const [year, month, day] = event.date.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day); // month is 0-indexed
    // If event is within the next 7 days (including today), it's "this week"
    if (eventDate >= localNow && eventDate <= oneWeekFromNow) {
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
  
  // Find the closest event to today (should be the first in thisWeekEvents since it's sorted)
  const closestEvent = thisWeekEvents.length > 0 ? thisWeekEvents[0] : null;
  
  // Determine the best location to show on the map
  // Priority: 1) manually selected location, 2) closest event, 3) API location
  let displayLocation = selectedLocation;
  
  if (!displayLocation && closestEvent) {
    displayLocation = { address: closestEvent.location, lat: 0, lng: 0 };
  }
  
  if (!displayLocation) {
    displayLocation = location;
  }
  
  // For embed URL, use coordinates if available, otherwise use search mode with address
  let mapEmbedUrl: string;
  if (displayLocation.lat && displayLocation.lng && displayLocation.lat !== 0 && displayLocation.lng !== 0) {
    mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${displayLocation.lat},${displayLocation.lng}&zoom=15`;
  } else {
    // Use search mode which is more flexible with address strings
    mapEmbedUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(displayLocation.address)}&zoom=15`;
  }
  
  const directionsUrl = (displayLocation.lat && displayLocation.lng && displayLocation.lat !== 0 && displayLocation.lng !== 0)
    ? `https://www.google.com/maps/dir/?api=1&destination=${displayLocation.lat},${displayLocation.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(displayLocation.address)}`;

  const handleLocationClick = async (locationAddress: string) => {
    // Check if it's a Google Maps short link
    if (locationAddress.includes('maps.app.goo.gl') || locationAddress.includes('goo.gl')) {
      try {
        const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(locationAddress)}`);
        const data = await response.json();
        
        if (data.placeName || (data.lat && data.lng)) {
          const newLocation = {
            address: data.placeName || locationAddress,
            lat: data.lat,
            lng: data.lng
          };
          setSelectedLocation(newLocation);
          return;
        }
        
        // Fallback: parse the resolved URL if API didn't extract info
        if (data.resolvedUrl) {
          const fullUrl = data.resolvedUrl;
          
          // Try to extract place name from the URL path
          const placeMatch = fullUrl.match(/\/maps\/place\/([^\/]+)/);
          if (placeMatch) {
            const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
            setSelectedLocation({ address: placeName });
            return;
          }
        }
      } catch (error) {
        console.error('Error resolving maps link:', error);
      }
    }
    
    // Default: just use the address as-is
    setSelectedLocation({ address: locationAddress });
  };

  
  // Helper function to check if an event is today
  const isToday = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);
    return eventDate.getTime() === localNow.getTime();
  };

  const upcomingEvents = categorizedEvents
    .filter(e => e.type === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

  // Reorder schedule to start from today
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = localNow.getDay(); // 0-6, where 0 is Sunday
  const todayDayName = daysOfWeek[today];
  
  // Create a merged week view: combine schedule with events
  // For each day of the week starting from today, show event if exists, otherwise show schedule
  const weekView = daysOfWeek.map((dayName, dayIndex) => {
    // Calculate the date for this day
    const daysFromToday = (dayIndex - today + 7) % 7;
    const dateForDay = new Date(localNow);
    dateForDay.setDate(localNow.getDate() + daysFromToday);
    const dateStr = dateForDay.toISOString().split('T')[0];
    
    // Check if there's an event on this date
    const eventOnThisDay = thisWeekEvents.find(e => e.date === dateStr);
    
    // Get the schedule for this day
    const scheduleForDay = schedule.find(s => s.day === dayName);
    
    return {
      day: dayName,
      daysFromToday,
      date: dateStr,
      event: eventOnThisDay || null,
      schedule: scheduleForDay || { day: dayName, location: null, time: null, notes: null }
    };
  }).sort((a, b) => a.daysFromToday - b.daysFromToday);

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
          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Map - First on mobile, right side on desktop */}
            <div className="md:w-1/2 w-full md:order-2 md:mt-14">
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
              {/* Future Events - Desktop only, hidden on mobile */}
              <div className="mt-8 hidden md:block">
                <h4 className="text-2xl font-extrabold glass-text-heading mb-6 flex items-center gap-2">
                  <span>Future Events</span>
                </h4>
                <div className="space-y-4">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="glass-card glass-card-border shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center hover:shadow-yellow-900/30 transition-all duration-300">
                        <div className="flex flex-col items-center w-full">
                          <div className="text-4xl font-black glass-text-heading tracking-widest mb-2 drop-shadow-lg uppercase">
                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-3"></div>
                          <div className="text-xl font-bold glass-text-subheading text-center mb-2">
                            {event.title}
                          </div>
                          <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                            <span className="text-lg">📅</span> {(() => {
                              const [year, month, day] = event.date.split('-').map(Number);
                              return new Date(year, month - 1, day).toLocaleDateString();
                            })()}
                          </div>
                          {event.time && (
                            <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                              <span className="text-lg">🕒</span> {event.time}
                            </div>
                          )}
                          {event.description && (
                            <div className="text-sm glass-text-body italic mb-2 text-center">{event.description}</div>
                          )}
                          <div className="flex gap-2 mt-3 flex-wrap justify-center">
                            <button
                              onClick={() => handleLocationClick(event.location)}
                              className="px-4 py-1.5 rounded-full glass-button text-black font-semibold shadow hover:scale-105 transition-all flex items-center gap-1.5 text-sm border border-yellow-400"
                            >
                              <span>Show on map</span>
                            </button>
                            <button 
                              onClick={() => addToCalendar(event)}
                              className="px-4 py-1.5 rounded-full glass-button text-black font-semibold shadow hover:scale-105 transition-all flex items-center gap-1.5 text-sm border border-yellow-400"
                              title="Add to Google Calendar"
                            >
                              <span>📅</span>
                              <span>Add to Calendar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center">Private events and catering available</p>
                  )}
                </div>
              </div>
            </div>
            {/* Upcoming Events Table - Second on mobile, left side on desktop */}
            <div className="md:w-1/2 w-full md:order-1">
              <h4 className="text-2xl font-extrabold glass-text-heading mb-6 flex items-center gap-2">
                <span>This Week</span>
              </h4>
              <div className="space-y-4">
                {weekView.map((dayInfo, index) => {
                  const isThisToday = dayInfo.daysFromToday === 0;
                  const displayItem = dayInfo.event || dayInfo.schedule;
                  const hasLocation = dayInfo.event?.location || dayInfo.schedule.location;
                  
                  return (
                    <div
                      key={dayInfo.day}
                      className="glass-card glass-card-border shadow-2xl rounded-3xl p-6 mb-6 flex flex-col items-center justify-center hover:shadow-yellow-900/30 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center w-full">
                        <div className="text-4xl font-black glass-text-heading tracking-widest mb-2 drop-shadow-lg uppercase">
                          {isThisToday ? 'Today' : dayInfo.day.slice(0, 3)}
                        </div>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-3"></div>
                        
                        {dayInfo.event ? (
                          <>
                            <div className="text-xl font-bold glass-text-subheading text-center mb-2">
                              {dayInfo.event.title}
                            </div>
                            <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                              <span className="text-lg">📅</span> {(() => {
                                const [year, month, day] = dayInfo.event.date.split('-').map(Number);
                                return new Date(year, month - 1, day).toLocaleDateString();
                              })()}
                            </div>
                            {dayInfo.event.time && (
                              <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                                <span className="text-lg">🕒</span> {dayInfo.event.time}
                              </div>
                            )}
                            {dayInfo.event.description && (
                              <div className="text-sm glass-text-body italic mb-2 text-center">{dayInfo.event.description}</div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-bold glass-text-subheading text-center mb-2">
                              {dayInfo.schedule.location ? dayInfo.schedule.location : <span className='text-gray-500 italic'>{(() => {
                                const [year, month, day] = dayInfo.date.split('-').map(Number);
                                return new Date(year, month - 1, day).toLocaleDateString();
                              })()}</span>}
                            </div>
                            {dayInfo.schedule.time && (
                              <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                                <span className="text-lg">🕒</span> {dayInfo.schedule.time}
                              </div>
                            )}
                            {dayInfo.schedule.notes && (
                              <div className="text-sm glass-text-body italic mb-2">{dayInfo.schedule.notes}</div>
                            )}
                          </>
                        )}
                        
                        {hasLocation && (
                          <>
                            {isThisToday ? (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dayInfo.event?.location || dayInfo.schedule.location!)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                              >
                                <span>Get Directions</span>
                              </a>
                            ) : (
                              <button
                                onClick={() => handleLocationClick(dayInfo.event?.location || dayInfo.schedule.location!)}
                                className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                              >
                                <span>Show on map</span>
                              </button>
                            )}
                          </>
                        )}
                        
                        {dayInfo.event && (
                          <button 
                            onClick={() => addToCalendar(dayInfo.event!)}
                            className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                            title="Add to Google Calendar"
                          >
                            <span>📅</span>
                            <span>Add to Calendar</span>
                          </button>
                        )}
                        
                        {!hasLocation && (
                          <div className="text-sm text-gray-500 mt-2">Check back for updates</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Future Events - Mobile only, shows after Upcoming Events */}
            <div className="md:hidden w-full">
              <h4 className="text-2xl font-extrabold glass-text-heading mb-6 flex items-center gap-2">
                <span>Future Events</span>
              </h4>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="glass-card glass-card-border shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-center hover:shadow-yellow-900/30 transition-all duration-300">
                      <div className="flex flex-col items-center w-full">
                        <div className="text-4xl font-black glass-text-heading tracking-widest mb-2 drop-shadow-lg uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-3"></div>
                        <div className="text-xl font-bold glass-text-subheading text-center mb-2">
                          {event.title}
                        </div>
                        <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                          <span className="text-lg">📅</span> {(() => {
                            const [year, month, day] = event.date.split('-').map(Number);
                            return new Date(year, month - 1, day).toLocaleDateString();
                          })()}
                        </div>
                        {event.time && (
                          <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                            <span className="text-lg">🕒</span> {event.time}
                          </div>
                        )}
                        {event.description && (
                          <div className="text-sm glass-text-body italic mb-2 text-center">{event.description}</div>
                        )}
                        <div className="flex gap-2 mt-3 flex-wrap justify-center">
                          <button
                            onClick={() => handleLocationClick(event.location)}
                            className="px-4 py-1.5 rounded-full glass-button text-black font-semibold shadow hover:scale-105 transition-all flex items-center gap-1.5 text-sm border border-yellow-400"
                          >
                            <span>Show on map</span>
                          </button>
                          <button 
                            onClick={() => addToCalendar(event)}
                            className="px-4 py-1.5 rounded-full glass-button text-black font-semibold shadow hover:scale-105 transition-all flex items-center gap-1.5 text-sm border border-yellow-400"
                            title="Add to Google Calendar"
                          >
                            <span>📅</span>
                            <span>Add to Calendar</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center">Private events and catering available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}