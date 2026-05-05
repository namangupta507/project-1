import React, { useEffect, useState } from 'react';

const TripMapImage = ({ fromLocation, toLocation }) => {
    const [encodedPath, setEncodedPath] = useState(null);

    useEffect(() => {
        if (!fromLocation || !toLocation || !window.google) return;

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: { lat: fromLocation.coordinates.latitude, lng: fromLocation.coordinates.longitude },
                destination: { lat: toLocation.coordinates.latitude, lng: toLocation.coordinates.longitude },
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK && result.routes.length > 0) {
                    const polyline = result.routes[0].overview_polyline;
                    setEncodedPath(polyline);
                } else {
                    console.error('Directions request failed due to ', status);
                }
            }
        );
    }, [fromLocation, toLocation]);

    if (!encodedPath) return <p>Loading map...</p>;

    const origin = `${fromLocation.coordinates.latitude},${fromLocation.coordinates.longitude}`;
    const destination = `${toLocation.coordinates.latitude},${toLocation.coordinates.longitude}`;

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=400x300
    &path=enc:${encodedPath}
    &markers=color:green|label:S|${origin}
    &markers=color:red|label:E|${destination}
    &key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`.replace(/\s+/g, '');

    return <img src={mapUrl} alt="Trip route map" style={{ width: '100%', height: 'auto' }} />;
};

export default TripMapImage;
