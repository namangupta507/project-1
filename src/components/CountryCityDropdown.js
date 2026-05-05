import React, { useEffect, useState } from 'react';
import useCountryCityAutocomplete from '../hooks/useCountryCityAutoComplete';

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

const CountryCityDropdown = ({ city, country, setCity, setCountry, validationErrors, setValidationErrors }) => {
    // Inputs
    const [countryInput, setCountryInput] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [isTypingCountry, setIsTypingCountry] = useState(false);
    const [isTypingCity, setIsTypingCity] = useState(false);

    // Country hook
    const {
        suggestions: countrySuggestions,
        fetchPlaceDetails: fetchCountryDetails,
        clearSuggestions: clearCountrySuggestions
    } = useCountryCityAutocomplete(countryInput, isTypingCountry, ['(regions)']);

    // City hook
    const {
        suggestions: citySuggestions,
        fetchPlaceDetails: fetchCityDetails,
        clearSuggestions: clearCitySuggestions
    } = useCountryCityAutocomplete(cityInput, isTypingCity, ['(cities)']);

    const handleCountrySelect = (s) => {
        fetchCountryDetails(s.place_id, (place) => {
            const parsed = parseAddressComponents(place.address_components || []);
            setCountry(place.formatted_address || place.name || '');
            setCountryInput(place.formatted_address || place.name || '');
            clearCountrySuggestions();
            setIsTypingCountry(false);
            if (validationErrors.country) {
                setValidationErrors(prev => ({ ...prev, country: false }));
            }
        });
    };

    const handleCitySelect = (s) => {
        fetchCityDetails(s.place_id, (place) => {
            const parsed = parseAddressComponents(place.address_components || []);
            setCity(place.formatted_address || place.name || '');
            setCityInput(place.formatted_address || place.name || '');
            clearCitySuggestions();
            setIsTypingCity(false);
            if (validationErrors.city) {
                setValidationErrors(prev => ({ ...prev, city: false }));
            }
        });
    };

    useEffect(() => {
        setCountryInput(country || '');
    }, [country]);

    useEffect(() => {
        setCityInput(city || '');
    }, [city]);

    return (
        <>
            {/* Country */}
            <div className="ofcvs_form_item" style={{ position: 'relative' }}>
                <label>Country</label>
                <div className="ofcvs_form_field">
                    <input
                        type="text"
                        className={`form-control ${validationErrors.country ? 'is-invalid' : ''}`}
                        placeholder="Search Country"
                        value={countryInput}
                        onChange={(e) => {
                            setCountryInput(e.target.value);
                            setIsTypingCountry(true);
                            setCountry(e.target.value)

                            if (e.target.value.trim() === '') {
                                setCountry('');
                                setValidationErrors(prev => ({ ...prev, country: 'Country is required' }));
                            }
                        }}
                        autoComplete="off"
                    />
                    {countrySuggestions.length > 0 && (
                        <ul className="autocomplete-suggestions">
                            {countrySuggestions.map((s) => (
                                <li key={s.place_id} onClick={() => handleCountrySelect(s)}>
                                    {s.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {validationErrors.country && (
                    <span className="error text-danger">{validationErrors.country}</span>
                )}
            </div>

            {/* City */}
            <div className="ofcvs_form_item" style={{ position: 'relative' }}>
                <label>City</label>
                <div className="ofcvs_form_field">
                    <input
                        type="text"
                        className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                        placeholder="Search City"
                        value={cityInput}
                        onChange={(e) => {
                            setCityInput(e.target.value);
                            setCity(e.target.value)
                            setIsTypingCity(true);

                            if (e.target.value.trim() === '') {
                                setCity('');
                                setValidationErrors(prev => ({ ...prev, city: 'City is required' }));
                            }
                        }}
                        autoComplete="off"
                    />
                    {citySuggestions.length > 0 && (
                        <ul className="autocomplete-suggestions">
                            {citySuggestions.map((s) => (
                                <li key={s.place_id} onClick={() => handleCitySelect(s)}>
                                    {s.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {validationErrors.city && (
                    <span className="error text-danger">{validationErrors.city}</span>
                )}
            </div>
        </>
    );
};

export default CountryCityDropdown;
