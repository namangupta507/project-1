import React from "react";
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

const DatePickerComponent = ({ date, setDate, readOnly, format, validationErrors, setValidationErrors }) => {
    // const [startDate, setStartDate] = useState(new Date());
    return <DatePicker readOnly={readOnly} selected={date} format={format} maxDate={new Date()}
        onChange={(newDate) => {
            if (!newDate) return;
            const year = newDate.getFullYear();
            const month = String(newDate.getMonth() + 1).padStart(2, '0');
            const day = String(newDate.getDate()).padStart(2, '0');

            setDate(`${year}-${month}-${day}`);

            if (validationErrors.date) {
                setValidationErrors(prev => ({ ...prev, date: false }));
            }
        }}
        // onChange={(newDate) => {
        //     setDate(newDate?.toISOString()?.split('T')[0]);
        //     if (validationErrors.date) {
        //         setValidationErrors(prev => ({ ...prev, date: false }));
        //     }
        // }}
        onFocus={(e) => e.target.blur()} placeholderText="Select a Date"
        customInput={<CustomInput />}
    />;
};

export default DatePickerComponent;