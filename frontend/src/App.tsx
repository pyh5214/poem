import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import {
  GeneratePage,
  ResultPage,
  LibraryPage,
  CapturePage,
  SettingsPage,
  LoginPage,
  AuthCallbackPage,
} from './pages';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Protected routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={
                  <ProtectedRoute>
                    <GeneratePage />
                  </ProtectedRoute>
                } />
                <Route path="/result" element={
                  <ProtectedRoute>
                    <ResultPage />
                  </ProtectedRoute>
                } />
                <Route path="/library" element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
              </Route>
              <Route path="/capture" element={
                <ProtectedRoute>
                  <CapturePage />
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
