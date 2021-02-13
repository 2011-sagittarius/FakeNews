import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => (
  <nav>
    <h1 onClick={() => window.location.reload(false)} className="link">
      Infaux Wars
    </h1>
    <Link to="/hall">More Info</Link>
  </nav>
)

export default Navbar
