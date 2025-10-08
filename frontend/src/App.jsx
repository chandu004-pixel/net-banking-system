import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Addkyc from './pages/Addkyc'
import Viewkyc from './pages/Viewkyc'
import Navbardata from './components/Navbardata'

const App = () => {
  return<>
  <BrowserRouter>
  <Navbardata/>
    <Routes>
      <Route path='/' element={<Addkyc/>}/>
      <Route path='/Addkyc' element={<Addkyc/>}/>
      <Route path='/Viewkyc' element={<Viewkyc/>}/>
    </Routes>
  </BrowserRouter>
  </>
}

export default App
