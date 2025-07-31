import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";
import { useGlobal } from "../../../context/ContextHolder";
import { useCallback } from "react";

const WorkerMap = ({ locationCoordinates }) => {

    const { role } = useGlobal()
    const handleGetDirections = useCallback(() => {
        const {lat, lng} = locationCoordinates;
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(googleMapsUrl, "_blank");
    }, [locationCoordinates])

    return (
        <div className="w-full h-full flex justify-center items-start flex-col">
            <MapContainer center={locationCoordinates || [51.505, -0.09]} // Default to London if no position
            zoom={13} style={{ height: "100%", width: "100%" }}
            >
                {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                /> */}
                {locationCoordinates && (
                    <Marker position={locationCoordinates}
                        icon={L.icon({
                            iconUrl: markerIconPng,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            shadowUrl: "leaflet/dist/images/marker-shadow.png",
                        })}
                    >
                        <Popup>Location</Popup>
                    </Marker>
                )}
            </MapContainer>
            {role != 'client' &&
                <button type="button" onClick={handleGetDirections} className="absolute left-0 bottom-0 z-[400] px-4 py-2 bg-green-500 text-white rounded">
                    Get Directions
                </button>
            }  
        </div>
    )
}

export default WorkerMap
