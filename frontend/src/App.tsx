import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from './routes';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <div className="App font-mono h-screen">
          <Router />
        </div>
        {/* 진행 표시줄을 숨김 */}
        <ToastContainer hideProgressBar={true} />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
