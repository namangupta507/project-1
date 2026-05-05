import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputComponent = ({ phone, setPhone }) => {
    // const [phone, setPhone] = React.useState('');

    return (
        <div className="profile_fields">
            <label>Phone Number</label>
            <PhoneInput
                country={'in'}               // default country code
                value={phone}
                onChange={phone => setPhone(phone)}  // this includes country code + number
                inputProps={{
                    name: 'phoneNumber',
                    required: true,
                    autoFocus: false
                }}
                placeholder="Enter Phone Number"
                inputClass="form-control"
            />
        </div>
    );
}

export default PhoneInputComponent