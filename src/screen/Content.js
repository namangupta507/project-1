import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { GetContentApi } from '../redux/actions/auth/GetContentAction';
import { PulseLoader } from 'react-spinners';

const Content = ({ privacyType }) => {
    const dispatch = useDispatch();
    const [content, setContent] = useState('');
    const { response, loading, error } = useSelector((state) => state.getContent);

    useEffect(() => {
        dispatch(GetContentApi({ privacyType }))
    }, [privacyType])

    useEffect(() => {
        if (response) {
            setContent(response?.data?.htmlContent)
        }
    }, [response])

    console.log(response, "response")

    return (
        <>
            {privacyType ?
                <>
                    {
                        loading
                            ? (
                                // Show loading spinner while data is being fetched
                                <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                                    <PulseLoader size={25} color="#49a496" />
                                </div >
                            ) : error ? (
                                // Display error message if there is an issue fetching data
                                <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center'>
                                    <p className='text-danger'>Something went wrong</p>
                                </div>
                            ) : <>
                                <section className='main-section spacer-y'>

                                    <div className='container'>
                                        <div className='tc_content' dangerouslySetInnerHTML={{ __html: content }} />

                                    </div>
                                </section>
                            </>

                    }
                </>
                :
                <div style={{ height: '100vh' }} className='d-flex align-items-center justify-content-center' >
                    <PulseLoader size={25} color="#49a496" />
                </div>
            }
        </>
    )
}

export default Content