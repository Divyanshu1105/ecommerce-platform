import { Routes, Route } from 'react-router';
import { HomePage } from './pages/HomePage'
import './App.css'

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />}></Route> */}
      <Route index element={<HomePage />} />
      <Route path="/checkout" element={<div>Test here!</div>} />
    </Routes>
  )
}

export default App
