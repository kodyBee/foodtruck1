// In-memory storage for demo (replace with database in production)
interface StorageData {
  location: {
    lat: number;
    lng: number;
    address: string;
    updatedAt: string;
  };
  events: Array<{
    id: string;
    title: string;
    date: string;
    time?: string;
    location: string;
    description?: string;
    type: 'this-week' | 'upcoming';
  }>;
  schedule: Array<{
    day: string;
    location?: string;
    time?: string;
    notes?: string;
  }>;
}

// Initialize with default data
let storage: StorageData = {
  location: {
    lat: Number(process.env.NEXT_PUBLIC_TRUCK_LAT) || 40.7128,
    lng: Number(process.env.NEXT_PUBLIC_TRUCK_LNG) || -74.0060,
    address: process.env.NEXT_PUBLIC_TRUCK_ADDRESS || "New York, NY",
    updatedAt: new Date().toISOString(),
  },
  events: [],
  schedule: [],
};

export const dataStore = {
  getLocation: () => storage.location,
  
  updateLocation: (lat: number, lng: number, address: string) => {
    storage.location = {
      lat,
      lng,
      address,
      updatedAt: new Date().toISOString(),
    };
    return storage.location;
  },

  getEvents: () => storage.events,
  
  addEvent: (event: Omit<StorageData['events'][0], 'id'>) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
    };
    storage.events.push(newEvent);
    return newEvent;
  },

  updateEvent: (id: string, event: Partial<StorageData['events'][0]>) => {
    const index = storage.events.findIndex(e => e.id === id);
    if (index !== -1) {
      storage.events[index] = { ...storage.events[index], ...event };
      return storage.events[index];
    }
    return null;
  },

  deleteEvent: (id: string) => {
    const index = storage.events.findIndex(e => e.id === id);
    if (index !== -1) {
      storage.events.splice(index, 1);
      return true;
    }
    return false;
  },

  getSchedule: () => storage.schedule,
  
  updateSchedule: (schedule: StorageData['schedule']) => {
    storage.schedule = schedule;
    return storage.schedule;
  },
};
