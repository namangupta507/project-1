import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const GetInTouchLink = () => {
    const { response: profileResponse } = useSelector((state) => state.profile);
    const userEmail = profileResponse?.user?.email || '';
    const adminEmail = "support@lujytech.com";

    const mailtoLink = `mailto:${adminEmail}?subject=Support%20Request&body=Hello%2C%0D%0A%0D%0AMy%20email%20is%3A%20${encodeURIComponent(userEmail)}.%20Please%20assist%20me.%0D%0A%0D%0AThanks!`;

    return (
        <li>
            <a
                href={mailtoLink}
                className="submenu_link"
                onClick={() => {
                    // Optional: trigger active state update in parent
                }}
            >
                Get in Touch
            </a>
        </li>
    );
};

export default GetInTouchLink;
