import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocated } from "react-geolocated";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

const ClientMap = ({ addressCoordinates, onLocationUpdate }) => {
    const [position, setPosition] = useState(addressCoordinates);
    const { coords, getPosition } = useGeolocated({
      positionOptions: { enableHighAccuracy: true },
      userDecisionTimeout: 5000,
    });
    useEffect(() => {
        if (coords) {
        const newPosition = {lat: coords.latitude, lng: coords.longitude}
        setPosition(newPosition);
        onLocationUpdate(newPosition); // Update parent component state
      }
    }, [coords, onLocationUpdate]);
  
    const handleMyLocation = useCallback(() => getPosition(), [getPosition])
  
    const handleDragEnd = (event) => {
    //   const newCoordinates = [
    //     event.target.getLatLng().lat,
    //     event.target.getLatLng().lng,
    //   ];
    //   setPosition(newCoordinates);
    //   console.log(newCoordinates)
    //   onLocationUpdate(newCoordinates);
    }
    
    return (
        <div className="w-full h-full flex justify-center items-start flex-col">
            <MapContainer center={position || [51.505, -0.09]} // Default to London if no position
                zoom={13} style={{ height: "100%", width: "100%" }}
            >
                {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                /> */}
                {position && (
                    <Marker position={position} draggable={true} eventHandlers={{ dragend: handleDragEnd }}
                        icon={L.icon({
                            iconUrl: markerIconPng,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            shadowUrl: "leaflet/dist/images/marker-shadow.png",
                        })}
                    >
                        <Popup>Drag to adjust your location</Popup>
                    </Marker>
                )}
            </MapContainer>
            <button type="button" onClick={handleMyLocation} className="absolute left-0 bottom-0 z-[400] px-4 py-2 bg-blue-500 text-white rounded">
                My Current Location
            </button>
        </div>
    )
}

export default ClientMap
