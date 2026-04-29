import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'swiper/css'
import 'swiper/css/pagination'
import { HelmetProvider } from 'react-helmet-async'
import { PageLoaderProvider } from './context/PageLoaderContext.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLoaderProvider>
      <HelmetProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </PageLoaderProvider>
  </StrictMode>
)
