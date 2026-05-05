import React from 'react'
import { PuffLoader } from 'react-spinners'

const UnderDevelopment = () => {
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: 'calc(100vh - 89px)'
            }}>
                <PuffLoader color="#000000" size={120} />
                <p style={{
                    marginTop: '20px',
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize: '30px',
                    textAlign: 'center'
                }}>
                    Under Development
                </p>
            </div>
        </>
    )
}

export default UnderDevelopment