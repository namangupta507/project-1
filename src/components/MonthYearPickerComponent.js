import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const CustomInput = React.forwardRef((props, ref) => (
    <input
        {...props}
        ref={ref}
        readOnly
        onKeyDown={e => e.preventDefault()} // Prevent typing
    />
));

const MonthYearPickerComponent = ({ date, onChangeDate }) => {
    return (
        <DatePicker
            selected={date}
            onChange={onChangeDate}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            onFocus={(e) => e.target.blur()}
            customInput={<CustomInput />}
        // className="filter_action_btn cal_btn"
        />
    );
}

export default MonthYearPickerComponent