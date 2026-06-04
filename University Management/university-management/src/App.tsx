import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './modules/auth/context/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/utils/queryClient';
import { router } from './routes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
