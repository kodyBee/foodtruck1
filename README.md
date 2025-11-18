# Crown Majestic Kitchen 👑

A modern, production-ready food truck website built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **SEO Optimized**: Complete metadata, Open Graph tags, sitemap, and robots.txt
- **Google Maps Integration**: Real-time truck location with directions
- **Admin Dashboard**: Manage truck location, events, and schedule
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Performance**: Optimized images, caching, and compression
- **Security**: Security headers, CSP, XSS protection, authentication
- **Error Handling**: Error boundaries, custom 404/500 pages, loading states
- **Analytics Ready**: Google Analytics integration
- **Accessibility**: WCAG compliant, ARIA labels, keyboard navigation
- **Type Safety**: Full TypeScript coverage
- **Production Ready**: Environment variables, security best practices

## 📋 Prerequisites

- Node.js 20+ 
- npm, yarn, or pnpm
- Google Maps API key (for truck location feature)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd crown
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_TRUCK_LAT=40.7128
   NEXT_PUBLIC_TRUCK_LNG=-74.0060
   NEXT_PUBLIC_TRUCK_ADDRESS="New York, NY"
   ```

4. **Get a Google Maps API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Maps Embed API" and "Maps JavaScript API"
   - Create credentials (API Key)
   - Copy your API key to `.env.local`

## 🏃 Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
crown/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── components/         # Shared components
│   │   ├── contact/           # Contact page
│   │   ├── menu/              # Menu page
│   │   ├── merchandise/       # Merchandise page
│   │   ├── truck/             # Truck location page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── error.tsx          # Error page
│   │   ├── not-found.tsx      # 404 page
│   │   ├── loading.tsx        # Loading state
│   │   ├── sitemap.ts         # Dynamic sitemap
│   │   └── opengraph-image.tsx # OG image
│   ├── components/            # Reusable components
│   │   ├── Analytics.tsx      # Google Analytics
│   │   └── ErrorBoundary.tsx  # Error boundary
│   ├── config/                # Configuration files
│   │   └── site.ts           # Site config
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static files
│   ├── manifest.json         # PWA manifest
│   └── robots.txt            # SEO robots file
├── .env.example              # Environment variables template
├── .env.local                # Your local environment (git-ignored)
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🔧 Configuration

### Updating Truck Location

Update the food truck's location in `.env.local`:

```env
NEXT_PUBLIC_TRUCK_LAT=40.7128
NEXT_PUBLIC_TRUCK_LNG=-74.0060
NEXT_PUBLIC_TRUCK_ADDRESS="123 Main St, City, State"
```

### Adding Google Analytics

1. Get your GA4 Measurement ID from Google Analytics
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Customizing Content

- **Menu Items**: Edit `src/app/menu/page.tsx`
- **Merchandise**: Edit `src/app/merchandise/page.tsx`
- **Contact Info**: Edit `src/config/site.ts`
- **Images**: Replace files in `/public/` directory

### Admin Dashboard

Access the admin dashboard at `/admin/login` (default: admin/admin).

**Features**:
- Update truck location in real-time
- Add/edit/delete events
- Manage weekly schedule

See [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) for detailed instructions.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the project:
```bash
npm run build
```

The output will be in `.next/` directory. Follow your hosting provider's Next.js deployment guide.

## 🔒 Security Best Practices

✅ Environment variables for sensitive data  
✅ Security headers configured  
✅ XSS protection enabled  
✅ CSP headers for images  
✅ API keys never committed to git  
✅ Input sanitization (implement server-side validation for forms)  

## 📊 Performance Optimizations

- Image optimization with Next.js Image component
- Automatic code splitting
- Font optimization with next/font
- Compression enabled
- Production console.log removal
- Lazy loading for images and components

## ♿ Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Semantic HTML structure
- Color contrast compliance
- Screen reader friendly

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🛡️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps API key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your site URL |
| `NEXT_PUBLIC_TRUCK_LAT` | Yes | Truck latitude |
| `NEXT_PUBLIC_TRUCK_LNG` | Yes | Truck longitude |
| `NEXT_PUBLIC_TRUCK_ADDRESS` | Yes | Truck address display |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics ID |
| `NEXTAUTH_URL` | Yes | Site URL for auth |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret key |
| `ADMIN_USERNAME` | Yes | Admin login username |
| `ADMIN_PASSWORD_HASH` | Yes | Bcrypt hashed password |

## 🐛 Troubleshooting

**Maps not loading?**
- Check your Google Maps API key
- Ensure "Maps Embed API" is enabled
- Verify API key restrictions

**Build errors?**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check TypeScript errors: `npm run build`

## 📄 License

This project is private and proprietary.

## 🤝 Support

For questions or issues, contact: contact@crownmajestic.com

---

Built with ❤️ by Crown Majestic Kitchen
