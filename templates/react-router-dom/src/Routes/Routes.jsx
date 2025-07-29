import { Routes, Route } from 'react-router-dom'
import HomePage from '../Pages/Home'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add more routes here */}
    </Routes>
  )
}

export default AppRoutes
