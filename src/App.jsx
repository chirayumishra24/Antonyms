import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import M1Ch1 from './pages/M1Ch1'
import M1Ch2 from './pages/M1Ch2'
import M2Ch1 from './pages/M2Ch1'
import M2Ch2 from './pages/M2Ch2'
import ComicBackground from './components/ComicBackground'

function App() {
  return (
    <>
      <div className="comic-bg" />
      <ComicBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/m1/ch1" element={<M1Ch1 />} />
        <Route path="/m1/ch2" element={<M1Ch2 />} />
        <Route path="/m2/ch1" element={<M2Ch1 />} />
        <Route path="/m2/ch2" element={<M2Ch2 />} />
      </Routes>
    </>
  )
}

export default App
