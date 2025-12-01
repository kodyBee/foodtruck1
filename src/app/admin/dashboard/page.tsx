'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { TruckEvent, WeeklySchedule } from '@/types';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'events' | 'schedule' | 'menu'>('events');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

  // Menu state
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
    imageUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      const [eventsRes, scheduleRes, menuRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/schedule'),
        fetch('/api/menu'),
      ]);

      const eventsData = await eventsRes.json();
      const scheduleData = await scheduleRes.json();
      const menuData = await menuRes.json();

      setEvents(eventsData);
      
      if (scheduleData.length > 0) {
        setSchedule(scheduleData);
      }

      setMenuItems(menuData);
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

      // Try to get coordinates
      const atMatch = urlToCheck.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (atMatch) {
        return `${atMatch[1]}, ${atMatch[2]}`;
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

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const isEditing = editingMenuId !== null;

    try {
      const response = await fetch('/api/menu', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? { ...newMenuItem, id: editingMenuId } : newMenuItem),
      });

      if (response.ok) {
        setMessage(isEditing ? 'Menu item updated successfully!' : 'Menu item added successfully!');
        setNewMenuItem({
          name: '',
          description: '',
          price: '',
          category: '',
          available: true,
          imageUrl: '',
        });
        setImagePreview(null);
        setEditingMenuId(null);
        loadData();
      } else {
        setMessage(isEditing ? 'Failed to update menu item' : 'Failed to add menu item');
      }
    } catch (error) {
      setMessage(isEditing ? 'Error updating menu item' : 'Error adding menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setMessage('Invalid file type. Only images are allowed.');
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage('File too large. Maximum size is 50MB.');
      return;
    }

    setUploadingImage(true);
    setMessage('');

    try {
      console.log('Uploading file:', file.name, file.type, file.size);

      // Use Vercel Blob client-side upload
      const { upload } = await import('@vercel/blob/client');
      
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-token',
      });

      console.log('Upload successful:', blob.url);
      
      setNewMenuItem({ ...newMenuItem, imageUrl: blob.url });
      setImagePreview(blob.url);
      setMessage('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(error?.message || 'Error uploading image. Check console for details.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setNewMenuItem({ ...newMenuItem, imageUrl: '' });
    setImagePreview(null);
  };

  const handleEditMenuItem = (item: any) => {
    setEditingMenuId(item.id);
    setNewMenuItem({
      name: item.name,
      description: item.description || '',
      price: item.price || '',
      category: item.category,
      available: item.available,
      imageUrl: item.imageUrl || '',
    });
    setImagePreview(item.imageUrl || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelMenuEdit = () => {
    setEditingMenuId(null);
    setNewMenuItem({
      name: '',
      description: '',
      price: '',
      category: '',
      available: true,
      imageUrl: '',
    });
    setImagePreview(null);
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const response = await fetch(`/api/menu?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Menu item deleted successfully!');
        loadData();
      }
    } catch (error) {
      setMessage('Error deleting menu item');
    }
  };

  const toggleMenuItemAvailability = async (id: string, currentAvailability: boolean) => {
    try {
      const item = menuItems.find(i => i.id === id);
      if (!item) return;

      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, id, available: !currentAvailability }),
      });

      if (response.ok) {
        setMessage(`Menu item ${!currentAvailability ? 'enabled' : 'disabled'} successfully!`);
        loadData();
      }
    } catch (error) {
      setMessage('Error updating menu item availability');
    }
  };

  const getUniqueCategories = () => {
    const categories = new Set(menuItems.map(item => item.category));
    return Array.from(categories).sort();
  };

  const getMenuItemsByCategory = () => {
    const grouped: Record<string, any[]> = {};
    menuItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
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
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'events'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            One-Time Events
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
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'menu'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            Menu Management
          </button>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-300 text-sm">
            <strong>Note:</strong> The truck&apos;s current location on the website is automatically determined by today&apos;s date. 
            If there&apos;s a one-time event scheduled for today, that location will be shown. 
            Otherwise, it will fall back to today&apos;s entry in the weekly schedule.
          </p>
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

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Add Event Form */}
            <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {editingEventId ? 'Edit Event' : 'Add New One-Time Event'}
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
              <p className="text-gray-400 mb-6 text-sm">
                Add special one-time events like festivals, private bookings, or appearances at specific locations. 
                These events will override the weekly schedule on their date and will be shown as the current location 
                on the truck page if they&apos;re happening today.
              </p>
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
            <h2 className="text-2xl font-bold text-white mb-4">Weekly Schedule - Recurring Locations</h2>
            <p className="text-gray-400 mb-6 text-sm">
              Set up your regular weekly schedule here. These are the locations where you&apos;ll be every week on these days.
              If you have a one-time event scheduled for a specific day, it will override this schedule for that day only.
              You can paste a Google Maps link to auto-fill the location, or enter manually.
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

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            {/* Add/Edit Menu Item Form */}
            <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  {editingMenuId ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
                {editingMenuId && (
                  <button
                    type="button"
                    onClick={handleCancelMenuEdit}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <p className="text-gray-400 mb-6 text-sm">
                Add or edit menu items. Items can be organized by category. 
                You can temporarily disable items without deleting them by toggling their availability.
              </p>
              <form onSubmit={handleMenuSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-yellow-500 font-semibold mb-2">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-yellow-500 font-semibold mb-2">
                      Price
                    </label>
                    <input
                      type="text"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                      placeholder="$12.99"
                    />
                  </div>
                </div>
                
                {/* Image Upload Section */}
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Item Image
                  </label>
                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-48 h-48 object-cover rounded-lg border-2 border-yellow-500/30"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <label className="cursor-pointer px-6 py-3 bg-neutral-800 border-2 border-dashed border-yellow-500/30 rounded-lg hover:border-yellow-500 transition-colors">
                          <span className="text-white">
                            {uploadingImage ? 'Uploading...' : 'Choose Image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        <span className="text-gray-400 text-sm">JPG, PNG, WebP (Max 50MB)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={newMenuItem.category}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                    placeholder="e.g., Wings, Sandwiches & Cheesesteaks, Sides"
                    required
                    list="categories"
                  />
                  <datalist id="categories">
                    {getUniqueCategories().map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                  <p className="text-gray-400 text-xs mt-1">
                    Type a new category name or select an existing one
                  </p>
                </div>
                <div>
                  <label className="block text-yellow-500 font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={newMenuItem.description}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 resize-none"
                    rows={3}
                    placeholder="Brief description of the menu item"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="available"
                    checked={newMenuItem.available}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, available: e.target.checked })}
                    className="w-5 h-5 bg-neutral-800 border border-yellow-500/30 rounded focus:ring-2 focus:ring-yellow-500"
                  />
                  <label htmlFor="available" className="text-white font-semibold">
                    Available (uncheck to temporarily hide from menu)
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? (editingMenuId ? 'Updating...' : 'Adding...') : (editingMenuId ? 'Update Item' : 'Add Item')}
                </button>
              </form>
            </div>

            {/* Menu Items List by Category */}
            <div className="bg-neutral-900 border border-yellow-500/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Current Menu Items</h2>
              {menuItems.length === 0 ? (
                <p className="text-gray-400">No menu items yet. Add your first item above.</p>
              ) : (
                <div className="space-y-8">
                  {Object.entries(getMenuItemsByCategory()).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold text-yellow-500 mb-4 pb-2 border-b border-yellow-500/30">
                        {category} ({items.length} items)
                      </h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`bg-neutral-800 border rounded-lg p-4 ${
                              item.available 
                                ? 'border-yellow-500/20' 
                                : 'border-gray-500/20 opacity-60'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex gap-4 flex-1">
                                {item.imageUrl && (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg border border-yellow-500/20"
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-lg font-bold text-white">
                                      {item.name}
                                    </h4>
                                    {item.price && (
                                      <span className="text-yellow-500 font-semibold">
                                        {item.price}
                                      </span>
                                    )}
                                    {!item.available && (
                                      <span className="px-2 py-1 bg-gray-500/30 text-gray-400 text-xs rounded">
                                        Hidden
                                      </span>
                                    )}
                                  </div>
                                  {item.description && (
                                    <p className="text-gray-400 text-sm">{item.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button
                                  onClick={() => toggleMenuItemAvailability(item.id, item.available)}
                                  className={`px-3 py-2 ${
                                    item.available 
                                      ? 'bg-orange-500 hover:bg-orange-600' 
                                      : 'bg-green-500 hover:bg-green-600'
                                  } text-white text-sm font-semibold rounded-lg transition-colors`}
                                  title={item.available ? 'Hide from menu' : 'Show on menu'}
                                >
                                  {item.available ? 'Hide' : 'Show'}
                                </button>
                                <button
                                  onClick={() => handleEditMenuItem(item)}
                                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
