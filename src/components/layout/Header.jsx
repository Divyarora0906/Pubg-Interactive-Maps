import React from 'react'
import Logo from  "../../assets/images/logo.png"
import "../../pages/landing/Landing.css"
const Header = () => {
  return (
    <>
     <header>
        <div className='Header_Container'>
            <div className='Header_Title'>
              <img src={Logo} alt="Logo" className='Logo' />
            </div>
        </div>
     </header>
    </>
  )
}

export default Header