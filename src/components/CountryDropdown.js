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

const CountryDropdown = ({ country, setCountry, validationErrors, setValidationErrors }) => {

    // Inputs
    const [countryInput, setCountryInput] = useState('');
    const [isTypingCountry, setIsTypingCountry] = useState(false);

    // Country hook
    const {
        suggestions: countrySuggestions,
        fetchPlaceDetails: fetchCountryDetails,
        clearSuggestions: clearCountrySuggestions
    } = useCountryCityAutocomplete(countryInput, isTypingCountry, ['(regions)']);

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

    useEffect(() => {
        setCountryInput(country)
    }, [country])

    return (

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
            {
                validationErrors.country && (
                    <span className="error text-danger">{validationErrors.country}</span>
                )
            }
        </div>
    )
};



export default CountryDropdown