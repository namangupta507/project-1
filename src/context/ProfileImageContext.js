import { useState, createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import backend_url from '../services/endpoints';

const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
    const [profileImage, setProfileImage] = useState('');

    const { response: profileResponse } = useSelector((state) => state.profile);

    const updateProfileImage = (newImageUrl) => {
        setProfileImage(newImageUrl)
    }

    useEffect(() => {
        if (profileResponse?.user?.profileImage) {

            const profile_image_url = `${backend_url}/public/uploads${profileResponse?.user?.profileImage}`;
            setProfileImage(profile_image_url);
        } else {
            setProfileImage('/assets/images/user.png');
        }
    }, [profileResponse])

    return (
        <ProfileImageContext.Provider value={{ profileImage, updateProfileImage }}>
            {children}
        </ProfileImageContext.Provider>
    );
};

export const useProfileImage = () => useContext(ProfileImageContext);
