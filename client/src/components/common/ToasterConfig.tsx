import { Toaster } from 'react-hot-toast';

export const ToasterConfig = () => (
  <Toaster
    position="bottom-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid #333',
      },
    }}
  />
);
