import { useState } from 'react';
import { Stack, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const TimePickerComponent = ({ timeFrom, timeTo, setTimeFrom, setTimeTo, errorTime, setErrorTime }) => {

    const validateTime = (from, to) => {
        if (to <= from) {
            setErrorTime('To Time should be greater than From Time');
        } else {
            setErrorTime('');
        }
    };

    const handleFromChange = (newValue) => {
        if (newValue) {
            setTimeFrom(newValue);
            validateTime(newValue, timeTo);
        }
    };

    const handleToChange = (newValue) => {
        if (newValue) {
            setTimeTo(newValue);
            validateTime(timeFrom, newValue);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="ofcvs_form_item multi_time_picker">
                <Stack direction="row" gap={2} alignItems="center">
                    <TimePicker
                        // label="From"
                        value={timeFrom}
                        onChange={handleFromChange}
                        ampm
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                        slotProps={{
                            textField: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        }}
                    />
                    <Typography>To</Typography>
                    <TimePicker
                        // label="To"
                        value={timeTo}
                        onChange={handleToChange}
                        ampm
                        viewRenderers={{
                            hours: renderTimeViewClock,
                            minutes: renderTimeViewClock,
                            seconds: renderTimeViewClock,
                        }}
                        slotProps={{
                            textField: {
                                variant: 'outlined',
                                size: 'small',
                            },
                        }}
                    />
                </Stack>
                {errorTime && (
                    <Typography color="error" fontSize={12} mt={1} id="toError">
                        {errorTime}
                    </Typography>
                )}
            </div>
        </LocalizationProvider>
    );
};

export default TimePickerComponent;
