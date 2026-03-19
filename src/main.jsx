import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'swiper/css'
import 'swiper/css/pagination'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import { PageLoaderProvider } from './context/PageLoaderContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PageLoaderProvider>
      <WishlistProvider>
        <HelmetProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </HelmetProvider>
      </WishlistProvider>
    </PageLoaderProvider>
  </StrictMode>
)
