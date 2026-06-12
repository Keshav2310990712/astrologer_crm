import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-cosmic-950 text-slate-100 relative selection:bg-cosmic-500 selection:text-white">
            {/* Subtle starry overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cosmic-900/10 via-transparent to-transparent pointer-events-none z-0"></div>
            
            <Navbar />
            
            <main className="flex-1 flex flex-col relative z-10">
              <AppRoutes />
            </main>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
