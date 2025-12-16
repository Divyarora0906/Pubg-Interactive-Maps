import React from 'react'
import "./pages/landing/Landing.css"
import HeroSection from './pages/landing/HeroSection'
import {Snowfall} from "react-snowfall"
import Opening from './animations/Opening'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
const App = () => {
  return (
    <>
    <Opening />
     <Snowfall snowflakeCount={200}/>
     <Header />
     <HeroSection />
     <Footer />
    </>
  )
}

export default App