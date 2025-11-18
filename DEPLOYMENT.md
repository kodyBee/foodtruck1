# Crown Majestic Kitchen - Production Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Update `.env.local` with production values
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Verify Google Maps API key works in production
- [ ] Add Google Analytics ID if using analytics
- [ ] Update truck location coordinates
- [ ] Never commit `.env.local` to git

### 2. Code Quality
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run build` - successful build
- [ ] Test all pages locally with production build
- [ ] Check browser console for errors
- [ ] Verify TypeScript types are correct

### 3. Content Updates
- [ ] Update all placeholder content
- [ ] Verify menu items are current
- [ ] Check merchandise availability
- [ ] Update contact information
- [ ] Replace demo images with real photos
- [ ] Update social media links in Footer

### 4. SEO & Metadata
- [ ] Verify all pages have unique metadata
- [ ] Test Open Graph tags with [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] Check sitemap at `/sitemap.xml`
- [ ] Verify robots.txt at `/robots.txt`
- [ ] Add Google Search Console verification
- [ ] Submit sitemap to Google Search Console

### 5. Performance
- [ ] Optimize all images (compress, WebP format)
- [ ] Test page speed with Lighthouse
- [ ] Verify lazy loading works
- [ ] Check mobile performance
- [ ] Test on slow 3G connection

### 6. Security
- [ ] API keys secured in environment variables
- [ ] Security headers configured in next.config.ts
- [ ] Forms have proper validation (add server-side)
- [ ] No sensitive data in client-side code
- [ ] HTTPS enabled on production domain

### 7. Testing
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS & Android)
- [ ] Test all navigation links
- [ ] Test Google Maps functionality
- [ ] Test "Get Directions" button
- [ ] Test responsive design at all breakpoints
- [ ] Test accessibility with screen reader

### 8. Analytics & Monitoring
- [ ] Google Analytics configured
- [ ] Analytics tracking verified
- [ ] Error monitoring setup (optional: Sentry)
- [ ] Uptime monitoring (optional: UptimeRobot)

## Deployment Steps

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure project settings

3. **Add Environment Variables**
   In Vercel dashboard, add:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_TRUCK_LAT`
   - `NEXT_PUBLIC_TRUCK_LNG`
   - `NEXT_PUBLIC_TRUCK_ADDRESS`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Verify deployment at provided URL

5. **Custom Domain** (Optional)
   - Add custom domain in Vercel settings
   - Update DNS records
   - Update `NEXT_PUBLIC_SITE_URL` to match domain
   - Redeploy

### Alternative Platforms

#### Netlify
```bash
npm run build
# Deploy .next directory to Netlify
```

#### AWS Amplify
```bash
# Configure amplify.yml
amplify init
amplify publish
```

#### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Post-Deployment

### Immediate Checks
- [ ] Visit production URL
- [ ] Test all pages load correctly
- [ ] Verify images display properly
- [ ] Test Google Maps
- [ ] Check mobile responsiveness
- [ ] Test form submissions (contact page)
- [ ] Verify analytics tracking

### Google Services Setup
1. **Google Search Console**
   - Add property for your domain
   - Verify ownership
   - Submit sitemap
   - Monitor indexing status

2. **Google Analytics**
   - Verify events are tracking
   - Set up conversion goals
   - Monitor real-time users

3. **Google My Business** (Optional)
   - Claim business listing
   - Add food truck photos
   - Update hours and location

### Social Media
- [ ] Share launch announcement
- [ ] Update social media bios with website link
- [ ] Create launch content
- [ ] Set up social media scheduling

## Maintenance

### Regular Updates
- **Daily**: Update truck location in `.env.local` and redeploy
- **Weekly**: Check analytics, update schedule
- **Monthly**: Review menu, merchandise, content
- **Quarterly**: Security updates, dependency updates

### Updating Truck Location
1. Update coordinates in Vercel environment variables
2. Redeploy (automatic if connected to git)
3. Or update `.env.local` locally and push changes

### Dependency Updates
```bash
npm outdated
npm update
npm audit fix
```

## Troubleshooting

### Build Fails
- Check TypeScript errors
- Verify all environment variables
- Clear build cache
- Check Node.js version compatibility

### Images Not Loading
- Verify image paths are correct
- Check Next.js Image configuration
- Ensure images exist in `/public/`

### Maps Not Working
- Verify API key is correct
- Check API key restrictions
- Enable required APIs in Google Cloud
- Check browser console for errors

### Performance Issues
- Run Lighthouse audit
- Optimize images further
- Check for unnecessary re-renders
- Review bundle size

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Google Maps API**: https://developers.google.com/maps
- **Web.dev Performance**: https://web.dev/performance

## Security Incident Response

If API key is compromised:
1. Immediately rotate key in Google Cloud Console
2. Update environment variables
3. Redeploy application
4. Monitor usage for suspicious activity

---

**Last Updated**: $(date)
**Version**: 1.0.0
