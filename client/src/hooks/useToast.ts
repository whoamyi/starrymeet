import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message: string) => {
      toast.success(message, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    },
    error: (message: string) => {
      toast.error(message, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    },
    info: (message: string) => {
      toast(message, {
        duration: 3000,
        position: 'top-center',
        icon: 'ℹ️',
      });
    },
  };
};

// Export as named export for easier imports
export const toastConfig = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#fff',
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    });
  },
  info: (message: string) => {
    toast(message, {
      duration: 3000,
      position: 'top-center',
      icon: 'ℹ️',
    });
  },
};
