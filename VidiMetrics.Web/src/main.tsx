import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { AuthProvider } from 'react-oidc-context'
import { store } from '@/store'
import App from '@/App'
import AuthSync from '@/components/auth/AuthSync'
import '@/css/index.css'

import { authService } from '@/api/authConfig'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider userManager={authService} onSigninCallback={() => {
        window.history.replaceState({}, document.title, window.location.pathname)
      }}>
        <AuthSync />
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(10, 10, 10, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
