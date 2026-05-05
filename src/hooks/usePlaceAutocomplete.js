// hooks/usePlaceAutocomplete.js
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function usePlaceAutocomplete(inputValue, isUserTyping = false) {
    const { isLoaded, mapCenter, setMapCenter } = useContext(AuthContext);
    const [suggestions, setSuggestions] = useState([]);
    const serviceRef = useRef(null);
    const sessionTokenRef = useRef(null);

    const clearSuggestions = () => setSuggestions([]);

    useEffect(() => {
        if (isLoaded && window.google && window.google.maps && window.google.maps.places) {
            serviceRef.current = new window.google.maps.places.AutocompleteService();
            sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        }
    }, [isLoaded]);

    useEffect(() => {
        if (!isUserTyping || !inputValue || !serviceRef.current) {
            setSuggestions([]);
            return;
        }

        serviceRef.current.getPlacePredictions(
            {
                input: inputValue,
                sessionToken: sessionTokenRef.current,
            },
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);
                } else {
                    setSuggestions([]);
                }
            }
        );
    }, [inputValue, isUserTyping]);

    const fetchPlaceDetails = (placeId, callback) => {
        const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
        placesService.getDetails(
            {
                placeId,
                fields: ["geometry", "formatted_address", "name", "address_components"],
                sessionToken: sessionTokenRef.current,
            },
            (place, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken(); // reset token
                    callback(place);
                }
            }
        );
    };

    return {
        suggestions,
        fetchPlaceDetails,
        mapCenter, setMapCenter, clearSuggestions
    };
}
