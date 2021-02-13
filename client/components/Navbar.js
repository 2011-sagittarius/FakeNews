import React from 'react'
import {Link} from 'react-router-dom'
import {FlexCol} from '../components'

const Navbar = props => {
  const handleClick = () => {
    console.log(window.location.pathname)
    if (window.location.pathname === '/') window.location.reload(false)
  }
  return (
    <nav onClick={handleClick}>
      <FlexCol>
        <Link to="/">
          <h1 className="link">Infaux Wars</h1>
        </Link>
        <Link href="style.css" to="/hall">
          <h3>Hall of Fame</h3>
        </Link>
      </FlexCol>
    </nav>
  )
}

export default Navbar
