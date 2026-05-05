import React from 'react'
import TripMapImage from './StaticMap';

const TripsImageModal = ({ selectedTripLocations }) => {
    return (

        <div className="dropdown-menu map-preview">
            <div>
                <TripMapImage fromLocation={selectedTripLocations?.fromLocation}
                    toLocation={selectedTripLocations?.toLocation} />
            </div>
        </div>

        // <div className="modal fade" id="tripsImage" tabIndex={-1} aria-labelledby="tripsImageLabel" aria-hidden="true">
        //     <div className="modal-dialog">
        //         <div className="modal-content border-0">
        //             <div className="modal-body py-2">
        //                 <TripMapImage fromLocation={selectedTripLocations?.fromLocation}
        //                     toLocation={selectedTripLocations?.toLocation} />
        //             </div>

        //         </div>
        //     </div>
        // </div>

    )
}

export default TripsImageModal