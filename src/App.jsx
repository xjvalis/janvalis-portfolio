import { Analytics } from '@vercel/analytics/react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Navigation from '@/components/Navigation';
import CustomCursor from '@/components/CustomCursor';
import Home from '@/pages/Home';
import Commercial, { Other } from '@/pages/Commercial';
import Bio from '@/pages/Bio';
import Contact from '@/pages/Contact';
import LoginPage from '@/pages/LoginPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminSettings from '@/pages/admin/AdminSettings';
import ProtectedAdminRoute from '@/pages/ProtectedAdminRoute';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <CustomCursor />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/other" element={<Other />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminProjects />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
      <Analytics />
    </QueryClientProvider>
  );
}

export default App;
