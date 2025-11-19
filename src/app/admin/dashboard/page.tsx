'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { TruckEvent, WeeklySchedule } from '@/types';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'location' | 'events' | 'schedule'>('location');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [debugApiResponse, setDebugApiResponse] = useState<any>(null);

  // Location state
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [address, setAddress] = useState('');
  const [mapsLink, setMapsLink] = useState('');

  // Events state
  const [events, setEvents] = useState<TruckEvent[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    type: 'this-week' as 'this-week' | 'upcoming',
  });

  // Schedule state
  const [schedule, setSchedule] = useState<WeeklySchedule[]>([
    { day: 'Monday' },
    { day: 'Tuesday' },
    { day: 'Wednesday' },
    { day: 'Thursday' },
    { day: 'Friday' },
    { day: 'Saturday' },
    { day: 'Sunday' },
  ]);
  const [scheduleMapsLinks, setScheduleMapsLinks] = useState<Record<number, string>>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  const loadData = async () => {
    try {
      const [locationRes, eventsRes, scheduleRes] = await Promise.all([
        fetch('/api/location'),
        fetch('/api/events'),
        fetch('/api/schedule'),
      ]);

      const locationData = await locationRes.json();
      const eventsData = await eventsRes.json();
      const scheduleData = await scheduleRes.json();

      setLat(locationData.lat.toString());
      setLng(locationData.lng.toString());
      setAddress(locationData.address);
      setMapsLink('');
      setEvents(eventsData);
      
      if (scheduleData.length > 0) {
        setSchedule(scheduleData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const parseAddressFromMapsLink = async (link: string) => {
    try {
      let urlToCheck = link;

      // Resolve shortened links
      if (link.includes('maps.app.goo.gl') || link.includes('goo.gl/maps') || link.includes('goo.gl')) {
        try {
          const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(link)}`);
          if (response.ok) {
            const data = await response.json();
            
            // If API returned a place name, use it directly
            if (data.placeName) {
              return data.placeName;
            }
            
            // If we got coordinates but no place name, use them
            if (data.lat && data.lng) {
              return `${data.lat}, ${data.lng}`;
            }
            
            // Fall back to parsing the resolved URL
            if (data.resolvedUrl) {
              urlToCheck = data.resolvedUrl;
            }
          }
        } catch (e) {
          console.error('Failed to resolve short link:', e);
        }
      }

      // Try to extract place name from URL
      // Format: /maps/place/Place+Name+Here/@...
      const placeMatch = urlToCheck.match(/\/place\/([^/@]+)/);
      if (placeMatch) {
        const placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
        return placeName;
      }

      // Try to extract from query parameter
      const qMatch = urlToCheck.match(/[?&]q=([^&@]+)/);
      if (qMatch) {
        return decodeURIComponent(qMatch[1]).replace(/\+/g, ' ');
      }

      // If we can at least get coordinates, return them as a location
      const coords = await parseGoogleMapsLink(link);
      if (coords) {
        return `${coords.lat}, ${coords.lng}`;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const handleScheduleMapsLink = async (dayIndex: number, link: string) => {
    if (!link.trim()) {
      setScheduleMapsLinks({ ...scheduleMapsLinks, [dayIndex]: '' });
      return;
    }

    setScheduleMapsLinks({ ...scheduleMapsLinks, [dayIndex]: link });
    
    const address = await parseAddressFromMapsLink(link);
    if (address) {
      updateScheduleDay(dayIndex, 'location', address);
    }
  };

  const parseGoogleMapsLink = async (link: string) => {
    try {
      let urlToCheck = link;

      // If it's a shortened link, we need to fetch it to get redirected URL
      if (link.includes('maps.app.goo.gl') || link.includes('goo.gl/maps') || link.includes('goo.gl')) {
        try {
          const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(link)}`);
          if (response.ok) {
            const data = await response.json();
            console.log('[AdminDashboard] API response for maps link:', data);
            
            // If API returned parsed coordinates and place name, use them directly
            if (data.lat && data.lng) {
              // Also update the address if we got a place name
              if (data.placeName && !address) {
                setAddress(data.placeName);
              }
              console.log('[AdminDashboard] Using lat/lng from API:', data.lat, data.lng);
              return { lat: data.lat.toString(), lng: data.lng.toString() };
            }
            
            // Fall back to parsing the resolved URL
            if (data.resolvedUrl) {
              urlToCheck = data.resolvedUrl;
              console.log('[AdminDashboard] Falling back to resolvedUrl:', urlToCheck);
            }
          }
        } catch (e) {
          // If resolution fails, try to parse the original link anyway
          console.error('[AdminDashboard] Failed to resolve short link:', e);
        }
      }

      // Handle different Google Maps URL formats:
      // First, try to get the actual place coordinates from the data parameter (most accurate)
      // Format: !3d30.4209052!4d-81.6969373 (latitude and longitude)
      const dataParam = urlToCheck;
      const latMatch = dataParam.match(/!3d(-?\d+\.?\d*)/);
      const lngMatch = dataParam.match(/!4d(-?\d+\.?\d*)/);
      
      if (latMatch && lngMatch) {
        return { lat: latMatch[1], lng: lngMatch[1] };
      }

      // Fallback formats:
      // 1. https://www.google.com/maps/place/.../@LAT,LNG,ZOOM
      // 2. https://www.google.com/maps?q=LAT,LNG
      // 3. https://www.google.com/maps/@LAT,LNG,ZOOM
      // 4. https://www.google.com/maps/dir//LAT,LNG
      // 5. Plain coordinates in URL
      
      const atMatch = urlToCheck.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (atMatch) {
        return { lat: atMatch[1], lng: atMatch[2] };
      }

      const qMatch = urlToCheck.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (qMatch) {
        return { lat: qMatch[1], lng: qMatch[2] };
      }

      const dirMatch = urlToCheck.match(/\/dir\/\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (dirMatch) {
        return { lat: dirMatch[1], lng: dirMatch[2] };
      }

      // Try to find any coordinate pattern in the URL
      const coordMatch = urlToCheck.match(/(-?\d+\.?\d+),\s*(-?\d+\.?\d+)/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        // Validate that these look like real coordinates
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return { lat: coordMatch[1], lng: coordMatch[2] };
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let finalLat = lat;
    let finalLng = lng;

    // If mapsLink is provided, parse it
    if (mapsLink.trim()) {
      console.log('[AdminDashboard] Submitting mapsLink:', mapsLink);
      // Directly call the API for debug
      try {
        const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(mapsLink)}`);
        const data = await response.json();
        setDebugApiResponse(data);
        console.log('[AdminDashboard] API response:', data);
        // If lat/lng are missing but placeName is present, set address to placeName
        if (!data.lat && !data.lng && data.placeName) {
          setAddress(data.placeName);
          setLat('');
          setLng('');
          // Allow saving with just address
          finalLat = '';
          finalLng = '';
        }
      } catch (err) {
        setDebugApiResponse({ error: 'API call failed' });
      }
      const parsed = await parseGoogleMapsLink(mapsLink);
      console.log('[AdminDashboard] parseGoogleMapsLink result:', parsed);
      if (parsed) {
        finalLat = parsed.lat;
        finalLng = parsed.lng;
        setLat(parsed.lat);
        setLng(parsed.lng);
      } else if (!finalLat && !finalLng && address) {
        // If we have an address, allow saving with just address
      } else {
        setMessage('Invalid Google Maps link. Please check the URL and try again.');
        setLoading(false);
        return;
      }
    }

    // Validate we have coordinates
    if (!finalLat || !finalLng) {
      setMessage('Please provide either a Google Maps link or enter coordinates manually.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: parseFloat(finalLat),
          lng: parseFloat(finalLng),
          address,
        }),
      });

      if (response.ok) {
        setMessage('Location updated successfully!');
        setMapsLink('');
      } else {
        setMessage('Failed to update location');
      }
    } catch (error) {
      setMessage('Error updating location');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const isEditing = editingEventId !== null;

    try {
      const response = await fetch('/api/events', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...newEvent, id: editingEventId } : newEvent),
      });

      if (response.ok) {
        setMessage(isEditing ? 'Event updated successfully!' : 'Event added successfully!');
        setNewEvent({
          title: '',
          date: '',
          time: '',
          location: '',
          description: '',
          type: 'this-week',
        });
        setEditingEventId(null);
        loadData();
      } else {
        setMessage(isEditing ? 'Failed to update event' : 'Failed to add event');
      }
    } catch (error) {
      setMessage(isEditing ? 'Error updating event' : 'Error adding event');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: TruckEvent) => {
    setEditingEventId(event.id);
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time || '',
      location: event.location,
      description: event.description || '',
      type: event.type,
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      type: 'this-week',
    });
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Event deleted successfully!');
        loadData();
      }
    } catch (error) {
      setMessage('Error deleting event');
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedule),
      });

      if (response.ok) {
        setMessage('Schedule updated successfully!');
      } else {
        setMessage('Failed to update schedule');
      }
    } catch (error) {
      setMessage('Error updating schedule');
    } finally {
      setLoading(false);
    }
  };

  const updateScheduleDay = (index: number, field: keyof WeeklySchedule, value: string) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
      {debugApiResponse && (
        <div className="bg-gray-900 border border-red-500 text-red-500 p-4 mb-4 rounded">
          <strong>API Debug Response:</strong>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(debugApiResponse, null, 2)}</pre>
        </div>
      )}
      {/* Header */}
      <div className="bg-neutral-900 border-b border-yellow-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-yellow-500">
              Admin Dashboard
            </h1>
            <div className="flex gap-4 items-center">
              <span className="text-gray-400">Welcome, {session.user?.name}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-yellow-500/30">
          <button
            onClick={() => setActiveTab('location')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'location'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            Truck Location
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'events'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'schedule'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            Weekly Schedule
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success')
              ? 'bg-green-500/10 border border-green-500 text-green-500'
              : 'bg-red-500/10 border border-red-500 text-red-500'
          }`}>
            {message}
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Update Truck Location</h2>
            <form onSubmit={handleLocationSubmit} className="space-y-6">
              <div>
                <label className="block text-yellow-500 font-semibold mb-2">
                  Google Maps Link
                </label>
                <input
                  type="text"
                  value={mapsLink}
                  onChange={(e) => {
                    setMapsLink(e.target.value);
                    console.log('[AdminDashboard] mapsLink input changed:', e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="Paste Google Maps link here (e.g., https://maps.app.goo.gl/...)"
                />
                <p className="text-gray-500 text-sm mt-2">
                  Paste a Google Maps link and we&apos;ll extract the coordinates automatically
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-yellow-500/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-neutral-900 text-gray-500">OR enter manually</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-yellow-500 font-semibold mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Location'}
              </button>
            </form>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Add Event Form */}
            <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingEventId ? 'Edit Event' : 'Add New Event'}
                </h2>
                {editingEventId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handleEventSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-yellow-500 font-semibold mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-500 font-semibold mb-2">
                      Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'this-week' | 'upcoming' })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="this-week">This Week</option>
                      <option value="upcoming">Upcoming</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-yellow-500 font-semibold mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-500 font-semibold mb-2">
                      Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    placeholder="Event location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 resize-none"
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (editingEventId ? 'Updating...' : 'Adding...') : (editingEventId ? 'Update Event' : 'Add Event')}
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Current Events</h2>
              {events.length === 0 ? (
                <p className="text-gray-400">No events yet. Add your first event above.</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-neutral-800 border border-yellow-500/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                          <p className="text-yellow-500 mb-1">
                            {new Date(event.date).toLocaleDateString()} {event.time && `at ${event.time}`}
                          </p>
                          <p className="text-gray-400 mb-1">📍 {event.location}</p>
                          {event.description && (
                            <p className="text-gray-400 mt-2">{event.description}</p>
                          )}
                          <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-500 text-sm rounded">
                            {event.type === 'this-week' ? 'This Week' : 'Upcoming'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Weekly Schedule</h2>
            <p className="text-gray-400 mb-6">
              Paste a Google Maps link to auto-fill the location, or enter manually.
            </p>
            <form onSubmit={handleScheduleSubmit} className="space-y-6">
              {schedule.map((day, index) => (
                <div key={day.day} className="bg-neutral-800 border border-yellow-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-yellow-500 mb-3">{day.day}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Google Maps Link (Optional)</label>
                      <input
                        type="text"
                        value={scheduleMapsLinks[index] || ''}
                        onChange={(e) => handleScheduleMapsLink(index, e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-700 border border-yellow-500/30 rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                        placeholder="Paste Google Maps link to auto-fill location"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Location</label>
                        <input
                          type="text"
                          value={day.location || ''}
                          onChange={(e) => updateScheduleDay(index, 'location', e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-700 border border-yellow-500/30 rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                          placeholder="Location or 'Closed'"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Time</label>
                        <input
                          type="text"
                          value={day.time || ''}
                          onChange={(e) => updateScheduleDay(index, 'time', e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-700 border border-yellow-500/30 rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                          placeholder="11am - 8pm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Notes</label>
                        <input
                          type="text"
                          value={day.notes || ''}
                          onChange={(e) => updateScheduleDay(index, 'notes', e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-700 border border-yellow-500/30 rounded text-white text-sm focus:outline-none focus:border-yellow-500"
                          placeholder="Special notes"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Schedule'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
