'use client';
import { useEffect, useRef } from 'react';

// Leaflet butuh window, jadi dimuat dinamis di effect. circleMarker menghindari masalah path ikon bawaan.
export default function MapView({ lat, lng }: { lat: number; lng: number }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: any;
    (async () => {
      const L = (await import('leaflet')).default;
      if (!el.current) return;
      map = L.map(el.current).setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
      L.circleMarker([lat, lng], { radius: 10, color: '#059669', fillColor: '#10b981', fillOpacity: 0.8 }).addTo(map);
    })();
    return () => map?.remove();
  }, [lat, lng]);
  return <div ref={el} className="h-56 w-full rounded-lg z-0" role="img" aria-label={`Peta lokasi ${lat}, ${lng}`} />;
}
