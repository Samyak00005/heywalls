import { BrowserRouter } from 'react-router-dom'
import Layout from './components/common/Layout.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  )
}

export default App
