import { prisma } from '@/lib/db';

// Helper to format dates for your frontend components
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const dataStore = {
  getCurrentLocation: async () => {
    // Get today's date normalized to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatDate(today);
    
    // Check if there's an event today
    const todayEvent = await prisma.event.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { date: 'asc' }
    });
    
    if (todayEvent) {
      // Parse location to extract coordinates if it's in "lat, lng" format
      const coordMatch = todayEvent.location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (coordMatch) {
        return {
          lat: parseFloat(coordMatch[1]),
          lng: parseFloat(coordMatch[2]),
          address: todayEvent.title,
          updatedAt: new Date()
        };
      }
      // Otherwise return without coordinates, just address
      return {
        lat: 0,
        lng: 0,
        address: todayEvent.location,
        updatedAt: new Date()
      };
    }
    
    // Fall back to weekly schedule
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDayName = daysOfWeek[today.getDay()];
    
    const scheduleDay = await prisma.weeklySchedule.findFirst({
      where: { day: todayDayName }
    });
    
    if (scheduleDay?.location) {
      // Parse location to extract coordinates if it's in "lat, lng" format
      const coordMatch = scheduleDay.location.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
      if (coordMatch) {
        return {
          lat: parseFloat(coordMatch[1]),
          lng: parseFloat(coordMatch[2]),
          address: scheduleDay.location,
          updatedAt: new Date()
        };
      }
      return {
        lat: 0,
        lng: 0,
        address: scheduleDay.location,
        updatedAt: new Date()
      };
    }
    
    // Default fallback
    return { 
      lat: 0, 
      lng: 0, 
      address: "Check our social media for today's location", 
      updatedAt: new Date() 
    };
  },
  
  getLocation: async () => {
    // Alias to getCurrentLocation for backward compatibility
    return dataStore.getCurrentLocation();
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
    // Filter to only include valid Prisma Event fields
    const { title, date, time, location, locationName, description, type } = event;
    const data: any = {};
    
    if (title !== undefined) data.title = title;
    if (date !== undefined) data.date = new Date(date);
    if (time !== undefined) data.time = time;
    if (location !== undefined) data.location = location;
    if (locationName !== undefined) data.locationName = locationName;
    if (description !== undefined) data.description = description;
    if (type !== undefined) data.type = type;
    
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
        update: { location: day.location, locationName: day.locationName, time: day.time, notes: day.notes },
        create: { 
          day: day.day, 
          location: day.location,
          locationName: day.locationName,
          time: day.time, 
          notes: day.notes,
          order: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].indexOf(day.day)
        }
      })
    );
    await prisma.$transaction(updates);
    return schedule;
  },

  getMenuItems: async () => {
    return await prisma.menuItem.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
  },

  addMenuItem: async (item: any) => {
    return await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: item.available ?? true,
        imageUrl: item.imageUrl
      }
    });
  },

  updateMenuItem: async (id: string, item: any) => {
    return await prisma.menuItem.update({
      where: { id },
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        available: item.available,
        imageUrl: item.imageUrl
      }
    });
  },

  deleteMenuItem: async (id: string) => {
    try {
      await prisma.menuItem.delete({ where: { id } });
      return true;
    } catch (e) {
      return false;
    }
  },
};