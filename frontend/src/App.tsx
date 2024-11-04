// frontend/src/App.tsx
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from './routes';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App font-mono h-screen">
        <Router />
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
