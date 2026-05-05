import { useState } from "react";
import usePlaceAutocomplete from "../hooks/usePlaceAutocomplete";

function parseAddressComponents(components = []) {
    const get = (type) => {
        const comp = components.find(c => c.types.includes(type));
        return comp ? comp.long_name : "";
    };

    return {
        city: get("locality") || get("administrative_area_level_2"),
        country: get("country"),
        postcode: get("postal_code"),
    };
}
const FromInput = ({ from, setFrom, validationErrors, setValidationErrors, setFromLocation }) => {
    const [isUserTyping, setIsUserTyping] = useState(false);
    const { suggestions, fetchPlaceDetails, mapCenter, setMapCenter, clearSuggestions } = usePlaceAutocomplete(from, isUserTyping);
    return (
        <>
            <div className="ofcvs_form_item" style={{ position: "relative" }}>
                <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/green-point-icon.svg)' }} />
                <div className="ofcvs_form_field">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="From Location"
                        value={from}
                        onKeyDown={(e) => {
                            if (e.key === ' ' && e.currentTarget.value.trim() === '') e.preventDefault();
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFrom(value);
                            setIsUserTyping(true)
                            if (validationErrors.from) {
                                setValidationErrors(prev => ({ ...prev, from: false }));
                            }
                        }}
                        autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                        <ul className="autocomplete-suggestions">
                            {suggestions.map((s) => (
                                <li
                                    key={s.place_id}
                                    onClick={() => {
                                        fetchPlaceDetails(s.place_id, (place) => {
                                            setFrom(place.formatted_address || place.name);
                                            clearSuggestions();
                                            setIsUserTyping(false);
                                            if (place.geometry) {
                                                const loc = {
                                                    lat: place.geometry.location.lat(),
                                                    lng: place.geometry.location.lng(),
                                                };
                                                const addressData = parseAddressComponents(place.address_components || []);

                                                const startLocation = {
                                                    coordinates: {
                                                        latitude: loc.lat,
                                                        longitude: loc.lng,
                                                    },
                                                    locationName: place.name || place.formatted_address,
                                                    address: place.formatted_address || "",
                                                    ...addressData,
                                                };

                                                setFromLocation(startLocation);
                                                setMapCenter(loc);
                                            }
                                        });
                                    }}
                                >
                                    {s.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {validationErrors.from && <span className="error">{validationErrors.from}</span>}
        </>
    );
};

const ToInput = ({ to, setTo, validationErrors, setValidationErrors, setToLocation }) => {
    const [isUserTyping, setIsUserTyping] = useState(false);
    const { suggestions, fetchPlaceDetails, mapCenter, setMapCenter, clearSuggestions } = usePlaceAutocomplete(to, isUserTyping);

    return (
        <>
            <div className="ofcvs_form_item" style={{ position: "relative" }}>
                <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/red-point-icon.svg)' }} />
                <div className="ofcvs_form_field">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="To Location"
                        value={to}
                        onKeyDown={(e) => {
                            if (e.key === ' ' && e.currentTarget.value.trim() === '') e.preventDefault();
                        }}
                        onChange={(e) => {
                            const value = e.target.value;
                            setTo(value);
                            setIsUserTyping(true)
                            if (validationErrors.to) {
                                setValidationErrors(prev => ({ ...prev, to: false }));
                            }
                        }}
                        autoComplete="off"
                    />
                    {suggestions.length > 0 && (
                        <ul className="autocomplete-suggestions">
                            {suggestions.map((s) => (
                                <li
                                    key={s.place_id}
                                    onClick={() => {
                                        fetchPlaceDetails(s.place_id, (place) => {
                                            setTo(place.formatted_address || place.name);
                                            clearSuggestions();
                                            setIsUserTyping(false);
                                            if (place.geometry) {
                                                const loc = {
                                                    lat: place.geometry.location.lat(),
                                                    lng: place.geometry.location.lng(),
                                                };
                                                const addressData = parseAddressComponents(place.address_components || []);

                                                const endLocation = {
                                                    coordinates: {
                                                        latitude: loc.lat,
                                                        longitude: loc.lng,
                                                    },
                                                    locationName: place.name || place.formatted_address,
                                                    address: place.formatted_address || "",
                                                    ...addressData,
                                                };

                                                setToLocation(endLocation);
                                                setMapCenter(loc);    // Option
                                            }
                                        });
                                    }}
                                >
                                    {s.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            {validationErrors.to && <span className="error">{validationErrors.to}</span>}
        </>
    );
};

export { FromInput, ToInput };