import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import {
  GeneratePage,
  ResultPage,
  LibraryPage,
  CapturePage,
  SettingsPage,
} from './pages';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<GeneratePage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            <Route path="/capture" element={<CapturePage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
