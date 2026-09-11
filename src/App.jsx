import { BrowserRouter } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
