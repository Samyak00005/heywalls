import { useEffect } from 'react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import { ToastProvider } from './components/common/ToastContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
