import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const Map = () => {
  const { mapMarkers, addMapMarker, updateScore, removeMarker } = useGameStore();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;
    
    // Initialize map only once
    mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Add click handler
    const handleClick = (e: L.LeafletMouseEvent) => {
      addMapMarker([e.latlng.lat, e.latlng.lng]);
      updateScore(1);
    };
    
    mapRef.current.on('click', handleClick);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleClick);
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleRemoveMarker = (e: CustomEvent) => {
      removeMarker(e.detail);
    };
    
    window.addEventListener('removeMarker', handleRemoveMarker as EventListener);
    return () => {
      window.removeEventListener('removeMarker', handleRemoveMarker as EventListener);
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear existing markers
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        mapRef.current?.removeLayer(layer);
      }
    });
    
    // Add new markers
    mapMarkers.forEach(marker => {
      L.marker([marker.position[0], marker.position[1]])
        .addTo(mapRef.current!)
        .bindPopup(`
          <div>
            <p>Marker by ${marker.createdBy}</p>
            <button onclick="window.dispatchEvent(new CustomEvent('removeMarker', { detail: '${marker.id}' }))">
              Remove
            </button>
          </div>
        `);
    });
  }, [mapMarkers]);

  return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
};
