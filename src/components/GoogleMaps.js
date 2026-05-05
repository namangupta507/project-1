import React, { useState, useEffect, useRef, useContext } from "react";
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, Marker, MarkerF } from "@react-google-maps/api";
import { AuthContext } from "../context/AuthContext";

const containerStyle = {
    width: "100%",
    height: "100%",
};

const defaultCenter = {
    lat: 40.7128,
    lng: -74.006,
};

const libraries = ["places"];

const GoogleMaps = (
    { fromLocation, toLocation, isSingleLocation = false }
) => {
    // const { isLoaded, loadError } = useJsApiLoader({
    //     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    //     libraries,
    //     version: "weekly",
    // });
    const { isLoaded, loadError, mapCenter, setMapCenter } = useContext(AuthContext);
    const [directions, setDirections] = useState(null);

    const mapRef = useRef(null);

    console.log(fromLocation, "from")
    console.log(toLocation, "to")
    const normalizeLatLng = (location) => {
        if (!location) return null;
        if (location.coordinates) {
            return {
                lat: location.coordinates.latitude,
                lng: location.coordinates.longitude,
            };
        }
        return location; // assume it's already { lat, lng }
    };
    // Whenever from and to locations are set, request directions
    useEffect(() => {
        if (isSingleLocation || !fromLocation || !toLocation) {
            setDirections(null);
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        let fromCoordinates = {};
        let toCoordinates = {}

        if (fromLocation) {
            if (fromLocation.coordinates) {

                fromCoordinates = {
                    lat: fromLocation.coordinates.latitude,
                    lng: fromLocation.coordinates.longitude
                }
            }
            else { fromCoordinates = fromLocation }
        }
        if (toLocation) {
            if (toLocation.coordinates) {

                toCoordinates = {
                    lat: toLocation.coordinates.latitude,
                    lng: toLocation.coordinates.longitude
                }
            }
            else { toCoordinates = toLocation }
        }


        directionsService.route(
            {
                origin: fromCoordinates, // 👈 Fix: Use the coordinates
                destination: toCoordinates,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                console.log(result, "result")
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error("Error fetching directions", result);
                    setDirections(null);
                }
            }
        );
    }, [fromLocation, toLocation, isSingleLocation]);

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    console.log(normalizeLatLng(fromLocation), "vvhvhvbh")
    console.log('Single mode:', isSingleLocation);
    console.log('fromLocation:', fromLocation);
    console.log('Normalized:', normalizeLatLng(fromLocation));
    console.log('Map center:', mapCenter);

    return (
        <>
            <div className="canvas_map_blk">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={12}
                    mapId="2daacf9166accdfc385261c2"
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                >
                    {!isSingleLocation && directions && <DirectionsRenderer directions={directions} options={{ polylineOptions: { strokeColor: "blue", strokeWeight: 5 } }} />}


                    {/* Marker for single address */}
                    {isSingleLocation && fromLocation && (
                        <Marker
                            position={normalizeLatLng(fromLocation)}
                            icon={{
                                url: "/assets/images/marker.svg", // Customize as needed
                                scaledSize: new window.google.maps.Size(40, 40),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(20, 40),
                            }}
                        />
                    )}

                    {!isSingleLocation &&
                        fromLocation && (
                            <Marker
                                position={fromLocation}
                                icon={{
                                    url: "/assets/images/marker.svg",       // Path to your custom marker image
                                    scaledSize: new window.google.maps.Size(40, 40),  // Resize icon (optional)
                                    origin: new window.google.maps.Point(0, 0),       // Origin of the icon (optional)
                                    anchor: new window.google.maps.Point(20, 40),     // Anchor point (bottom center of icon)
                                }}
                            />
                        )}

                    {!isSingleLocation && toLocation && (
                        <Marker
                            position={toLocation}
                            icon={{
                                url: "/assets/images/red-marker.svg",
                                scaledSize: new window.google.maps.Size(40, 40),
                                origin: new window.google.maps.Point(0, 0),
                                anchor: new window.google.maps.Point(20, 40),
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </>
    );
};

export default GoogleMaps;
