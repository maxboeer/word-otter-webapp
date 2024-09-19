import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './index.css'

import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
    colorSchemes: {
        dark: true,
    },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
          <App />
      </ThemeProvider>
  </StrictMode>,
)
