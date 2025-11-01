import React from 'react';

const Loading = ({ fullScreen = false, message = 'Loading...' }) => {
    const containerStyle = fullScreen ? {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        zIndex: 1050
    } : { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 };

    const boxStyle = { textAlign: 'center', color: '#fff' };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                <div className="spinner-border text-info" role="status" style={{ width: 48, height: 48 }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                {message && <div style={{ marginTop: 12, color: 'var(--text-muted)' }}>{message}</div>}
            </div>
        </div>
    );
};

export default Loading;


