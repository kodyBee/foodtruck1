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
  if (displayLocation.lat && displayLocation.lng) {
    mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${displayLocation.lat},${displayLocation.lng}&zoom=15`;
  } else {
    // Use search mode which is more flexible with address strings
    mapEmbedUrl = `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(displayLocation.address)}&zoom=15`;
  }
  
  console.log('Display location:', displayLocation);
  console.log('Map embed URL:', mapEmbedUrl);
  
  const directionsUrl = displayLocation.lat && displayLocation.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${displayLocation.lat},${displayLocation.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(displayLocation.address)}`;

  const handleLocationClick = async (locationAddress: string) => {
    console.log('Location clicked:', locationAddress);
    
    // Check if it's a Google Maps short link
    if (locationAddress.includes('maps.app.goo.gl') || locationAddress.includes('goo.gl')) {
      try {
        const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(locationAddress)}`);
        const data = await response.json();
        console.log('Resolved URL data:', data);
        
        if (data.resolvedUrl) {
          // Extract coordinates or place info from the resolved URL
          const fullUrl = data.resolvedUrl;
          console.log('Full resolved URL:', fullUrl);
          
          // First, try to extract place name from the URL path
          // Format: /maps/place/Place+Name,Address/...
          const placeMatch = fullUrl.match(/\/maps\/place\/([^\/]+)/);
          let placeName = '';
          if (placeMatch) {
            placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
            console.log('Extracted place name:', placeName);
          }
          
          // Try to extract coordinates from the data parameter
          // Format: !3d30.4209052!4d-81.6969373 (latitude and longitude)
          const latMatch = fullUrl.match(/!3d(-?\d+\.\d+)/);
          const lngMatch = fullUrl.match(/!4d(-?\d+\.\d+)/);
          
          if (latMatch && lngMatch) {
            const newLocation = {
              address: placeName || locationAddress,
              lat: parseFloat(latMatch[1]),
              lng: parseFloat(lngMatch[1])
            };
            console.log('Setting location with coordinates:', newLocation);
            setSelectedLocation(newLocation);
            return;
          }
          
          // Try to extract from hex-encoded coordinates in the path
          // Some URLs use format: 0xHEX:0xHEX which represents lat/lng
          const hexMatch = fullUrl.match(/0x([0-9a-f]+):0x([0-9a-f]+)/i);
          if (hexMatch && placeName) {
            // Use place name for search if we can't decode hex coordinates
            console.log('Using place name for search:', placeName);
            setSelectedLocation({ address: placeName });
            return;
          }
          
          // Fallback: Try to extract coordinates from various Google Maps URL formats
          // Format: /maps/place/.../@lat,lng,zoom
          const pathMatch = fullUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
          if (pathMatch) {
            const newLocation = {
              address: placeName || locationAddress,
              lat: parseFloat(pathMatch[1]),
              lng: parseFloat(pathMatch[2])
            };
            console.log('Setting location with coordinates from path:', newLocation);
            setSelectedLocation(newLocation);
            return;
          }
          
          // Format: ?q=lat,lng
          const urlObj = new URL(fullUrl);
          const qParam = urlObj.searchParams.get('q');
          if (qParam) {
            const coordMatch = qParam.match(/(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (coordMatch) {
              const newLocation = {
                address: qParam,
                lat: parseFloat(coordMatch[1]),
                lng: parseFloat(coordMatch[2])
              };
              console.log('Setting location with coordinates from q param:', newLocation);
              setSelectedLocation(newLocation);
              return;
            }
            // If q parameter exists but isn't coordinates, use it as address
            console.log('Setting location with q param address:', qParam);
            setSelectedLocation({ address: qParam });
            return;
          }
          
          // If we extracted a place name, use it
          if (placeName) {
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
            <p className="text-yellow-500 text-xl mb-2 break-all">📍 {displayLocation.address}</p>
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
                          <span>📍</span>
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
                          <span>📅</span>
                          <span>Add to Calendar</span>
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
                          <span>📍</span>
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
                          <span>📅</span>
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
    </section>
  );
}
