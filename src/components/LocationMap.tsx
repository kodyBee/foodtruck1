interface LocationMapProps {
  apiKey: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
}

export default function LocationMap({ apiKey, location }: LocationMapProps) {
  // For embed URL, use coordinates if available, otherwise use search mode with address
  const mapEmbedUrl = (location.lat && location.lng && location.lat !== 0 && location.lng !== 0)
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${location.lat},${location.lng}&zoom=15`
    : `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(location.address)}&zoom=15`;

  return (
    <div className="glass-card glass-card-border shadow-2xl rounded-3xl p-4">
      <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-2xl border-2 glass-card-border">
        <iframe
          key={mapEmbedUrl}
          title="Crown Majestic Kitchen Location Map"
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
          aria-label="Google Map showing food truck location"
        />
      </div>
    </div>
  );
}
