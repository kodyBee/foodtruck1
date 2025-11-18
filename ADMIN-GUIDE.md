# Admin Dashboard Guide

## Overview

The Crown Majestic Kitchen admin dashboard allows you to manage:
- **Truck Location**: Update GPS coordinates and address
- **Events**: Add/edit/delete events for "This Week" and "Upcoming"
- **Weekly Schedule**: Manage daily schedule information

## Access

**URL**: `/admin/login`

**Default Credentials**:
- Username: `admin`
- Password: `admin`

⚠️ **IMPORTANT**: Change these credentials before deploying to production!

## Features

### 1. Truck Location Management
Update your food truck's current location:
- **Latitude**: GPS latitude coordinate
- **Longitude**: GPS longitude coordinate
- **Address**: Display address (e.g., "123 Main St, City, State")

Changes update the map and location on the `/truck` page instantly.

### 2. Event Management

**Add Events**:
- **Title**: Event name
- **Type**: "This Week" or "Upcoming"
- **Date**: Event date
- **Time**: Event time (optional)
- **Location**: Event location address
- **Description**: Additional details (optional)

**Manage Events**:
- View all events in a list
- Delete events with one click
- Events automatically display on the truck page

### 3. Weekly Schedule

Set your weekly schedule by day:
- **Location**: Where you'll be (or "Closed")
- **Time**: Operating hours (e.g., "11am - 8pm")
- **Notes**: Special information for that day

## Security

### Changing Admin Password

1. **Generate a hashed password**:
   ```bash
   # Install bcryptjs if not already
   npm install -g bcryptjs-cli
   
   # Generate hash
   bcryptjs "your-new-password"
   ```

2. **Update `.env.local`**:
   ```env
   ADMIN_PASSWORD_HASH=your_generated_hash_here
   ```

3. **Restart the server**

### Generating NextAuth Secret

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```env
NEXTAUTH_SECRET=your_generated_secret_here
```

## Data Storage

Currently using **in-memory storage** (data resets on server restart).

### For Production

Replace `src/lib/dataStore.ts` with a real database:

**Recommended Options**:
1. **Vercel Postgres** (if deploying to Vercel)
2. **MongoDB** with Mongoose
3. **Supabase** 
4. **PlanetScale** (MySQL)

**Example with Prisma**:
```bash
npm install prisma @prisma/client
npx prisma init
# Configure schema and migrate
```

## API Routes

All admin operations use these API endpoints:

### Location
- `GET /api/location` - Get current location
- `POST /api/location` - Update location (requires auth)

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Add new event (requires auth)
- `PUT /api/events` - Update event (requires auth)
- `DELETE /api/events?id={id}` - Delete event (requires auth)

### Schedule
- `GET /api/schedule` - Get weekly schedule
- `POST /api/schedule` - Update schedule (requires auth)

## Workflow

### Daily Location Update
1. Login to `/admin/dashboard`
2. Click "Truck Location" tab
3. Enter new coordinates and address
4. Click "Update Location"
5. Changes reflect on public truck page immediately

### Adding Weekly Events
1. Login to admin dashboard
2. Click "Events" tab
3. Fill out event form
4. Select "This Week" or "Upcoming"
5. Click "Add Event"
6. Event appears on truck page

### Managing Weekly Schedule
1. Login to admin dashboard
2. Click "Weekly Schedule" tab
3. Fill in location/time for each day
4. Leave blank for days you're closed
5. Click "Update Schedule"

## Tips

- **Regular Updates**: Update location daily for best customer experience
- **Clear Descriptions**: Add detailed event descriptions
- **Advance Notice**: Add upcoming events at least a week in advance
- **Mobile Access**: Dashboard works on mobile devices
- **Multiple Tabs**: Open in separate tabs for multitasking

## Troubleshooting

**Can't login?**
- Verify username and password in `.env.local`
- Check that `NEXTAUTH_SECRET` is set
- Clear browser cookies

**Changes not appearing?**
- Hard refresh the page (Ctrl+Shift+R)
- Check browser console for errors
- Verify you're logged in

**Lost admin password?**
- Generate new hash with bcryptjs
- Update `.env.local`
- Restart server

## Production Checklist

Before deploying:
- [ ] Change admin username and password
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Implement real database (replace dataStore.ts)
- [ ] Set up automated backups
- [ ] Configure SSL/HTTPS
- [ ] Test all features in production environment
- [ ] Set up monitoring and alerts

## Future Enhancements

Consider adding:
- Multiple admin users
- Image uploads for events
- Email notifications for new events
- Customer reviews management
- Order management integration
- Analytics dashboard
- Scheduled location updates
- Mobile app for quick updates

---

**Support**: For issues, check the main README.md or contact the development team.
