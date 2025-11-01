import toast from 'react-hot-toast';

export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    toast.error(message);

    if (error.response.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/auth';
    }
  } else if (error.request) {
    // Request made but no response
    toast.error('No response from server. Please check your connection.');
  } else {
    // Other errors
    toast.error('An unexpected error occurred');
  }

  console.error('API Error:', error);
};
