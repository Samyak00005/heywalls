import { BrowserRouter } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import { ToastProvider } from './components/common/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <AppRoutes />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
