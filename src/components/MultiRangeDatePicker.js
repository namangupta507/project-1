import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const MultiRangeDatePicker = ({ dateRange, setDateRange, validationErrors, setValidationErrors, iconToShow = true }) => {
    const [startDate, endDate] = dateRange;

    const handleKeyDown = (e) => {
        e.preventDefault();
    };

    const handleChange = (update) => {
        setDateRange(update);

        // Clear validation error when user picks a valid range
        if (validationErrors.dateRange) {
            setValidationErrors(prev => ({ ...prev, dateRange: false }));
        }
    };

    console.log(iconToShow, "iconToShow")
    return (
        <div className="ofcvs_form_item">
            {
                iconToShow && <span
                    className="ofcvs_field_icon"
                    style={{ background: 'url(/assets/images/cal-black-icon.svg)' }}
                />}
            <div className="ofcvs_form_field">
                <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                        handleChange(update);
                    }}
                    isClearable={true}
                    placeholderText="Select date range"
                    className="form-control"
                    onKeyDown={handleKeyDown}
                />
            </div>
            {validationErrors.dateRange && (
                <span className="error">{validationErrors.dateRange}</span>
            )}
        </div>
    );
};
export default MultiRangeDatePicker