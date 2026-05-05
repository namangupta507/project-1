import { Stack, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

const SingleFieldTimePickerComponent = ({ time, setTime, readOnly }) => {

    const handleFromChange = (newValue) => {
        if (newValue) {
            setTime(newValue);
        }
    };

    console.log(time, "time")

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className="ofcvs_form_item">
                <span className="ofcvs_field_icon" style={{ background: 'url(/assets/images/clock-icon.svg)' }} />
                <div className='ofcvs_form_field'>
                    <Stack direction="row" gap={2} alignItems="center">
                        <TimePicker
                            // label="From"
                            value={time}
                            readOnly={readOnly}
                            onChange={handleFromChange}
                            ampm
                            viewRenderers={{
                                hours: renderTimeViewClock,
                                minutes: renderTimeViewClock,
                                seconds: renderTimeViewClock,
                            }}
                            slotProps={{
                                textField: {
                                    // variant: 'outlined',
                                    // size: 'small',
                                },
                            }}
                        />

                    </Stack>
                </div>

            </div>
        </LocalizationProvider>
    );
};


export default SingleFieldTimePickerComponent