import toast from 'react-hot-toast';

export const toastConfig = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        background: '#10b981',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        background: '#ef4444',
        color: '#fff',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    }),

  loading: (message: string) =>
    toast.loading(message, {
      style: {
        background: '#D4A574',
        color: '#000',
      },
    }),
};
