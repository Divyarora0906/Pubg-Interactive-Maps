import React from 'react'
import "./pages/landing/Landing.css"
import HeroSection from './pages/landing/HeroSection'
import Opening from './animations/Opening'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import IGL from './components/layout/IGL'
import Miramar from "/MiramarMain.jpg"
import Erangel from "/Map.jpeg";
import { Route, Routes } from 'react-router-dom'
import ComingSoon from './pages/landing/ComingSoon'
const App = () => {
  return (
    <>
    <Opening />
    <Header />
    <Routes>
      <Route path='/' element={<HeroSection />}></Route>
      <Route path='/Erangel' element={<IGL img={Erangel}/>}></Route>
      <Route path='/Miramar' element={<IGL img={Miramar}/>}></Route>
      <Route path='/CS' element={<ComingSoon />}></Route>
    </Routes>
    <Footer />
    </>
  )
}

export default App