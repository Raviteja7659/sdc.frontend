import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet's default marker icons reference image files by a relative
// path that breaks under Vite's bundling — this is the standard fix
// (point the icon URLs at a CDN copy of the same default markers).
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const meIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#f2b705;border:3px solid #1b1f27;box-shadow:0 0 0 4px rgba(242,183,5,0.35)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

function RecenterOnChange({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export default function NearbyVehiclesMap({ center, vehicles }) {
  return (
    <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnChange center={center} />

        <Marker position={center} icon={meIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {vehicles.map(({ vehicle, distanceKm }) => (
          <Marker key={vehicle.id} position={[vehicle.latitude, vehicle.longitude]} icon={defaultIcon}>
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong>
                  {vehicle.brand} {vehicle.model}
                </strong>
                <div style={{ fontSize: 12, color: '#5b5f66', margin: '4px 0' }}>
                  {distanceKm} km away · ₹{vehicle.pricePerHour}/hr
                </div>
                <Link to={`/vehicles/${vehicle.id}`} style={{ color: '#c98f02', fontWeight: 600, fontSize: 13 }}>
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
