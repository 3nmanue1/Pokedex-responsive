import React from 'react'
import * as FaIcons from "react-icons/fa";
import './header.css'
import logo from "../../../assets/logoP2.png"

function header({obtenerSearch}) {
  return (
    <nav>
        <div className='content-enca'> 
            <div className='img-logo'>
                <img src={logo} alt="Logo de pokemon" />
            </div>
            <div className='buscador'>
              <div className='icono'>
                <FaIcons.FaSearch />
              </div>
                <input type="search" onChange={(e) => obtenerSearch(e.target.value)} />
            </div>
        </div>
    </nav>
   
  )
}

export default header;