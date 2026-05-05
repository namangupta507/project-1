import React from 'react';
import { PulseLoader } from 'react-spinners';

const FullPageLoader = () => (
    <div className="full-page-loader">
        {/* <div className="spinner"></div> */}
        <PulseLoader color='#4ea396' size={24} />
    </div>
);

export default FullPageLoader;
