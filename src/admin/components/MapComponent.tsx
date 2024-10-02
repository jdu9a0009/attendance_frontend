import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Создаем кастомную иконку маркера
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapComponentProps {
  coordinates: LatLngTuple;
  onPositionChange: (position: LatLngTuple) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ coordinates, onPositionChange }) => {
  const [position, setPosition] = useState<LatLngTuple>(coordinates);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    setPosition(coordinates);
  }, [coordinates]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newPos: LatLngTuple = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        onPositionChange(newPos);
      },
    });
    return null;
  };

  const updatePosition = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
      onPositionChange([newPos.lat, newPos.lng]);
    }
  };

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker 
        position={position}
        icon={customIcon}
        draggable={true}
        eventHandlers={{
          dragend: updatePosition,
        }}
        ref={markerRef}
      />
      <MapEvents />
    </MapContainer>
  );
};

export default MapComponent;