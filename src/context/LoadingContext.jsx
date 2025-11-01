import React, { createContext, useContext, useState } from 'react';
import Loading from '../components/common/Loading';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoading = (msg = '') => { setMessage(msg); setLoading(true); };
  const hideLoading = () => { setMessage(''); setLoading(false); };

  return (
    <LoadingContext.Provider value={{ loading, message, showLoading, hideLoading }}>
      {children}
      {loading && <Loading fullScreen message={message || 'Please wait...'} />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;


