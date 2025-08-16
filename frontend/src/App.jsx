import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import './styles/globals.css';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import SeoTools from './components/SeoTools';
import KeywordTools from './components/KeywordTools';
import LicensePanel from './components/LicensePanel';
import PaymentForm from './components/PaymentForm';
import LandingPage from './components/LandingPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/seo-tools" element={<SeoTools />} />
              <Route path="/keyword-tools" element={<KeywordTools />} />
              <Route path="/license" element={<LicensePanel />} />
              <Route path="/payment" element={<PaymentForm />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;