'use client';

import { useMemo, useCallback } from 'react';
import type { TruckEvent, WeeklySchedule } from '@/types';
import { useTruckData } from '@/hooks/useTruckData';
import { categorizeEvents, getThisWeekEvents, getUpcomingEvents } from '@/lib/eventUtils';
import { addToCalendar } from '@/lib/calendarUtils';
import { getTodayAtMidnight, formatDateForDisplay } from '@/lib/dateUtils';
import LocationMap from '@/components/LocationMap';
import EventsList from '@/components/EventsList';

interface TruckLocationClientProps {
  apiKey: string;
}

export default function TruckLocationClient({ apiKey }: TruckLocationClientProps) {
  const { location, events, schedule, loading, error, closestEvent } = useTruckData();

  // Memoize categorized and filtered events
  const categorizedEvents = useMemo(() => categorizeEvents(events), [events]);
  const thisWeekEvents = useMemo(() => getThisWeekEvents(categorizedEvents), [categorizedEvents]);
  const upcomingEvents = useMemo(() => getUpcomingEvents(categorizedEvents), [categorizedEvents]);

  // Create a merged week view: combine schedule with events
  const weekView = useMemo(() => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDate = getTodayAtMidnight();
    const todayDayIndex = todayDate.getDay();
    
    return daysOfWeek.map((dayName, dayIndex) => {
      // Calculate the date for this day
      const daysFromToday = (dayIndex - todayDayIndex + 7) % 7;
      const dateForDay = new Date(todayDate);
      dateForDay.setDate(todayDate.getDate() + daysFromToday);
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
  }, [thisWeekEvents, schedule]);

  // Helper function to generate directions URL for a specific location
  const getDirectionsUrl = useCallback((locationAddress: string) => {
    // If it's a Google Maps short link, use it directly as destination
    if (locationAddress.includes('maps.app.goo.gl') || locationAddress.includes('goo.gl')) {
      // Google Maps can handle short links as destinations by opening them
      return locationAddress;
    }
    
    // If it's a full Google Maps URL, try to extract the best information
    if (locationAddress.includes('google.com/maps')) {
      // First priority: Try to extract place_id (most reliable)
      const placeIdMatch = locationAddress.match(/[?&]place_id=([^&]+)/);
      if (placeIdMatch) {
        return `https://www.google.com/maps/dir/?api=1&destination=place_id:${placeIdMatch[1]}`;
      }
      
      // Second priority: Try to extract coordinates from @ parameter
      const coordMatch = locationAddress.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        return `https://www.google.com/maps/dir/?api=1&destination=${coordMatch[1]},${coordMatch[2]}`;
      }
      
      // Third priority: Try to extract from /place/ in the path
      const placePathMatch = locationAddress.match(/\/place\/([^\/\?#@]+)/);
      if (placePathMatch) {
        const placeName = decodeURIComponent(placePathMatch[1].replace(/\+/g, ' '));
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeName)}`;
      }
      
      // Fourth priority: Try to extract query parameter
      const queryMatch = locationAddress.match(/[?&]q=([^&]+)/);
      if (queryMatch) {
        const query = decodeURIComponent(queryMatch[1].replace(/\+/g, ' '));
        return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
      }
      
      // Fallback: use the URL as-is (will open in Google Maps)
      return locationAddress;
    }
    
    // Otherwise treat it as an address
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(locationAddress)}`;
  }, []);

  // Helper function to get display name for location
  const getLocationDisplay = useCallback((item: { location?: string; locationName?: string }) => {
    return item.locationName || item.location || '';
  }, []);

  // Determine the best location to show on the map
  // Priority: 1) closest event location, 2) API location
  const displayLocation = useMemo(() => {
    if (closestEvent) {
      return { address: closestEvent.location, lat: 0, lng: 0 };
    }
    if (location) {
      return location;
    }
    // Fallback to empty location
    return { address: '', lat: 0, lng: 0 };
  }, [closestEvent, location]);

  // Loading state
  if (loading) {
    return (
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 truck-section-bg">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-yellow-500 text-xl">Loading location...</div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !location) {
    return (
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 truck-section-bg">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-red-500 text-xl">{error || 'Failed to load location data'}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

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
              <LocationMap apiKey={apiKey} location={displayLocation} />
              
              {/* Future Events - Desktop only, hidden on mobile */}
              <div className="hidden md:block">
                <EventsList
                  events={upcomingEvents}
                  title="Future Events"
                  emptyMessage="Private events and catering available"
                />
              </div>
            </div>
            
            {/* Upcoming Events Table - Second on mobile, left side on desktop */}
            <div className="md:w-1/2 w-full md:order-1">
              <h4 className="text-2xl font-extrabold glass-text-heading mb-6 flex items-center gap-2">
                <span>This Week</span>
              </h4>
              <div className="space-y-4">
                {weekView.map((dayInfo) => {
                  const isThisToday = dayInfo.daysFromToday === 0;
                  const hasLocation = dayInfo.event?.location || dayInfo.schedule.location;
                  const displayName = getLocationDisplay(dayInfo.event || dayInfo.schedule);
                  
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
                              <span className="text-lg" aria-hidden="true">📅</span>
                              <time dateTime={dayInfo.event.date}>{formatDateForDisplay(dayInfo.event.date)}</time>
                            </div>
                            {dayInfo.event.time && (
                              <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                                <span className="text-lg" aria-hidden="true">🕒</span>
                                <time>{dayInfo.event.time}</time>
                              </div>
                            )}
                            {displayName && (
                              <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                                <span className="text-lg" aria-hidden="true">📍</span>
                                <span>{displayName}</span>
                              </div>
                            )}
                            {dayInfo.event.description && (
                              <div className="text-sm glass-text-body italic mb-2 text-center">{dayInfo.event.description}</div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="text-xl font-bold glass-text-subheading text-center mb-2">
                              {displayName ? (
                                displayName
                              ) : (
                                <span className='text-gray-500 italic'>{formatDateForDisplay(dayInfo.date)}</span>
                              )}
                            </div>
                            {dayInfo.schedule.time && (
                              <div className="text-md glass-text-body flex items-center gap-2 mb-1">
                                <span className="text-lg" aria-hidden="true">🕒</span>
                                <time>{dayInfo.schedule.time}</time>
                              </div>
                            )}
                            {dayInfo.schedule.notes && (
                              <div className="text-sm glass-text-body italic mb-2">{dayInfo.schedule.notes}</div>
                            )}
                          </>
                        )}
                        
                        {hasLocation && (
                          <a
                            href={getDirectionsUrl(dayInfo.event?.location || dayInfo.schedule.location!)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                            aria-label={isThisToday ? "Get directions to today's location" : `Get directions to ${dayInfo.day} location`}
                          >
                            <span>{isThisToday ? 'Get Directions' : 'Get Directions'}</span>
                          </a>
                        )}
                        
                        {dayInfo.event && (
                          <button 
                            onClick={() => addToCalendar(dayInfo.event!)}
                            className="mt-3 px-6 py-2 rounded-full glass-button text-black font-bold shadow hover:scale-105 transition-all flex items-center gap-2 text-lg border border-yellow-400"
                            aria-label={`Add ${dayInfo.event.title} to Google Calendar`}
                          >
                            <span aria-hidden="true">📅</span>
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
              <EventsList
                events={upcomingEvents}
                title="Future Events"
                emptyMessage="Private events and catering available"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}