import React from 'react'

const Navbar = () => (
  <nav>
    <h1 onClick={() => window.location.reload(false)} className="link">
      Infaux Wars
    </h1>
  </nav>
)

export default Navbar
