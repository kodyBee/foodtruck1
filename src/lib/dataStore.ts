import { prisma } from '@/lib/db';

// Helper to format dates for your frontend components
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const dataStore = {
  getLocation: async () => {
    // Get the most recently updated location
    const location = await prisma.truckLocation.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    return location || { 
      lat: 40.7128, 
      lng: -74.0060, 
      address: "Default Location", 
      updatedAt: new Date() 
    };
  },
  
  updateLocation: async (lat: number, lng: number, address: string) => {
    return await prisma.truckLocation.create({
      data: { lat, lng, address }
    });
  },

  getEvents: async () => {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    return events.map((e: any) => ({
      ...e,
      date: formatDate(e.date) // Convert DateTime to string YYYY-MM-DD
    }));
  },
  
  addEvent: async (event: any) => {
    return await prisma.event.create({
      data: {
        ...event,
        date: new Date(event.date)
      }
    });
  },

  updateEvent: async (id: string, event: any) => {
    const data = { ...event };
    if (data.date) data.date = new Date(data.date);
    
    return await prisma.event.update({
      where: { id },
      data
    });
  },

  deleteEvent: async (id: string) => {
    try {
      await prisma.event.delete({ where: { id } });
      return true;
    } catch (e) {
      return false;
    }
  },

  getSchedule: async () => {
    return await prisma.weeklySchedule.findMany({
      orderBy: { order: 'asc' }
    });
  },
  
  updateSchedule: async (schedule: any[]) => {
    // Transaction to update all days
    const updates = schedule.map(day => 
      prisma.weeklySchedule.upsert({
        where: { day: day.day },
        update: { location: day.location, time: day.time, notes: day.notes },
        create: { 
          day: day.day, 
          location: day.location, 
          time: day.time, 
          notes: day.notes,
          order: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].indexOf(day.day)
        }
      })
    );
    await prisma.$transaction(updates);
    return schedule;
  },
};