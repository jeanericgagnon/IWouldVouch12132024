import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationProvider } from './context/NavigationContext';
import App from './App';
import './index.css';
import './lib/firebase/config';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <NavigationProvider>
            <App />
          </NavigationProvider>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);