import React, { useEffect, useRef } from 'react';

const PlaceAutocompleteElementWrapper = ({ onPlaceSelected, ...props }) => {
    const autocompleteRef = useRef(null);

    useEffect(() => {
        const autocompleteEl = autocompleteRef.current;

        if (!autocompleteEl) return;

        const listener = () => {
            const place = autocompleteEl.getPlace();
            if (place) {
                onPlaceSelected(place);
            }
        };

        autocompleteEl.addEventListener('place_changed', listener);

        return () => {
            autocompleteEl.removeEventListener('place_changed', listener);
        };
    }, [onPlaceSelected]);

    return (
        <google-maps-places-autocomplete
            ref={autocompleteRef}
            style={{ width: '100%', height: '40px', fontSize: '16px' }}
            {...props}
        />
    );
};

export default PlaceAutocompleteElementWrapper;
