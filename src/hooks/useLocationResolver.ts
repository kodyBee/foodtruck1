import { useState, useCallback } from 'react';

interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

interface ResolvedLocationData {
  placeName?: string;
  lat?: number;
  lng?: number;
  resolvedUrl?: string;
}

export function useLocationResolver() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const resolveLocation = useCallback(async (locationAddress: string): Promise<void> => {
    // Check if it's a Google Maps short link
    if (locationAddress.includes('maps.app.goo.gl') || locationAddress.includes('goo.gl')) {
      setIsResolving(true);
      try {
        const response = await fetch(`/api/resolve-maps-link?url=${encodeURIComponent(locationAddress)}`);
        const data: ResolvedLocationData = await response.json();
        
        if (data.placeName || (data.lat && data.lng)) {
          const newLocation: Location = {
            address: data.placeName || locationAddress,
            lat: data.lat,
            lng: data.lng
          };
          setSelectedLocation(newLocation);
          return;
        }
        
        // Fallback: parse the resolved URL if API didn't extract info
        if (data.resolvedUrl) {
          const fullUrl = data.resolvedUrl;
          
          // Try to extract place name from the URL path
          const placeMatch = fullUrl.match(/\/maps\/place\/([^\/]+)/);
          if (placeMatch) {
            const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
            setSelectedLocation({ address: placeName });
            return;
          }
        }
      } catch (error) {
        console.error('Error resolving maps link:', error);
      } finally {
        setIsResolving(false);
      }
    }
    
    // Default: just use the address as-is
    setSelectedLocation({ address: locationAddress });
  }, []);

  return {
    selectedLocation,
    setSelectedLocation,
    resolveLocation,
    isResolving
  };
}
