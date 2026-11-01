'use client';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

// MapLibre GL JS: vector tiles Carto Positron (clean, kontras bagus, tanpa API key)
export default function MapView({ lat, lng }: { lat: number; lng: number }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: any;
    (async () => {
      const ml = (await import('maplibre-gl')).default;
      if (!el.current) return;
      map = new ml.Map({
        container: el.current,
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [lng, lat],
        zoom: 15,
        attributionControl: false,
      });
      map.addControl(new ml.AttributionControl({ compact: true }));
      map.addControl(new ml.NavigationControl({ showCompass: false }), 'top-right');
      const pin = document.createElement('div');
      pin.className = 'w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-200 shadow-md';
      new ml.Marker({ element: pin }).setLngLat([lng, lat]).addTo(map);
    })();
    return () => map?.remove();
  }, [lat, lng]);

  return <div ref={el} className="h-56 w-full rounded-xl overflow-hidden border z-0" role="img" aria-label={`Peta lokasi ${lat}, ${lng}`} />;
}
